/** Browser-only loader for the Zoom Meeting SDK.
 *
 *  Zoom ships the SDK as a UMD bundle that reads React off the page, and the build it
 *  targets predates React 19. So we load a React 18 pair first, let the SDK render its
 *  own UI with it, and leave the app's React untouched. Nothing here is imported into
 *  the app bundle: the files sit under public/zoom and are fetched on demand.
 */

/** Where the SDK bundle and its sibling chunks are served from. */
const BASE = "/node_modules/@zoom/meetingsdk/dist";
const SDK_SCRIPT = `${BASE}/zoom-meeting-embedded-6.10.0.min.js`;
const REACT_PAIR = [`${BASE}/react-18.3.1.production.min.js`, `${BASE}/react-dom-18.3.1.production.min.js`];

export type ZoomClient = {
  init: (options: { zoomAppRoot: HTMLElement; language: string; patchJsMedia: boolean }) => Promise<unknown>;
  join: (options: { signature: string; meetingNumber: string; password: string; userName: string }) => Promise<unknown>;
};

declare global {
  interface Window {
    ZoomMtgEmbedded?: { createClient: () => ZoomClient };
  }
}

const loaded = new Map<string, Promise<void>>();

function scriptOnce(src: string) {
  let pending = loaded.get(src);
  if (!pending) {
    pending = new Promise<void>((resolve, reject) => {
      const tag = document.createElement("script");
      tag.src = src;
      tag.async = true;
      tag.onload = () => resolve();
      tag.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(tag);
    });
    loaded.set(src, pending);
  }
  return pending;
}

/** Adds the SDK to the page and hands back a client ready to init and join. */
export async function loadZoomClient(): Promise<ZoomClient> {
  for (const src of REACT_PAIR) await scriptOnce(src);
  await scriptOnce(SDK_SCRIPT);
  const sdk = window.ZoomMtgEmbedded;
  if (!sdk) throw new Error("The Zoom SDK did not register itself");
  return sdk.createClient();
}
