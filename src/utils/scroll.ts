/** Get current vertical scroll position. */
export function getScrollTop(): number {
  const { documentElement } = document;
  // (vertical scroll) - (border on root element)
  return (
    (window.pageYOffset || documentElement.scrollTop) -
    (documentElement.clientTop || 0)
  );
}
