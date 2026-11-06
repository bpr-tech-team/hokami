import { getTranslations } from "next-intl/server";
import { VideoSection } from "./video-section";

export async function CompanyVideo() {
  const t = await getTranslations("Video");

  return (
    <VideoSection
      id="company-video"
      src="/video/homepage-1080.mp4"
      mobileSrc="/video/homepage-720.mp4"
      previewSrc="/video/homepage-preview.mp4"
      poster="/video/homepage-poster.webp"
      className="mx-auto max-w-[1520px] desktop:[--video-preview-inset:max(40px,calc((100%_-_var(--container-content))/2))]"
      labels={{
        title: t("title"),
        caption: t("caption", { duration: "0:41" }),
        play: t("play"),
        pausePreview: t("pausePreview"),
        resumePreview: t("resumePreview"),
        close: t("close"),
        error: t("error"),
        openFile: t("openFile"),
      }}
    />
  );
}
