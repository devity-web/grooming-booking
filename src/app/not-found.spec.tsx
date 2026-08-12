/** biome-ignore-all lint/performance/noImgElement: mock */
import {renderToStaticMarkup} from 'react-dom/server';
import {beforeAll, describe, expect, it, vi} from 'vitest';

vi.mock('next/image', () => ({
  default: ({alt, src}: {alt: string; src: string}) => (
    <img alt={alt} src={src} />
  ),
}));

import NotFound from './not-found';

describe('NotFound', () => {
  let html: string;

  beforeAll(() => {
    html = renderToStaticMarkup(<NotFound />);
  });

  it('renders the 404 explanation', () => {
    expect(html).toContain('Erro 404');
    expect(html).toContain('Essa página saiu para');
    expect(html).toContain('passear.');
    expect(html).toContain('Parece que seguimos a trilha errada.');
    expect(html).toContain('todos os pets continuam seguros por aqui.');
  });

  it('provides links back home and to the agenda', () => {
    expect(html).toContain('aria-label="Toskio — página inicial"');
    expect(html).toContain('href="/"');
    expect(html).toContain('Voltar ao início');
    expect(html).toContain('href="/auth"');
    expect(html).toContain('Abrir minha agenda');
  });

  it('renders the decorative pet image with meaningful alternative text', () => {
    expect(html).toContain('src="/images/dog-hike.png"');
    expect(html).toContain('alt="Pet bem cuidado esperando você voltar"');
  });
});
