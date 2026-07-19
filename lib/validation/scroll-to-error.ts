/** Focuses a field and smoothly scrolls it into view — used when a form is
 * submitted with the first invalid field still off-screen. */
export function scrollAndFocus(el: HTMLElement | null | undefined) {
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}
