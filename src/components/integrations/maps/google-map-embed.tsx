type GoogleMapEmbedProps = {
  src: string;
  title: string;
};

export function GoogleMapEmbed({ src, title }: GoogleMapEmbedProps) {
  return (
    <iframe
      src={src}
      title={title}
      width={588}
      height={366}
      loading="eager"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="aspect-[588/366] h-auto w-full min-w-0 border-0 bg-surface-raised"
    />
  );
}
