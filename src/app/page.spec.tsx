/** biome-ignore-all lint/performance/noImgElement: mock */
import {renderToStaticMarkup} from 'react-dom/server';
import {beforeAll, describe, expect, it, vi} from 'vitest';

vi.mock('next/image', () => ({
  default: ({alt, src}: {alt: string; src: string}) => (
    <img alt={alt} src={src} />
  ),
}));

import Page from './page';

describe('Page', () => {
  let html: string;

  beforeAll(() => {
    html = renderToStaticMarkup(<Page />);
  });

  it('renders the landing-page hero and primary calls to action', () => {
    expect(html).toContain('Sua agenda em ordem. Mais tempo para');
    expect(html).toContain('cuidar.');
    expect(html).toContain(
      'Agendamentos online simples para pet shops e groomers.',
    );
    expect(html).toContain('href="/auth"');
    expect(html).toContain('Começar grátis');
    expect(html).toContain('href="/auth/signup"');
    expect(html).toContain('Criar minha agenda');
  });

  it('renders navigation and each main landing-page section', () => {
    expect(html).toContain('aria-label="Navegação principal"');
    expect(html).toContain('href="#recursos"');
    expect(html).toContain('href="#como-funciona"');
    expect(html).toContain('href="#duvidas"');
    expect(html).toContain('href="#planos"');
    expect(html).toContain('id="recursos"');
    expect(html).toContain('id="como-funciona"');
    expect(html).toContain('id="duvidas"');
    expect(html).toContain('id="planos"');
  });

  it('renders the product features and onboarding steps', () => {
    expect(html).toContain('Agenda sem confusão');
    expect(html).toContain('Seu link de agendamento');
    expect(html).toContain('Menos mensagens, mais cuidado');
    expect(html).toContain('Crie sua página');
    expect(html).toContain('Cadastre seus serviços');
    expect(html).toContain('Compartilhe e pronto');
  });

  it('renders frequently asked questions', () => {
    expect(html).toContain('Preciso instalar algum aplicativo?');
    expect(html).toContain('Consigo usar com mais pessoas da equipe?');
    expect(html).toContain('Posso testar antes de pagar?');
    expect(html).toContain('Meus clientes precisam criar uma conta?');
  });

  it('renders every pricing plan and the featured-plan label', () => {
    expect(html).toContain('Ninho');
    expect(html).toContain('Aconchego');
    expect(html).toContain('Matilha');
    expect(html).toContain('4,99');
    expect(html).toContain('9,99');
    expect(html).toContain('19,99');
    expect(html).toContain('Mais escolhido');
    expect(html).toContain('Começar no Ninho');
    expect(html).toContain('Escolher Aconchego');
    expect(html).toContain('Crescer com a Matilha');
  });

  it('renders accessible imagery and contact information', () => {
    expect(html).toContain(
      'alt="Corgi feliz em um espaço de banho e tosa acolhedor"',
    );
    expect(html).toContain('alt="Pet bem cuidado após o atendimento"');
    expect(html).toContain('aria-label="5 de 5 estrelas"');
    expect(html).toContain('href="mailto:ola@toskio.com"');
    expect(html).toContain('Feito com carinho para quem cuida.');
  });
});
