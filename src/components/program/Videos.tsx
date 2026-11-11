import type { ProgramVideo } from "@/lib/program-videos";

function Player({ v }: { v: ProgramVideo }) {
  return (
    <video
      className="program-video"
      controls
      playsInline
      preload="none"
      poster={v.poster}
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      aria-label={v.title}
    >
      <source src={v.src} type="video/mp4" />
    </video>
  );
}

export function MainVideo({ video }: { video: ProgramVideo }) {
  return (
    <section className="program-section" aria-labelledby="main-video-h">
      <h2 id="main-video-h" className="program-h2">{video.title}</h2>
      <Player v={video} />
      <p className="program-meta">{video.length}. Tap play to load. Captions coming soon.</p>
    </section>
  );
}

export function MoreVideos({ list }: { list: ProgramVideo[] }) {
  return (
    <section className="program-section" aria-labelledby="more-videos-h">
      <h2 id="more-videos-h" className="program-h2">More videos</h2>
      <ul className="program-videos">
        {list.map((v) => (
          <li key={v.id} className="program-video-item">
            <Player v={v} />
            <p className="program-title">{v.title}</p>
            <p className="program-meta">{v.length}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
