import { nanoid } from 'nanoid';
import type { FunctionComponent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import {
  GALLERY_INITIAL_SIZE,
  GALLERY_LOAD_MORE_SIZE,
} from '../config/gallery';
import { useLoadMore } from '../hooks/useLoadMore';
import type { CatImage } from '../models';
import { getCatImages } from '../requests';
import ErrorMessage from './ErrorMessage';
import Skeleton from './Skeleton';

const useStyles = createUseStyles({
  root: {
    position: 'relative',
  },
  grid: {
    display: 'grid',
    padding: '0.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gridGap: '0.5rem',
    alignContent: 'start',
    '& figure': {
      height: 300,
      margin: 0,
    },
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  pageEnd: {},
});

const Gallery: FunctionComponent = () => {
  // Fetched cat images :)
  const [images, setImages] = useState<CatImage[]>([]);
  // Any error encountered.
  const [error, setError] = useState<Error | null>(null);
  /** Element that watches user scroll and triggers the intersection callback. */
  const endRef = useRef<HTMLDivElement | null>(null);
  // CSS classes with JSS
  const classes = useStyles();

  // Get first cat images.
  const loadCatImages = async () => {
    try {
      const catImages = await getCatImages({
        size: 'small',
        order: 'RANDOM',
        limit: GALLERY_INITIAL_SIZE,
      });
      setImages(catImages);
    } catch (error) {
      setError(error.message);
    }
  };
  // Get more cat images.
  const loadMoreCatImages = async () => {
    try {
      const moreCatImages = await getCatImages({
        size: 'small',
        order: 'RANDOM',
        limit: GALLERY_LOAD_MORE_SIZE,
      });
      setImages(previousImages => [...previousImages, ...moreCatImages]);
    } catch (error) {
      setError(error.message);
    }
  };

  // Initial load images.
  useEffect(() => {
    loadCatImages();
  }, []);

  // Load more images when scroll reaches at 300px off the bottom of the page.
  useLoadMore({
    targetRef: endRef,
    onLoadMore: loadMoreCatImages,
    offset: 300,
  });

  // Random images are not delivered with unique key according to the API :(
  return (
    <div className={classes.root}>
      <div className={classes.grid}>
        {images.map(({ url }) => (
          <Skeleton key={nanoid()}>
            <img src={url} alt="" loading="lazy" />
          </Skeleton>
        ))}
      </div>
      <div ref={endRef} className={classes.pageEnd} />
      <ErrorMessage error={error} />
    </div>
  );
};

export default Gallery;
