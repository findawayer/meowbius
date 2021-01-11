import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    background: 'lightgrey',
    textAlign: 'center',
    fontSize: '2rem',
    '& > *, &::before, &::after,': {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    '&::before, &::after': {
      content: '""',
      width: 1,
      height: '100%',
    },
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
    <div className={classes.root} style={{ width, height }}>
      {children ?? children}
    </div>
  );
};

export default Skeleton;
