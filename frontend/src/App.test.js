import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the user management heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /user management/i })).toBeInTheDocument();
});
