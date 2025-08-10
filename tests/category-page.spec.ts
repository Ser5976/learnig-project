import { test, expect } from '@playwright/test';

test.describe('CategoryPage  E2E тест', () => {
  const newCategoryName = `Тестовая категория ${Date.now()}`;
  const updatedCategoryName = `Обновленная категория ${Date.now()}`;

  test('должен выполнить полный цикл: создать, отредактировать и удалить категорию', async ({
    page,
  }) => {
    await page.goto('/category');

    // --- ЭТАП 0: Проверка начального состояния ---
    await test.step('Проверка начального состояния страницы', async () => {
      // 1. Проверяем, что заголовок страницы виден
      await expect(
        page.getByRole('heading', { name: 'Категории', level: 1 })
      ).toBeVisible();

      // 2. Проверяем, что кнопка для создания категории на месте
      await expect(
        page.getByRole('button', { name: /Создать категорию/i })
      ).toBeVisible();

      // 3. Проверяем, что на странице есть хотя бы одна карточка типа (если есть данные)
      // или, по крайней мере, контейнер для них.
      // Это подтверждает, что компонент отрендерился.
      await expect(page.getByTestId('category-card').first()).toBeVisible();
    });
    // --- ЭТАП 1: Создание ---
    await test.step('Создание новой категории', async () => {
      // 1. Кликаем на кнопку "Создать категорию"
      await page.getByRole('button', { name: /Создать категорию/i }).click();

      // 2. Проверяем, что появилось модальное окно
      const createModal = page.getByRole('heading', {
        name: 'Создать новую категорию',
      });
      await expect(createModal).toBeVisible();

      // 3. Вводим имя новой категории
      await page.getByLabel(/Название категории/i).fill(newCategoryName);

      // 4. Нажимаем кнопку "Создать"
      await page.getByRole('button', { name: 'Создать' }).click();

      // 5. Проверяем, что модальное окно ЗАКРЫЛОСЬ
      await expect(createModal).not.toBeVisible();

      // 6. Проверяем уведомление об успехе
      await expect(page.getByText('Категория успешно создана')).toBeVisible();

      // 7. Проверяем, что новая категория появился в списке
      await expect(
        page.getByRole('main').getByText(newCategoryName, { exact: true })
      ).toBeVisible();
    });
    // --- ЭТАП 2: Редактирование ---
    await test.step('Редактирование созданной категории', async () => {
      // 1. Находим карточку нашей новой категории
      const categoryCard = page
        .getByTestId('category-card')
        .filter({ hasText: newCategoryName });

      // 2. Нажимаем кнопку "Редактировать"
      await categoryCard
        .getByRole('button', { name: /Редактировать категорию/i })
        .click();

      // 3. Проверяем, что появилось модальное окно
      const updateModal = page.getByRole('heading', {
        name: 'Updating the category',
      });
      await expect(updateModal).toBeVisible();

      // 4. Вводим новое имя
      await page.getByLabel(/Название категории/i).fill(updatedCategoryName);

      // 5. Нажимаем кнопку "Обновить"
      await page.getByRole('button', { name: 'Обновить' }).click();

      // 6. Проверяем, что модальное окно ЗАКРЫЛОСЬ
      await expect(updateModal).not.toBeVisible();

      // 7. Проверяем уведомление об успехе
      await expect(page.getByText('Категория успешно обновлена')).toBeVisible();

      // 8. Проверяем, что на странице появилась категория с новым именем
      await expect(
        page.getByRole('main').getByText(updatedCategoryName, { exact: true })
      ).toBeVisible();

      // 9. Проверяем, что категория со старым именем исчезла
      await expect(page.getByText(newCategoryName)).not.toBeVisible();
    });
    // --- ЭТАП 3: Удаление ---
    await test.step('Удаление отредактированной категории', async () => {
      // 1. Находим карточку нашей обновленной категории
      const categoryCard = page
        .getByTestId('category-card')
        .filter({ hasText: updatedCategoryName });

      // 2. Нажимаем кнопку "Удалить" внутри этой карточки
      await categoryCard
        .getByRole('button', { name: /Удалить категорию/i })
        .click();

      // 3. Проверяем уведомление об успехе
      await expect(page.getByText('Категория успешно удалена')).toBeVisible();

      // 4. Проверяем, что категория исчезла со страницы
      await expect(page.getByText(updatedCategoryName)).not.toBeVisible();
    });
  });
});
