import { test, expect } from '@playwright/test';

// Группа тестов для главной страницы.
// test.describe помогает организовать тесты в логические блоки.
test.describe('Home Page - Full E2E Test', () => {
  // Этот хук выполняется перед каждым тестом в этой группе.
  // Он гарантирует, что каждый тест начинается с чистого состояния на главной странице.
  test.beforeEach(async ({ page }) => {
    // 1. Переходим на главную страницу по корневому URL.
    await page.goto('/');
  });

  // Тест для проверки базовой загрузки и наличия ключевых элементов layout.
  test('должны успешно загрузиться и отобразить заголовок, боковую панель и основное содержимое', async ({
    page,
  }) => {
    // 1. Проверяем, что главный заголовок страницы виден.
    // Это подтверждает, что основной контент страницы загрузился.
    // 'getByRole' - это надежный способ находить элементы, так как он ориентирован на пользователя.
    await expect(
      page.getByRole('heading', { name: /home page/i })
    ).toBeVisible();

    // 2. Проверяем, что хедер (шапка сайта) виден.
    // Роль 'banner' обычно соответствует тегу <header>.
    await expect(page.getByRole('banner')).toBeVisible();

    // 3. Проверяем, что сайдбар (боковая панель) виден.
    // Роль 'complementary' обычно соответствует тегу <aside>.
    await expect(page.getByRole('complementary')).toBeVisible();
  });

  // Группа тестов специально для проверки хедера.
  test.describe('Header', () => {
    // Тест для проверки содержимого хедера.
    test('Заголовок должен содержать рабочую ссылку «Домой», навигационную панель и кнопки входа/регистрации', async ({
      page,
    }) => {
      // 1. Находим ссылку-логотип по ее роли и тексту.
      const homeLinkHeader = page.getByRole('link', { name: 'New Project' });

      // 2. Убеждаемся, что ссылка-логотип видна на странице.
      await expect(homeLinkHeader).toBeVisible();

      // 3. Кликаем по ссылке и проверяем, что URL не изменился (так как мы уже на главной).
      await homeLinkHeader.click();
      await expect(page).toHaveURL('/');

      // 4. Проверяем, что навигационное меню категорий видимо.
      // Используем data-testid для надежности, чтобы тест не сломался при изменении стилей.
      const categoriesList = page.getByTestId('header-nav-categories');
      await expect(categoriesList).toBeVisible();

      // 5. Проверяем наличие кнопок "Sign In" и "Sign Up".
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    });
  });

  // Группа тестов для проверки навигации в сайдбаре.
  test.describe('Sidebar Navigation', () => {
    // Массив с данными для навигационных ссылок.
    // Это позволяет избежать дублирования кода и легко добавлять новые ссылки для проверки.
    const navLinks = [
      { name: 'Главная', path: '/', heading: /home page/i },
      { name: 'Категория', path: '/category', heading: /категории/i },
      { name: 'Типы', path: '/type', heading: /типы/i },
      { name: 'Секции', path: '/section', heading: /секции/i },
      {
        name: 'Для тестирования',
        path: '/for-testing',
        heading: /for Testing/i,
      },
    ];

    // Один комплексный тест, который проверяет все аспекты навигации.
    test('должен содержать правильные ссылки и корректно переходить по ним', async ({
      page,
    }) => {
      // --- Проверка наличия и атрибутов ---

      // 1. Проверяем, что заголовок меню в сайдбаре виден.
      const headingMenu = page.getByRole('heading', { name: /MyApp/i });
      await expect(headingMenu).toBeVisible();

      // 2. Находим все навигационные элементы в списке.
      const navItems = page.locator('nav ul li');

      // 3. Убеждаемся, что количество ссылок соответствует ожидаемому.
      await expect(navItems).toHaveCount(navLinks.length);

      // --- Проверка переходов ---

      // 4. Проходим в цикле по каждой ссылке для детальной проверки.
      for (const navLink of navLinks) {
        // Находим ссылку по имени.
        const link = page.getByRole('link', { name: navLink.name });

        // Убеждаемся, что у ссылки правильный href.
        await expect(link).toHaveAttribute('href', navLink.path);

        // Кликаем по ссылке.
        await link.click();

        // Проверяем, что URL страницы изменился на правильный.
        await expect(page).toHaveURL(navLink.path);

        // Проверяем, что на новой странице отображается правильный заголовок.
        // Это подтверждает, что нужная страница успешно загрузилась.
        await expect(
          page.getByRole('heading', { name: navLink.heading })
        ).toBeVisible();

        // Возвращаемся на главную страницу для следующей итерации (если это не последняя ссылка).
        if (navLink.path !== '/') {
          await page.goto('/');
        }
      }
    });
  });
});