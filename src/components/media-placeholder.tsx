type Props = {
  label: string;
  detail?: string;
  className?: string;
  ratio?: "wide" | "landscape" | "portrait" | "square";
};

export function MediaPlaceholder({ label, detail, className = "", ratio = "landscape" }: Props) {
  return (
    <div className={`media-placeholder media-${ratio} ${className}`} role="img" aria-label={label}>
      <span className="media-placeholder-frame" aria-hidden="true">
        <span className="media-placeholder-sun" />
        <span className="media-placeholder-horizon" />
      </span>
      <span className="media-placeholder-copy">
        <span className="media-placeholder-label">{label}</span>
        {detail ? <span className="media-placeholder-detail">{detail}</span> : null}
      </span>
      <span className="media-placeholder-mark" aria-hidden="true">N</span>
    </div>
  );
}
