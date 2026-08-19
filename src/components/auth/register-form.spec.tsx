import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';
import type {SignUpFormData} from '@/lib/schemas/sign-up.schema';

const mocks = vi.hoisted(() => ({
  isPending: false,
  mutate: vi.fn(),
  mutationOptions: undefined as
    | {
        mutationKey: string[];
        mutationFn: (data: SignUpFormData) => Promise<unknown>;
        onSuccess: () => unknown;
        onError: (error: Error) => unknown;
      }
    | undefined,
  push: vi.fn(),
  register: vi.fn(),
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
}));

vi.mock('sonner', () => ({toast: {error: mocks.toastError}}));
vi.mock('@/lib/auth-client', () => ({register: mocks.register}));

import {RegisterForm} from './register-form';

const registration: SignUpFormData = {
  firstName: 'Taylor',
  lastName: 'Smith',
  company: 'Happy Paws',
  email: 'owner@example.com',
  password: 'secret-password',
};

function renderForm() {
  return renderToStaticMarkup(<RegisterForm />);
}

function getMutationOptions() {
  expect(mocks.mutationOptions).toBeDefined();
  return mocks.mutationOptions as NonNullable<typeof mocks.mutationOptions>;
}

describe('RegisterForm', () => {
  afterEach(() => {
    mocks.isPending = false;
    mocks.mutate.mockReset();
    mocks.mutationOptions = undefined;
    mocks.push.mockReset();
    mocks.register.mockReset();
    mocks.toastError.mockReset();
  });

  it('renders every registration control', () => {
    const html = renderForm();

    expect(html).toContain('Entrar com Google');
    expect(html).toContain('First Name');
    expect(html).toContain('placeholder="John"');
    expect(html).toContain('Last Name');
    expect(html).toContain('placeholder="Doe"');
    expect(html).toContain('Empresa');
    expect(html).toContain('placeholder="Pet Spa"');
    expect(html).toContain('E-mail');
    expect(html).toContain('placeholder="nome@email.com"');
    expect(html).toContain('Palavra-passe');
    expect(html).toContain('type="password"');
    expect(html).toContain('type="submit"');
    expect(html).toContain('Register');
  });

  it('registers with the submitted form data', async () => {
    mocks.register.mockResolvedValue(undefined);
    renderForm();

    await expect(
      getMutationOptions().mutationFn(registration),
    ).resolves.toBeUndefined();
    expect(mocks.register).toHaveBeenCalledOnce();
    expect(mocks.register).toHaveBeenCalledWith(registration);
  });

  it('propagates registration failures from the mutation', async () => {
    const error = new Error('Email already registered');
    mocks.register.mockRejectedValue(error);
    renderForm();

    await expect(getMutationOptions().mutationFn(registration)).rejects.toBe(
      error,
    );
  });

  it('redirects to login after successful registration', () => {
    renderForm();

    getMutationOptions().onSuccess();

    expect(mocks.push).toHaveBeenCalledWith('/auth');
  });

  it('shows mutation errors in a toast', () => {
    const error = new Error('Unable to register');
    renderForm();

    getMutationOptions().onError(error);

    expect(mocks.toastError).toHaveBeenCalledWith('Unable to register');
  });

  it('shows a loading state while registration is pending', () => {
    mocks.isPending = true;

    const html = renderForm();

    expect(html).toContain('Loading');
    expect(html).not.toContain('>Register</button>');
  });
});
