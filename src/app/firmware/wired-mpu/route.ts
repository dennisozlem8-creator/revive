import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "firmware/wired-mpu/wired-mpu.ino");
  const body = await readFile(filePath, "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wired-mpu.ino"',
      "Cache-Control": "no-store",
    },
  });
}
