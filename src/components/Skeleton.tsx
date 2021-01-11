import type { FunctionComponent } from 'react';
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  '@keyframes loading': {
    from: { background: '#bbb' },
    to: { opacity: '#f2f2f2' },
  },
  root: {
    width: '100%',
    height: '100%',
    background: 'lightgrey',
    animation: '$loading 1s linear infinite alternate',
  },
});

const Skeleton: FunctionComponent = () => {
  const classes = useStyles();
  return <div className={classes.root} />;
};

export default Skeleton;
