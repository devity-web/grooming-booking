import {expect, test} from '@playwright/test';

const registration = {
  firstName: 'Taylor',
  lastName: 'Smith',
  company: 'Happy Paws',
  email: 'owner@example.com',
  password: 'secret-password',
};

async function fillRegistrationForm(page: import('@playwright/test').Page) {
  await page.getByPlaceholder('John').fill(registration.firstName);
  await page.getByPlaceholder('Doe').fill(registration.lastName);
  await page.getByPlaceholder('Pet Spa').fill(registration.company);
  await page
    .getByRole('textbox', {name: 'nome@email.com'})
    .fill(registration.email);
  await page.getByPlaceholder('Sua palavra-passe').fill(registration.password);
}

test.describe('registration', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/auth/signup');
  });

  test('shows every registration field', async ({page}) => {
    await expect(page.getByPlaceholder('John')).toBeVisible();
    await expect(page.getByPlaceholder('Doe')).toBeVisible();
    await expect(page.getByPlaceholder('Pet Spa')).toBeVisible();
    await expect(
      page.getByRole('textbox', {name: 'nome@email.com'}),
    ).toBeVisible();
    await expect(page.getByPlaceholder('Sua palavra-passe')).toBeVisible();
    await expect(
      page.getByRole('button', {name: 'Register', exact: true}),
    ).toBeVisible();
  });

  test('validates registration details without calling the API', async ({
    page,
  }) => {
    let apiCalls = 0;
    await page.route('**/api/auth/register', async route => {
      apiCalls += 1;
      await route.abort();
    });
    await page
      .getByRole('textbox', {name: 'nome@email.com'})
      .fill('invalid-email');

    await page.getByRole('button', {name: 'Register', exact: true}).click();

    await expect(page.getByText('Email inválido')).toBeVisible();
    await expect(page.getByText('A palavra-passe é obrigatória')).toBeVisible();
    await expect(
      page.getByText('Escolha um nome para o teu negócio'),
    ).toBeVisible();
    expect(apiCalls).toBe(0);
  });

  test('shows the API error when registration fails', async ({page}) => {
    await page.route('**/api/auth/register', async route => {
      expect(route.request().postDataJSON()).toEqual(registration);
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({message: 'E-mail já cadastrado'}),
      });
    });
    await fillRegistrationForm(page);

    await page.getByRole('button', {name: 'Register', exact: true}).click();

    await expect(page.getByText('E-mail já cadastrado')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/signup$/);
  });

  test('submits registration and returns to login', async ({page}) => {
    await page.route('**/api/auth/register', async route => {
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toEqual(registration);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({success: true}),
      });
    });
    await fillRegistrationForm(page);

    await page.getByRole('button', {name: 'Register', exact: true}).click();

    await expect(page).toHaveURL(/\/auth$/);
    await expect(
      page.getByRole('button', {name: 'Entrar', exact: true}),
    ).toBeVisible();
  });
});
