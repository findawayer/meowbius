import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    background: 'lightgrey',
  },
});

interface SkeletonProps {
  /** Width of skeleton in pixel */
  width?: number;
  /** Height of skeleton in pixel */
  height?: number;
  /** Possible children */
  children?: ReactNode;
}

const Skeleton: FunctionComponent<SkeletonProps> = ({
  width,
  height,
  children,
}) => {
  const classes = useStyles();

  return (
    <figure className={classes.root} style={{ width, height }}>
      {children ?? children}
    </figure>
  );
};

export default Skeleton;
