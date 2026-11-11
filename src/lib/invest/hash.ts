/** The invest form's in-page address. A QR code or link ending in this opens the form directly. */
export const INVEST_FORM_HASH = "#invest-form";

/** True when a URL fragment asks for the investor form rather than any other part of the page. */
export function opensInvestForm(hash: string): boolean {
  return hash === INVEST_FORM_HASH;
}
