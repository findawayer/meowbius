import { FunctionComponent, useRef } from 'react';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { GALLERY_DEFAULT_LOAD_SIZE } from '../config/gallery';
import { times } from '../utils';
import Skeleton from './Skeleton';
import { useLoadMore } from '../hooks/useLoadMore';

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
  },
  pageEnd: {},
});

const Gallery: FunctionComponent = () => {
  const classes = useStyles();
  /** Element that watches user scroll and triggers the intersection callback. */
  const endRef = useRef<HTMLDivElement | null>(null);

  useLoadMore({
    targetRef: endRef,
    onLoadMore: async () => {
      console.log('wooohoooo');
    },
    offset: 300,
  });

  return (
    <div className={classes.root}>
      <div className={classes.grid}>
        {times(GALLERY_DEFAULT_LOAD_SIZE, index => (
          <Skeleton key={index} height={300}>
            <span>{index + 1}</span>
          </Skeleton>
        ))}
      </div>
      <div ref={endRef} className={classes.pageEnd} />
    </div>
  );
};

export default Gallery;
