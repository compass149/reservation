import { render, pages } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = pages.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
