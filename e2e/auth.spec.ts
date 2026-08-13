import {expect, test} from '@playwright/test';

test.describe('authentication', () => {
  test('shows the login form', async ({page}) => {
    await page.goto('/auth');

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
  });

  test('validates invalid login details before submission', async ({page}) => {
    await page.goto('/auth');
    await page
      .getByRole('textbox', {name: 'nome@email.com'})
      .fill('invalid-email');

    await page.getByRole('button', {name: 'Entrar', exact: true}).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('A palavra-passe é obrigatória')).toBeVisible();
  });

  test('lets a new customer open and validate the signup form', async ({
    page,
  }) => {
    await page.goto('/auth');
    await page.getByRole('link', {name: 'Cadastre-se'}).click();

    await expect(page).toHaveURL(/\/auth\/signup$/);
    await expect(page.getByPlaceholder('John')).toBeVisible();
    await expect(page.getByPlaceholder('Doe')).toBeVisible();
    await expect(page.getByPlaceholder('Pet Spa')).toBeVisible();

    await page
      .getByRole('textbox', {name: 'nome@email.com'})
      .fill('invalid-email');
    await page.getByRole('button', {name: 'Register', exact: true}).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('A palavra-passe é obrigatória')).toBeVisible();
    await expect(
      page.getByText('Escolha um nome para o teu negócio'),
    ).toBeVisible();
  });

  test('returns to the landing page', async ({page}) => {
    await page.goto('/auth');
    await page.getByRole('link', {name: 'Início'}).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Sua agenda em ordem. Mais tempo para cuidar.',
      }),
    ).toBeVisible();
  });
});
