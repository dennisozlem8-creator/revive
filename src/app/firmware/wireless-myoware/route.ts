import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "firmware/wireless-myoware/wireless-myoware.ino");
  const body = await readFile(filePath, "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wireless-myoware.ino"',
      "Cache-Control": "no-store",
    },
  });
}
