export type UploadStatus =
  | "idle"
  | "uploading"
  | "paused"
  | "completed"
  | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number;
  speed: number;
  bytes: number;
  remainingTimeMs: number | null;
  error: string | null;
}

export interface UploadControls {
  start: (file: File) => void;
  pause: () => void;
  resume: (file: File) => void;
  cancel: () => void;
}
