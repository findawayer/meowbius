import type { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

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
    rootMargin: `${offset}px`,
    threshold: 0,
    direction: 'down',
  });
  const [hasUpdate, setHasUpdate] = useState(false);
  // Invoke `onLoadMore` and clear `hasUpdate` flag.
  const fireCallback = useCallback(async () => {
    await onLoadMore();
    setHasUpdate(false);
  }, [onLoadMore]);

  // Observe intersection of target element.
  useEffect(() => {
    observe(targetRef.current);
  }, [observe, targetRef]);

  // If there is an intersecting entry, set the `hasUpdate` flag.
  useEffect(() => {
    if (entry) setHasUpdate(true);
  }, [entry]);

  // When there is an update, invoke `onLoadMore` and clear `hasUpdate` flag.
  useEffect(() => {
    if (hasUpdate) fireCallback();
  }, [hasUpdate, fireCallback]);
};
