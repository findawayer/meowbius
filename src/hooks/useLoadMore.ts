import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { useIntersection } from './useIntersection';

type UseLoadMoreOptinos = {
  /** The element that triggers `onLoadMore` callback on intersection. */
  targetRef: RefObject<HTMLElement | null>;
  /** Callback to execute when user scroll reaches the predefined point. */
  onLoadMore(): unknown | Promise<unknown>;
  /** Offset from the load more breakpoint. (in pixel) */
  offset?: number;
};

export const useLoadMore = ({
  targetRef,
  onLoadMore,
  offset = 0,
}: UseLoadMoreOptinos) => {
  const { observe, entry } = useIntersection({
    root: null,
    rootMargin: `0px 0px ${offset}px`,
    threshold: 1,
  });
  const callbackRef = useRef(onLoadMore);

  // Observe intersection of target element.
  useEffect(() => {
    observe(targetRef.current);
  }, [observe, targetRef]);

  // If there is an intersecting entry, set the `hasUpdate` flag.
  useEffect(() => {
    if (entry) {
      callbackRef.current();
    }
  }, [entry]);
};
