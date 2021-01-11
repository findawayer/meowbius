import type { FunctionComponent } from 'react';
import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    minWidth: '10em',
    padding: '1.5rem 3rem',
    color: '#fff',
    background: '#f44336',
    boxShadow: '0 20px 40px rgba(0 0 0 / 30%), 0 15px 12px rgba(0 0 0 / 23%)',
    textAlign: 'center',
    fontSize: '1.2rem',
    transform: 'translateX(-50%)',
  },
});

interface ErrorMessageProps {
  error: Error | null;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ error }) => {
  const classes = useStyles();

  if (!error?.message) return null;

  return <div className={classes.root}>{error.message}</div>;
};

export default ErrorMessage;
