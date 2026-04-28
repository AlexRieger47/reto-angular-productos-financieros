import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  it('renders the bank shell', async () => {
    await render(App, {
      providers: [provideRouter([])]
    });

    expect(screen.getByRole('link', { name: /ir al listado de productos/i })).toBeInTheDocument();
    expect(screen.getByText('BANCO')).toBeInTheDocument();
  });
});
