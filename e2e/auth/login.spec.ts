import {expect, test} from '@playwright/test';

const credentials = {
  email: 'owner@example.com',
  password: 'secret-password',
};

test.describe('login', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/auth');
  });

  test('shows every login option and navigation link', async ({page}) => {
    await expect(
      page.getByRole('heading', {level: 1, name: 'Entrar no Toskio'}),
    ).toBeVisible();
    await expect(page.getByPlaceholder('nome@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('Sua palavra-passe')).toBeVisible();
    await expect(
      page.getByRole('button', {name: 'Entrar', exact: true}),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {name: 'Entrar com Google'}),
    ).toBeVisible();
    await expect(page.getByRole('link', {name: 'Cadastre-se'})).toHaveAttribute(
      'href',
      '/auth/signup',
    );
    await expect(page.getByRole('link', {name: 'Início'})).toHaveAttribute(
      'href',
      '/',
    );
  });

  test('validates credentials without calling the API', async ({page}) => {
    let apiCalls = 0;
    await page.route('**/api/auth/login', async route => {
      apiCalls += 1;
      await route.abort();
    });
    await page.getByPlaceholder('nome@email.com').fill('invalid-email');

    await page.getByRole('button', {name: 'Entrar', exact: true}).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('A palavra-passe é obrigatória')).toBeVisible();
    expect(apiCalls).toBe(0);
  });

  test('shows the API error when credentials are rejected', async ({page}) => {
    await page.route('**/api/auth/login', async route => {
      expect(route.request().postDataJSON()).toEqual(credentials);
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({message: 'Credenciais inválidas'}),
      });
    });
    await page.getByPlaceholder('nome@email.com').fill(credentials.email);
    await page.getByPlaceholder('Sua palavra-passe').fill(credentials.password);

    await page.getByRole('button', {name: 'Entrar', exact: true}).click();

    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('submits credentials and continues to the requested page', async ({
    page,
  }) => {
    await page.goto('/auth?next=/privacy');
    await page.route('**/api/auth/login', async route => {
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toEqual(credentials);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({business: {url: 'happy-paws'}}),
      });
    });
    await page.getByPlaceholder('nome@email.com').fill(credentials.email);
    await page.getByPlaceholder('Sua palavra-passe').fill(credentials.password);

    await page.getByRole('button', {name: 'Entrar', exact: true}).click();

    await expect(page).toHaveURL(/\/privacy$/);
    await expect(
      page.getByRole('heading', {level: 1, name: 'Política de Privacidade'}),
    ).toBeVisible();
  });
});
