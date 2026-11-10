type Props = {
  label: string;
  detail?: string;
  className?: string;
  ratio?: "wide" | "landscape" | "portrait" | "square";
  imageUrl?: string;
};

export function MediaPlaceholder({ label, detail, className = "", ratio = "landscape", imageUrl }: Props) {
  const imageStyle = imageUrl
    ? { backgroundImage: `url("${imageUrl}")` }
    : undefined;

  return (
    <div className={`media-placeholder media-${ratio} ${imageUrl ? "media-photo" : ""} ${className}`} style={imageStyle} role="img" aria-label={label}>
      {!imageUrl ? (
        <>
          <span className="media-placeholder-frame" aria-hidden="true">
            <span className="media-placeholder-sun" />
            <span className="media-placeholder-horizon" />
          </span>
          <span className="media-placeholder-copy">
            <span className="media-placeholder-label">{label}</span>
            {detail ? <span className="media-placeholder-detail">{detail}</span> : null}
          </span>
          <span className="media-placeholder-mark" aria-hidden="true">N</span>
        </>
      ) : null}
    </div>
  );
}
