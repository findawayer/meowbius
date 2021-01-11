import { useEffect, useRef, useState, useReducer } from 'react';

import { getScrollTop } from '../utils';

/** Possible values of intersection direction to watch */
type IntersectionDirection = 'down' | 'up' | 'both';

/** Custom info state object. */
type IntersectionInfo = {
  /** Intersection observer entry that has previously intersected. */
  entry: IntersectionObserverEntry | null;
  /**
   * Direction of the intersection to watch. Default and fallback value is `both`.
   * Use `down` or `up` to watch intersections in one-way.
   */
  direction: IntersectionDirection;
  /**
   * Previous scroll position of the watcher element, recorded on intersection.
   * This allows strictly avoiding duplicate call on `onLoadMore` callback.
   */
  offset: number;
};

/** Create initial intersection info state. */
const initializeInfo = (
  direction: IntersectionDirection,
): IntersectionInfo => ({
  entry: null,
  direction,
  offset: getInitialOffset(direction),
});

/** This is how we update intersection info state. */
const infoReducer = (
  previousInfo: IntersectionInfo,
  entry: IntersectionObserverEntry,
): IntersectionInfo => {
  const { direction, offset: previousOffset } = previousInfo;
  // Get the current vertical offset of the target element, relative to viewport.
  const currentOffset = getScrollTop() + entry.boundingClientRect.y;

  switch (direction) {
    // Only update state when scroll has advanced further than last intersection,
    // in the specified direction.
    case 'up': {
      const hasAdvanced = previousOffset > currentOffset;
      return hasAdvanced
        ? { ...previousInfo, offset: currentOffset, entry }
        : previousInfo;
    }

    // Do the reverse of `up`.
    case 'down': {
      const hasAdvanced = previousOffset < currentOffset;
      return hasAdvanced
        ? { ...previousInfo, offset: currentOffset, entry }
        : previousInfo;
    }

    // Default value `both`: always update intersecting entry.
    default:
      return { ...previousInfo, entry };
  }
};

/** Options for `useIntersection` hook. */
interface UseIntersectionOptions extends IntersectionObserverInit {
  direction?: IntersectionDirection;
}

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
  direction = 'both',
}: UseIntersectionOptions) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  // const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [{ entry }, setInfo] = useReducer(
    infoReducer,
    direction,
    initializeInfo,
  );
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
      ([firstEntry]) => firstEntry.isIntersecting && setInfo(firstEntry),
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

/** Get initial offset value based on the direction provided. */
function getInitialOffset(direction: IntersectionDirection): number {
  switch (direction) {
    case 'down':
      return Number.NEGATIVE_INFINITY;

    case 'up':
      return Number.POSITIVE_INFINITY;

    case 'both':
      return 0;

    default:
      throw new Error(`Unhandled direction: ${direction}`);
  }
}
