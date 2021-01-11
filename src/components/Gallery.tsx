import { nanoid } from 'nanoid';
import type { FunctionComponent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import {
  GALLERY_IMAGE_HEIGHT,
  GALLERY_INITIAL_SIZE,
  GALLERY_LOAD_MORE_SIZE,
} from '../config/gallery';
import { useLoadMore } from '../hooks/useLoadMore';
import type { CatImage } from '../models';
import { getCatImages } from '../requests';
import { times } from '../utils';
import ErrorMessage from './ErrorMessage';
import Skeleton from './Skeleton';

type Placeholder = null;
type PreloadedCatImages = Array<CatImage | Placeholder>;

/** Create placeholders to load skeletons until images are ready. */
const createPlaceholders = (length: number) => times(length, () => null);

/** Append as many placeholders as `length` to existing image collection. */
const appendPlaceholders = (
  images: PreloadedCatImages,
  length: number,
): PreloadedCatImages => [...images, ...createPlaceholders(length)];

/** Replace as many placeholders with loaded images. */
const replacePlaceholders = (
  images: PreloadedCatImages,
  loadedImages: CatImage[],
): PreloadedCatImages => {
  const exisitingImages = images.filter(Boolean);
  const placeholders = images.slice(
    exisitingImages.length + loadedImages.length,
  );
  return [...exisitingImages, ...loadedImages, ...placeholders];
};

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
      height: GALLERY_IMAGE_HEIGHT,
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
  // Fetched cat images :) (or skeletons!)
  const [images, setImages] = useState<PreloadedCatImages>(
    createPlaceholders(GALLERY_INITIAL_SIZE),
  );
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
        size: 'thumb',
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
      // Add placeholders first to display skeletons.
      setImages(previousImages =>
        appendPlaceholders(previousImages, GALLERY_LOAD_MORE_SIZE),
      );
      // Fetch more cat images.
      const moreCatImages = await getCatImages({
        size: 'thumb',
        order: 'RANDOM',
        limit: GALLERY_LOAD_MORE_SIZE,
      });
      // Replace cat placeholders.
      setImages(previousImage =>
        replacePlaceholders(previousImage, moreCatImages),
      );
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
        {images.map(image => (
          <figure key={nanoid()}>
            {image ? <img src={image.url} alt="" /> : <Skeleton />}
          </figure>
        ))}
      </div>
      <div ref={endRef} className={classes.pageEnd} />
      <ErrorMessage error={error} />
    </div>
  );
};

export default Gallery;
