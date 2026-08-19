import type {SignInFormData} from './schemas/sign-in.schema';
import type {SignUpFormData} from './schemas/sign-up.schema';

type ErrorResponse = {message?: string};

async function getResponseError(response: Response) {
  const body = (await response.json().catch(() => ({}))) as ErrorResponse;
  return new Error(body.message ?? 'Something went wrong.');
}

export async function login(data: SignInFormData) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await getResponseError(response);
  }

  return (await response.json()) as {business: {url: string}};
}

export async function register(data: SignUpFormData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await getResponseError(response);
  }
}
