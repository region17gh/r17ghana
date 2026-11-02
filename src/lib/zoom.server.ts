/** Signs a Zoom Meeting SDK JWT (HS256) with Web Crypto so it runs on Workers. */
const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const enc = (v: unknown) => b64url(new TextEncoder().encode(JSON.stringify(v)));

export const ATTENDEE_ROLE = 0;
export const MAX_TOKEN_SECONDS = 8 * 60 * 60; // longer than the 5h10m viewing window, so nobody is cut off

export async function signMeetingSdkJwt(sdkKey: string, secret: string, meetingNumber: string, nowSec: number) {
  const iat = nowSec - 30;
  const payload = { appKey: sdkKey, sdkKey, mn: meetingNumber, role: ATTENDEE_ROLE, iat, exp: iat + MAX_TOKEN_SECONDS, tokenExp: iat + MAX_TOKEN_SECONDS };
  const body = `${enc({ alg: "HS256", typ: "JWT" })}.${enc(payload)}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
  return `${body}.${b64url(sig)}`;
}
