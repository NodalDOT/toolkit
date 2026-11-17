interface ProgressBarProps {
  value: number;
  max?: number;
  label: `${string}%`;
}

export const ProgressBar = ({ value, label, max = 100 }: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress"
    >
      <div
        className="progress-bar__fill"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      ></div>
      {label && (
        <>
          <div className="progress-bar__label">{label}</div>
          <div
            className="progress-bar__label progress-bar__label--overlay"
            style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
            aria-hidden
          >
            {label}
          </div>
        </>
      )}
    </div>
  );
};
