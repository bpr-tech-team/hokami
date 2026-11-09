import { jobEmbedSandbox, jobEmbedSource } from "@/lib/jobs/embed";

export function ContentEmbed({ src, title }: { src: string; title: string }) {
  let source: string;
  try {
    source = jobEmbedSource(src);
  } catch {
    return null;
  }
  return (
    <div className="my-8 aspect-video w-full">
      <iframe
        src={source}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox={jobEmbedSandbox(source)}
        className="block size-full border-0"
      />
    </div>
  );
}
