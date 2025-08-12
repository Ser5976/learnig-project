import { test, expect } from '@playwright/test';
import { prismabd } from '../prisma/prismadb';

test.describe('Home Page - Full E2E Test', () => {
  // Перед каждым тестом переходим на главную страницу
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('должны успешно загрузиться и отобразить заголовок, боковую панель и основное содержимое', async ({
    page,
  }) => {
    // Проверяем заголовок страницы
    await expect(
      page.getByRole('heading', { name: /home page/i })
    ).toBeVisible();

    // Проверяем, что хедер виден
    //Роль 'banner' соответствует шапке сайта (<header>).
    await expect(page.getByRole('banner')).toBeVisible();

    // Проверяем, что сайдбар виден
    //Роль 'complementary' соответствует боковой панели (<aside>).
    await expect(page.getByRole('complementary')).toBeVisible();
  });

  test.describe('Header', () => {
    test('Заголовок должен содержать рабочую ссылку «Домой»,навигационною панель с ссылками, кнопки Sign In / Sign Up', async ({
      page,
    }) => {
      const homeLinkHeader = page.getByRole('link', { name: 'New Project' });

      // Проверяем, что ссылка "New Project" в хедере видна
      await expect(homeLinkHeader).toBeVisible();

      // Кликаем по ссылке и проверяем, что URL не изменился (т.к. мы уже на главной)
      await homeLinkHeader.click();
      await expect(page).toHaveURL('/');

      // Проверяем, что заголовок главной страницы все еще виден
      await expect(
        page.getByRole('heading', { name: /home page/i })
      ).toBeVisible();
      // Проверяем, что список отображается
      const categoriesList = page.locator('ul.hidden.md\\:flex');
      await expect(categoriesList).toBeVisible();

      // Кнопки Sign In / Sign Up
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    });
  });
  // Проверка динамического списка категорий в header:
  // перехвать и замокать данные e2e нельзя,так как данные по категориям мы получает при помощи прямого запроса в БД
  // будем напрямую записывать в БД одну категорию, проверять её, потом удалять
  test.describe('Категории заголовков с реальной базой данных', () => {
    const testCategoryName = `Test Category ${Date.now()}`;
    let categoryId: string;

    // 1. Перед тестом создаем категорию в базе данных
    test.beforeAll(async () => {
      const newCategory = await prismabd.category.create({
        data: { name: testCategoryName },
      });
      categoryId = newCategory.id;
    });

    // 3. После теста удаляем созданную категорию для чистоты
    test.afterAll(async () => {
      if (categoryId) {
        await prismabd.category.delete({ where: { id: categoryId } });
      }
    });

    // 2. Проверяем, что категория отображается на главной странице
    test('должна отображаться категория из реальной базы данных', async ({
      page,
    }) => {
      // Устанавливаем заголовки, чтобы отключить кэш на стороне сервера Next.js
      await page.setExtraHTTPHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });

      // Переходим на главную страницу
      await page.goto('/');

      // Проверяем, что наша категория видна в списке
      await expect(
        page.getByRole('listitem').filter({ hasText: testCategoryName })
      ).toBeVisible();
    });
  });

  /* test.describe('Sidebar Navigation', () => {
    const navLinks = [
      { name: 'Категория', path: '/category', heading: /category page/i },
      { name: 'Типы', path: '/type', heading: /type page/i },
      { name: 'Секции', path: '/section', heading: /section page/i },
    ];

    for (const navLink of navLinks) {
      test(`should navigate to the ${navLink.name} page correctly`, async ({
        page,
      }) => {
        // Находим ссылку в сайдбаре и кликаем по ней
        await page.getByRole('link', { name: navLink.name }).click();

        // Проверяем, что URL изменился на правильный
        await expect(page).toHaveURL(navLink.path);

        // Проверяем, что на новой странице виден правильный заголовок
        await expect(page.getByRole('heading', { name: navLink.heading })).toBeVisible();
      });
    }
  }); */
});
