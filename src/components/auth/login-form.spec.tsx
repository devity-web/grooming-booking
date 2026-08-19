import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const mocks = vi.hoisted(() => ({
  isPending: false,
  mutate: vi.fn(),
  mutationOptions: undefined as
    | {
        mutationKey: string[];
        mutationFn: (data: {
          email: string;
          password: string;
        }) => Promise<unknown>;
        onSuccess: (data: {url: string}) => unknown;
        onError: (error: Error) => unknown;
      }
    | undefined,
  paramsGet: vi.fn(),
  push: vi.fn(),
  login: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (options: NonNullable<typeof mocks.mutationOptions>) => {
    mocks.mutationOptions = options;
    return {isPending: mocks.isPending, mutate: mocks.mutate};
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({push: mocks.push}),
  useSearchParams: () => ({get: mocks.paramsGet}),
}));

vi.mock('sonner', () => ({toast: {error: mocks.toastError}}));
vi.mock('@/lib/auth-client', () => ({login: mocks.login}));

import {LoginForm} from './login-form';

const credentials = {
  email: 'owner@example.com',
  password: 'secret-password',
};

function renderForm() {
  return renderToStaticMarkup(<LoginForm />);
}

function getMutationOptions() {
  expect(mocks.mutationOptions).toBeDefined();
  return mocks.mutationOptions as NonNullable<typeof mocks.mutationOptions>;
}

describe('LoginForm', () => {
  beforeEach(() => {
    mocks.paramsGet.mockReturnValue(null);
  });

  afterEach(() => {
    mocks.isPending = false;
    mocks.mutate.mockReset();
    mocks.mutationOptions = undefined;
    mocks.paramsGet.mockReset();
    mocks.push.mockReset();
    mocks.login.mockReset();
    mocks.toastError.mockReset();
  });

  it('renders the login controls', () => {
    const html = renderForm();

    expect(html).toContain('Entrar com Google');
    expect(html).toContain('E-mail');
    expect(html).toContain('placeholder="nome@email.com"');
    expect(html).toContain('Palavra-passe');
    expect(html).toContain('type="password"');
    expect(html).toContain('placeholder="Sua palavra-passe"');
    expect(html).toContain('type="submit"');
    expect(html).toContain('Entrar');
  });

  it('authenticates with the submitted credentials', async () => {
    const business = {url: 'happy-paws'};
    mocks.login.mockResolvedValue({business});
    renderForm();

    await expect(getMutationOptions().mutationFn(credentials)).resolves.toEqual(
      business,
    );
    expect(mocks.login).toHaveBeenCalledOnce();
    expect(mocks.login).toHaveBeenCalledWith(credentials);
  });

  it('rejects the mutation when authentication fails', async () => {
    const error = new Error('Invalid login credentials');
    mocks.login.mockRejectedValue(error);
    renderForm();

    await expect(getMutationOptions().mutationFn(credentials)).rejects.toBe(
      error,
    );
  });

  it('redirects to the requested next page after login', () => {
    mocks.paramsGet.mockReturnValue('/settings');
    renderForm();

    getMutationOptions().onSuccess({url: 'happy-paws'});

    expect(mocks.paramsGet).toHaveBeenCalledWith('next');
    expect(mocks.push).toHaveBeenCalledWith('/settings');
  });

  it('redirects to the business dashboard when next is absent', () => {
    renderForm();

    getMutationOptions().onSuccess({url: 'happy-paws'});

    expect(mocks.push).toHaveBeenCalledWith('/happy-paws/dashboard');
  });

  it('shows mutation errors in a toast', () => {
    const error = new Error('Unable to sign in');
    renderForm();

    getMutationOptions().onError(error);

    expect(mocks.toastError).toHaveBeenCalledWith('Unable to sign in');
  });

  it('shows a loading state while authentication is pending', () => {
    mocks.isPending = true;

    const html = renderForm();

    expect(html).toContain('Loading');
    expect(html).not.toContain('>Entrar</button>');
  });
});
