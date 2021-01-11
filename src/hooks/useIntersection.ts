import { useEffect, useRef, useState } from 'react';

/**
 * Hook that monitors the intersection of a [SINGLE] element, and triggers a re-render
 * when the `threshold` is met, by updating a local React state.
 * @docs https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * @param arg.root - The container for checking visibility of the target.
 * @param arg.rootMargin - Offset from the root.
 * @param arg.threshold - The breakpoint of target's visibility in percentage (relative to 1)
 *                        to be considered as an intersection.
 * @param arg.oneWay - Detect intersection only in one direction. (forward, backward)
 * @returns An object containing:
 * - entry: Current state of target element expressed as `IntersectionObserverEntry` object.
 * - observe: Observe the DOM element passed.
 */
export const useIntersection = ({
  root = null,
  rootMargin,
  threshold = 0,
}: IntersectionObserverInit) => {
  // Target element to watch
  const [target, setTarget] = useState<HTMLElement | null>(null);
  // Master object containing all about intersection entry's state.
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  // Static container for IntersectionObserver instance.
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Run this effect when:
  // - Target element is changed with `observe` method.
  // - Any of the options is changed.
  useEffect(() => {
    // Ignore empty target.
    if (!target) return;
    // Unobserve previously observed target.
    observerRef.current?.disconnect();
    // Create a new observer. The observer instance should be stored in a variable,
    // rather than in the `current` property of `observerRef`; the `RefObject` is mutable
    // and is not safe to access the original observer in the effect cleanup function. (ref. [1])
    const observer = new window.IntersectionObserver(
      ([firstEntry]) => firstEntry.isIntersecting && setEntry(firstEntry),
      { root, rootMargin, threshold },
    );
    // Observe the new target.
    observer.observe(target);
    // Persist the observer instance in the static object `observerRef`.
    observerRef.current = observer;
    // [1] Unobserve all on component unmount.
    return () => {
      observer.disconnect();
    };
  }, [target, root, rootMargin, threshold]);

  return { entry, observe: setTarget };
};
