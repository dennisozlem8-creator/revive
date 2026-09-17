"use client";

import { useEffect, useRef, useState } from "react";
import { detectVideoFrame, getPoseLandmarker } from "@/lib/pose-goniometer";

function attachVideoStream(video: HTMLVideoElement, stream: MediaStream) {
  if (video.srcObject !== stream) video.srcObject = stream;
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "true");
  const play = () => {
    void video.play().catch(() => {
      requestAnimationFrame(() => {
        void video.play().catch(() => undefined);
      });
    });
  };
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) play();
  else video.addEventListener("loadedmetadata", play, { once: true });
}

async function requestCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
  const attempts: MediaStreamConstraints[] = [
    { audio: false, video: { facingMode: { ideal: "environment" } } },
    { audio: false, video: { facingMode: "user" } },
    { audio: false, video: true },
  ];
  let last: unknown;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      last = error;
    }
  }
  throw last instanceof Error ? last : new Error("denied");
}

type KidsPhotoCameraProps = {
  onAngle: (angle: number) => void;
  preferLeft?: boolean;
};

export function KidsPhotoCamera({ onAngle, preferLeft = false }: KidsPhotoCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraOnRef = useRef(false);
  const requestRef = useRef(0);
  const rafRef = useRef(0);
  const preferLeftRef = useRef(preferLeft);
  const onAngleRef = useRef(onAngle);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  preferLeftRef.current = preferLeft;
  onAngleRef.current = onAngle;

  useEffect(() => {
    const requestId = ++requestRef.current;
    setError("");
    void (async () => {
      try {
        await getPoseLandmarker();
        const stream = await requestCameraStream();
        if (requestId !== requestRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        cameraOnRef.current = true;
        setReady(true);
        const attach = () => {
          if (videoRef.current && streamRef.current) {
            attachVideoStream(videoRef.current, streamRef.current);
          }
        };
        attach();
        requestAnimationFrame(attach);
        rafRef.current = requestAnimationFrame(loopPose);
      } catch (caught) {
        if (requestId !== requestRef.current) return;
        cameraOnRef.current = false;
        const name = caught instanceof DOMException ? caught.name : "";
        if (caught instanceof Error && caught.message === "unsupported") {
          setError("This browser cannot open a camera. Use Chrome, or pick a grown-up’s phone.");
        } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          setError("No camera found. Ask a grown-up to use a phone with a camera.");
        } else {
          setError("Camera was blocked. Tap Allow, then try again.");
        }
      }
    })();

    function loopPose() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !cameraOnRef.current) return;
      void getPoseLandmarker()
        .then((landmarker) => {
          if (!cameraOnRef.current || !video.videoWidth) {
            rafRef.current = requestAnimationFrame(loopPose);
            return;
          }
          const sample = detectVideoFrame(
            landmarker,
            video,
            performance.now(),
            preferLeftRef.current,
            0
          );
          if (sample) onAngleRef.current(sample.angle);
          if (canvas) drawKidsPose(canvas, video, sample?.angle ?? null);
          rafRef.current = requestAnimationFrame(loopPose);
        })
        .catch(() => {
          rafRef.current = requestAnimationFrame(loopPose);
        });
    }

    return () => {
      requestRef.current += 1;
      cameraOnRef.current = false;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.25rem] bg-[#d8eefc]">
        <video
          ref={videoRef}
          className="h-52 w-full object-cover sm:h-60"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
        {!ready && !error && (
          <p className="absolute inset-0 flex items-center justify-center text-base font-medium text-[#243056]">
            Opening camera
          </p>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-[#5b6685]">{error}</p>}
    </div>
  );
}

function drawKidsPose(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  liveAngle: number | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = video.clientWidth;
  const h = video.clientHeight;
  if (!w || !h) return;
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  if (liveAngle == null) return;
  ctx.fillStyle = "rgba(36, 48, 86, 0.72)";
  ctx.fillRect(12, 12, 108, 40);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px var(--font-kids), system-ui, sans-serif";
  ctx.fillText(`${liveAngle} deg`, 22, 40);
}
