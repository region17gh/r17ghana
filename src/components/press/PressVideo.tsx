import { Button } from "@/components/ui/Button";
import { usePressVideo } from "@/hooks/usePressVideo";

export function PressVideo({ videoId, title }: { videoId: string; title: string }) {
  const { playing, play } = usePressVideo();
  return <section className="press-video" aria-label="Summit video">
    {playing ? <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&cc_load_policy=1`}
      title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    /> : <div className="press-video-start">
      <p className="press-eyebrow">JoyNews video coverage</p>
      <h2>{title}</h2>
      <Button size="lg" icon="play" onClick={play}>Watch summit coverage</Button>
      <p className="press-caption">Playing loads YouTube. Captions are provided by the publisher when available.</p>
    </div>}
    {playing && <div className="program-links"><Button href={`https://www.youtube.com/watch?v=${videoId}`} size="lg" variant="secondary" iconAfter="external-link">Watch on YouTube</Button></div>}
  </section>;
}