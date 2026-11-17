import { setTimeout as delay } from "node:timers/promises";
import type { Plugin } from "vite";

const BYTES_PER_SECOND = 256 * 1024;
const MAX_CHUNK_SIZE = 256 * 1024;

export const uploadMock = (): Plugin => {
  const uploads = new Map<
    string,
    { size: number; name: string; data: Buffer; updatedAt: number }
  >();

  return {
    name: "upload-mock",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== "/api/uploads") return next();
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        const respond = (status: number, body: object) => {
          res.writeHead(status);
          res.end(JSON.stringify(body));
        };
        if (req.method !== "POST") {
          res.setHeader("Allow", "POST");
          respond(405, { error: "Use POST /api/uploads" });
          return;
        }

        const id = req.headers["x-upload-id"];
        const name = req.headers["x-file-name"];
        const offset = Number(req.headers["x-upload-offset"]);
        const size = Number(req.headers["x-file-size"]);
        if (
          typeof id !== "string" ||
          !/^[\w-]{1,100}$/.test(id) ||
          typeof name !== "string" ||
          !Number.isSafeInteger(offset) ||
          offset < 0 ||
          !Number.isSafeInteger(size) ||
          size < 0 ||
          size > 64 * 1024 * 1024
        ) {
          respond(400, { error: "Invalid upload metadata" });
          return;
        }
        for (const [key, upload] of uploads) {
          if (Date.now() - upload.updatedAt > 10 * 60 * 1000)
            uploads.delete(key);
        }
        if (!uploads.has(id)) {
          if (offset !== 0) {
            respond(409, { error: "Unknown upload" });
            return;
          }
          if (uploads.size >= 10) {
            respond(503, { error: "Too many uploads" });
            return;
          }
          uploads.set(id, {
            size,
            name,
            data: Buffer.alloc(0),
            updatedAt: Date.now(),
          });
        }
        const upload = uploads.get(id)!;
        if (
          upload.size !== size ||
          upload.name !== name ||
          upload.data.length !== offset
        ) {
          respond(409, { error: "Upload offset or metadata mismatch" });
          return;
        }

        const receive = async () => {
          const chunks: Buffer[] = [];
          let receivedBytes = 0;
          for await (const chunk of req) {
            receivedBytes += chunk.length;
            if (
              receivedBytes > MAX_CHUNK_SIZE ||
              offset + receivedBytes > size
            ) {
              respond(413, { error: "Chunk too large" });
              return;
            }
            chunks.push(Buffer.from(chunk));
            await delay((chunk.length / BYTES_PER_SECOND) * 1000);
            if (res.destroyed) return;
          }
          if (receivedBytes === 0 && size !== 0) {
            respond(400, { error: "Request body is empty" });
            return;
          }
          if (upload.data.length !== offset) {
            respond(409, { error: "Upload offset mismatch" });
            return;
          }
          upload.data = Buffer.concat([upload.data, ...chunks]);
          upload.updatedAt = Date.now();
          respond(200, { offset: upload.data.length });
        };
        void receive().catch(() => {
          if (!res.destroyed) respond(500, { error: "Upload interrupted" });
        });
      });
    },
  };
};
