import {expect, test} from '@playwright/test';

test.describe('landing page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('presents the scheduling product and its plans', async ({page}) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Sua agenda em ordem. Mais tempo para cuidar.',
      }),
    ).toBeVisible();
    await expect(
      page.getByText('Agendamentos online simples para pet shops e groomers.'),
    ).toBeVisible();

    const benefits = page.getByRole('region', {name: 'Benefícios rápidos'});
    await expect(benefits).toContainText('Agenda online 24h');
    await expect(benefits).toContainText('Configuração em minutos');
    await expect(benefits).toContainText('Feito para banho & tosa');

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Escolha o cantinho ideal para o seu negócio crescer.',
      }),
    ).toBeVisible();
    await expect(page.getByText('Ninho', {exact: true})).toBeVisible();
    await expect(page.getByText('Aconchego', {exact: true})).toBeVisible();
    await expect(page.getByText('Matilha', {exact: true})).toBeVisible();
  });

  test('navigates to product sections from the main navigation', async ({
    page,
  }) => {
    await page.getByRole('link', {name: 'Recursos', exact: true}).click();

    await expect(page).toHaveURL(/#recursos$/);
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Tudo o que você precisa. Nada que complique.',
      }),
    ).toBeInViewport();

    await page.getByRole('link', {name: 'Planos', exact: true}).click();

    await expect(page).toHaveURL(/#planos$/);
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Escolha o cantinho ideal para o seu negócio crescer.',
      }),
    ).toBeInViewport();
  });

  test('reveals answers to common customer questions', async ({page}) => {
    const question = page.getByRole('button', {
      name: 'Meus clientes precisam criar uma conta?',
    });

    await question.click();

    await expect(question).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page.getByText(
        'Não. Eles escolhem o serviço e o horário e preenchem apenas os dados necessários para o atendimento.',
      ),
    ).toBeVisible();
  });

  test('directs returning and new customers to the correct auth flow', async ({
    page,
  }) => {
    await page.getByRole('button', {name: 'Começar grátis'}).click();

    await expect(page).toHaveURL(/\/auth$/);
    await expect(
      page.getByRole('heading', {level: 1, name: 'Entrar no Toskio'}),
    ).toBeVisible();

    await page.goto('/');
    await page.getByRole('button', {name: /Criar minha agenda/}).click();

    await expect(page).toHaveURL(/\/auth\/signup$/);
    await expect(
      page.getByRole('button', {name: 'Register', exact: true}),
    ).toBeVisible();
  });
});
