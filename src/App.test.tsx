import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('renders something :)', () => {
  const { container } = render(<App />);
  expect(container).not.toBeEmptyDOMElement();
});
