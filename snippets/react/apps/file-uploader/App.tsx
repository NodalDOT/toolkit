import { useState, type ChangeEventHandler } from "react";
import { ProgressBar } from "../progress-bar/ProgressBar";
import "../progress-bar/style.css";
import { useFileUpload } from "./useFileUpload";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [state, controls] = useFileUpload();
  const isActive = state.status === "uploading" || state.status === "paused";

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    controls.cancel();
    setFile(currentTarget.files?.[0] ?? null);
  };

  return (
    <section className="file-uploader">
      <h1>Upload your file</h1>
      <label className="file-uploader__field">
        <span>Choose a file</span>
        <input onChange={handleChange} type="file" disabled={isActive} />
      </label>
      {state.status !== "idle" && (
        <div className="file-uploader__progress">
          <ProgressBar value={state.progress} label={`${state.progress}%`} />
          <dl className="file-uploader__metrics">
            <div>
              <dt>Speed</dt>
              <dd>{Math.round(state.speed)} KB/s</dd>
            </div>
            <div>
              <dt>Remaining time</dt>
              <dd>
                {state.remainingTimeMs === null
                  ? "—"
                  : `${Math.ceil(state.remainingTimeMs / 1000)} seconds`}
              </dd>
            </div>
            <div>
              <dt>Uploaded</dt>
              <dd>{Math.round(state.bytes / 1024)} KB</dd>
            </div>
          </dl>
        </div>
      )}
      <p className="file-uploader__status" role="status">
        {state.error ??
          {
            idle: "Ready to upload",
            uploading: "Uploading…",
            paused: "Upload paused",
            completed: "Upload complete",
            error: "Upload failed",
          }[state.status]}
      </p>
      <div className="file-uploader__controls">
        <button
          type="button"
          onClick={() => file && controls.start(file)}
          disabled={isActive || !file || file.size === 0}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={controls.pause}
          disabled={state.status !== "uploading"}
        >
          Pause
        </button>
        <button
          type="button"
          onClick={() => file && controls.resume(file)}
          disabled={state.status !== "paused"}
        >
          Resume
        </button>
        <button
          type="button"
          onClick={controls.cancel}
          disabled={state.status === "idle"}
        >
          Cancel / Reset
        </button>
      </div>
    </section>
  );
};

export function App() {
  return (
    <main className="demo">
      <FileUploader />
    </main>
  );
}
