"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { analyzeSamples } from "@/lib/analyze";
import { scoreCheckIn } from "@/lib/score";
import { synthesizeSpeech } from "@/lib/samples";
import { loadCheckIns, priorScores, saveCheckIn } from "@/lib/storage";
import type { CheckIn as CheckInRecord, CheckInSource, SampleKind, VoiceFeatures } from "@/lib/types";
import { ToneResult } from "@/components/ToneResult";

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function clock(seconds: number): string {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

function recognitionCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function subscribeSpeech(): () => void {
  return () => undefined;
}

export function CheckIn() {
  const [phase, setPhase] = useState<"idle" | "recording" | "analyzing" | "result">("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckInRecord | null>(null);
  const speechSupported = useSyncExternalStore(subscribeSpeech, () => recognitionCtor() != null, () => false);
  const phaseRef = useRef(phase);
  const featuresRef = useRef<VoiceFeatures | null>(null);
  const resultRef = useRef<CheckInRecord | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const transcriptRef = useRef("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const focusResult = useRef(false);

  const publish = useCallback(
    (features: VoiceFeatures, source: CheckInSource, transcript: string, existing?: CheckInRecord) => {
      const next = scoreCheckIn({
        features,
        transcript,
        history: priorScores(loadCheckIns(), existing?.id),
        source,
        id: existing?.id,
        now: existing?.createdAt,
      });
      featuresRef.current = features;
      resultRef.current = next;
      if (next.status === "ready") saveCheckIn(next);
      if (!existing) focusResult.current = true;
      setResult(next);
      phaseRef.current = "result";
      setPhase("result");
    },
    [],
  );

  const stopRecording = useCallback(async () => {
    if (phaseRef.current !== "recording") return;
    phaseRef.current = "analyzing";
    setPhase("analyzing");
    setError(null);

    const recognition = recognitionRef.current;
    const recognitionDone = new Promise<void>((resolve) => {
      if (!recognition) {
        resolve();
        return;
      }
      const timer = window.setTimeout(resolve, 800);
      recognition.onend = () => {
        window.clearTimeout(timer);
        resolve();
      };
      try {
        recognition.stop();
      } catch {
        window.clearTimeout(timer);
        resolve();
      }
    });

    const recorder = recorderRef.current;
    const recorded = new Promise<void>((resolve) => {
      if (!recorder || recorder.state === "inactive") {
        resolve();
        return;
      }
      recorder.onstop = () => resolve();
      try {
        recorder.stop();
      } catch {
        resolve();
      }
    });

    await Promise.all([recorded, recognitionDone]);
    const audio = audioRef.current;
    try {
      if (!audio || chunksRef.current.length === 0) throw new Error("empty");
      const blob = new Blob(chunksRef.current, { type: recorder?.mimeType || "audio/webm" });
      const buffer = await audio.decodeAudioData(await blob.arrayBuffer());
      publish(analyzeSamples(buffer.getChannelData(0), buffer.sampleRate), "microphone", transcriptRef.current);
    } catch {
      setError("That clip could not be read. Try recording again.");
      phaseRef.current = "idle";
      setPhase("idle");
    } finally {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      recorderRef.current = null;
      recognitionRef.current = null;
      analyserRef.current = null;
      await audio?.close().catch(() => undefined);
      audioRef.current = null;
    }
  }, [publish]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      void audioRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (phase !== "recording") return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      setSeconds(elapsed);
      if (elapsed >= 90) void stopRecording();
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, stopRecording]);

  useEffect(() => {
    if (phase !== "recording") return;
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;
    const data = new Uint8Array(analyser.fftSize);
    let frame = 0;
    const draw = () => {
      frame = window.requestAnimationFrame(draw);
      const context = canvas.getContext("2d");
      if (!context) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      analyser.getByteTimeDomainData(data);
      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.strokeStyle = "#b5522a";
      context.lineWidth = 2;
      const step = Math.max(1, Math.floor(data.length / width));
      for (let x = 0; x < width; x++) {
        const value = (data[Math.min(data.length - 1, x * step)] ?? 128) / 128 - 1;
        const y = height / 2 + value * (height / 2 - 4);
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase === "result" && focusResult.current) {
      headingRef.current?.focus();
      focusResult.current = false;
    }
  }, [phase, result]);

  async function startRecording() {
    if (phaseRef.current === "recording" || phaseRef.current === "analyzing") return;
    setError(null);
    setSeconds(0);
    transcriptRef.current = "";
    chunksRef.current = [];
    phaseRef.current = "analyzing";
    setPhase("analyzing");
    let stream: MediaStream | null = null;
    let audio: AudioContext | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audio = new AudioContext();
      await audio.resume();
      const source = audio.createMediaStreamSource(stream);
      const analyser = audio.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      const Ctor = recognitionCtor();
      if (Ctor) {
        const recognition = new Ctor();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let text = "";
          for (let i = 0; i < event.results.length; i++) text += `${event.results[i]?.[0]?.transcript ?? ""} `;
          transcriptRef.current = text.trim();
        };
        recognition.onerror = () => undefined;
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          recognitionRef.current = null;
        }
      }
      streamRef.current = stream;
      audioRef.current = audio;
      analyserRef.current = analyser;
      recorderRef.current = recorder;
      recorder.start();
      phaseRef.current = "recording";
      setPhase("recording");
    } catch (err) {
      stream?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      recorderRef.current = null;
      analyserRef.current = null;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* recognition may already be stopped */
      }
      recognitionRef.current = null;
      void audio?.close();
      audioRef.current = null;
      phaseRef.current = "idle";
      setPhase("idle");
      const name = err instanceof DOMException ? err.name : "";
      setError(
        name === "NotAllowedError"
          ? "The microphone is blocked. Allow it for this site, or try an example voice below."
          : name === "NotFoundError"
            ? "No microphone was found. You can still try an example voice."
            : "The microphone could not start. You can still try an example voice.",
      );
    }
  }

  function runSample(kind: SampleKind) {
    if (phaseRef.current === "recording" || phaseRef.current === "analyzing") return;
    setError(null);
    phaseRef.current = "analyzing";
    setPhase("analyzing");
    window.setTimeout(() => {
      const transcript =
        kind === "settled"
          ? "Today felt calm. I am grateful I got outside and I feel a little lighter."
          : "Today felt heavy. I am tired, stuck, and overwhelmed.";
      publish(analyzeSamples(synthesizeSpeech(kind), 16000), "sample", transcript);
    }, 280);
  }

  const busy = phase === "recording" || phase === "analyzing";

  return (
    <>
      <section className="cd-panel">
        <p className="cd-kicker">Today&apos;s check-in</p>
        <h1>How has today felt?</h1>
        <p className="cd-lead">
          Speak for about half a minute in ordinary words. Cadence reflects the pace, melody, and pauses in your own
          voice. This is for the person speaking — not a way to score someone else.
        </p>
        <ul className="cd-prompts">
          <li>What took up space today</li>
          <li>What felt lighter</li>
          <li>What you want tomorrow to be like</li>
        </ul>
        <div className="cd-record-row">
          {phase === "recording" ? (
            <button type="button" className="cd-record" data-live="true" data-testid="stop-recording" onClick={() => void stopRecording()}>
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="cd-record"
              data-testid="start-recording"
              disabled={phase === "analyzing"}
              onClick={() => void startRecording()}
            >
              {phase === "analyzing" ? "…" : "Record"}
            </button>
          )}
          <div>
            <p className="cd-clock" aria-live="polite">
              {phase === "recording" ? clock(seconds) : phase === "analyzing" ? "Listening" : "0:00"}
            </p>
            <p className="cd-hint">
              {phase === "recording"
                ? "Stop whenever you have said enough. Cadence stops on its own at a minute and a half."
                : speechSupported
                  ? "Your browser can draft a transcript. You can edit the words afterward."
                  : "This browser may not transcribe. You can type the words after you stop."}
            </p>
            {phase === "recording" ? (
              <canvas ref={canvasRef} className="cd-wave" aria-hidden="true" />
            ) : null}
          </div>
        </div>
        {error ? (
          <p className="cd-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="cd-examples">
          <p>No microphone handy? These examples are synthetic tones, not a recording of a person.</p>
          <div className="cd-example-row">
            <button type="button" className="cd-btn cd-btn-ghost" data-testid="example-settled" disabled={busy} onClick={() => runSample("settled")}>
              Try a brighter example
            </button>
            <button type="button" className="cd-btn cd-btn-ghost" data-testid="example-quieter" disabled={busy} onClick={() => runSample("quieter")}>
              Try a quieter example
            </button>
          </div>
        </div>
      </section>
      {result ? (
        <ToneResult
          result={result}
          headingRef={headingRef}
          onTranscript={(value) => {
            const features = featuresRef.current;
            const current = resultRef.current;
            if (!features || !current) return;
            publish(features, current.source, value, current);
          }}
        />
      ) : null}
    </>
  );
}
