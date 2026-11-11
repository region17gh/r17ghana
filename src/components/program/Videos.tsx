import { SHOWN_BY_DEFAULT, type ProgramVideo } from "@/lib/program-videos";

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
      onPlay={(e) => { if (e.currentTarget.currentTime < 1) window.__lovableEvents?.track?.("project.program_video_played", { video_id: v.id }); }}
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
  const shown = list.slice(0, SHOWN_BY_DEFAULT);
  const hidden = list.slice(SHOWN_BY_DEFAULT);
  return (
    <section className="program-section" aria-labelledby="more-videos-h">
      <h2 id="more-videos-h" className="program-h2">More videos</h2>
      <p className="program-note">Tap a video to watch it. Nothing here can be downloaded.</p>
      <ul className="program-videos">
        {shown.map((v) => (
          <li key={v.id} className="program-video-item">
            <Player v={v} />
            <p className="program-title">{v.title}</p>
            <p className="program-meta">{v.length}</p>
          </li>
        ))}
      </ul>
      {hidden.length > 0 && (
        <details className="program-fold">
          <summary className="program-fold-summary">
            <span className="program-h2">Show more videos</span>
            <span className="program-fold-count">{hidden.length} videos</span>
          </summary>
          <ul className="program-videos">
            {hidden.map((v) => (
              <li key={v.id} className="program-video-item">
                <Player v={v} />
                <p className="program-title">{v.title}</p>
                <p className="program-meta">{v.length}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
