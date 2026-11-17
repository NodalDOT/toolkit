import { useEffect, useRef, useState } from "react";
import type { UploadControls, UploadState } from "./types";

const DEFAULT_STATE: UploadState = {
  status: "idle",
  progress: 0,
  speed: 0,
  bytes: 0,
  remainingTimeMs: null,
  error: null,
};

const CHUNK_SIZE = 256 * 1024;

const UPLOAD_API_URL = "/api/uploads";

export const useFileUpload = (): [UploadState, UploadControls] => {
  const [state, setState] = useState<UploadState>(DEFAULT_STATE);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const sessionRef = useRef<{
    id: string;
    file: File;
    offset: number;
    paused: boolean;
  } | null>(null);

  const abort = () => {
    const xhr = xhrRef.current;
    xhrRef.current = null;
    xhr?.abort();
  };

  useEffect(
    () => () => {
      const xhr = xhrRef.current;
      xhrRef.current = null;
      xhr?.abort();
    },
    [],
  );

  const sendChunk = () => {
    const session = sessionRef.current;
    if (!session || session.paused || xhrRef.current) return;
    const { file, offset } = session;
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    // eslint-disable-next-line react-hooks/purity
    const startedAt = performance.now();

    const fail = (error: string) => {
      if (xhrRef.current !== xhr) return;
      xhrRef.current = null;
      setState((state) => ({
        ...state,
        status: "error",
        speed: 0,
        remainingTimeMs: null,
        error,
      }));
    };

    xhr.onload = () => {
      if (xhrRef.current !== xhr) return;
      if (xhr.status < 200 || xhr.status >= 300) {
        fail(`Upload failed (HTTP ${xhr.status})`);
        return;
      }
      let confirmedOffset: unknown;
      try {
        confirmedOffset = JSON.parse(xhr.responseText).offset;
      } catch {
        fail("Invalid upload response");
        return;
      }
      if (confirmedOffset !== end) {
        fail("Server did not confirm the chunk");
        return;
      }
      xhrRef.current = null;
      session.offset = end;
      const speed =
        ((end - offset) * 1000) / Math.max(performance.now() - startedAt, 1);
      const completed = end === file.size;
      setState({
        status: completed
          ? "completed"
          : session.paused
            ? "paused"
            : "uploading",
        progress: completed
          ? 100
          : Math.min(99, Math.floor((end / file.size) * 100)),
        bytes: end,
        speed: completed || session.paused ? 0 : speed / 1024,
        remainingTimeMs: completed
          ? 0
          : session.paused
            ? null
            : ((file.size - end) / speed) * 1000,
        error: null,
      });
      if (!completed && !session.paused) sendChunk();
    };
    xhr.onerror = () => fail("Network error");

    try {
      xhr.open("POST", UPLOAD_API_URL);
      xhr.setRequestHeader("X-Upload-Id", session.id);
      xhr.setRequestHeader("X-Upload-Offset", String(offset));
      xhr.setRequestHeader("X-File-Size", String(file.size));
      xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
      xhr.send(file.slice(offset, end));
    } catch {
      fail("Unable to start upload");
    }
  };

  const start = (file: File) => {
    abort();
    sessionRef.current = {
      id: crypto.randomUUID(),
      file,
      offset: 0,
      paused: false,
    };
    setState({ ...DEFAULT_STATE, status: "uploading" });
    sendChunk();
  };

  const pause = () => {
    const session = sessionRef.current;
    if (!session || !xhrRef.current) return;
    session.paused = true;
    setState((state) => ({
      ...state,
      status: "paused",
      speed: 0,
      remainingTimeMs: null,
    }));
  };

  const resume = (file: File) => {
    const session = sessionRef.current;
    if (!session || session.file !== file || !session.paused) return;
    session.paused = false;
    setState((state) => ({ ...state, status: "uploading" }));
    sendChunk();
  };

  const cancel = () => {
    abort();
    sessionRef.current = null;
    setState(DEFAULT_STATE);
  };

  return [state, { start, pause, resume, cancel }];
};
