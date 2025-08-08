import { test, expect } from '@playwright/test';

test.describe('TypePage Full Lifecycle E2E Test', () => {
  const newTypeName = `Тестовый тип ${Date.now()}`;
  const updatedTypeName = `Обновленный тип ${Date.now()}`;

  test('должен выполнить полный цикл: создать, отредактировать и удалить тип', async ({
    page,
  }) => {
    await page.goto('/type');

    // --- ЭТАП 0: Проверка начального состояния ---
    await test.step('Проверка начального состояния страницы', async () => {
      // 1. Проверяем, что заголовок страницы виден
      await expect(
        page.getByRole('heading', { name: 'Типы', level: 1 })
      ).toBeVisible();

      // 2. Проверяем, что кнопка для создания типа на месте
      await expect(
        page.getByRole('button', { name: /Создать тип/i })
      ).toBeVisible();

      // 3. Проверяем, что на странице есть хотя бы одна карточка типа (если есть данные)
      // или, по крайней мере, контейнер для них.
      // Это подтверждает, что компонент отрендерился.
      await expect(page.getByTestId('type-card').first()).toBeVisible();
    });

    // --- ЭТАП 1: Создание ---
    await test.step('Создание нового типа', async () => {
      // 1. Кликаем на кнопку "Создать тип"
      await page.getByRole('button', { name: /Создать тип/i }).click();

      // 2. Проверяем, что появилось модальное окно
      const createModal = page.getByRole('heading', {
        name: 'Создать новый тип',
      });
      await expect(createModal).toBeVisible();

      // 3. Вводим имя нового типа
      await page.getByLabel(/Название типа/i).fill(newTypeName);

      // 4. Нажимаем кнопку "Создать"
      await page.getByRole('button', { name: 'Создать' }).click();

      // 5. Проверяем, что модальное окно ЗАКРЫЛОСЬ
      await expect(createModal).not.toBeVisible();

      // 6. Проверяем уведомление об успехе
      await expect(page.getByText('Тип успешно создан')).toBeVisible();

      // 7. Проверяем, что новый тип появился в списке
      await expect(
        page.getByRole('main').getByText(newTypeName, { exact: true })
      ).toBeVisible();
    });

    // --- ЭТАП 2: Редактирование ---
    await test.step('Редактирование созданного типа', async () => {
      // 1. Находим карточку нашего нового типа
      const typeCard = page
        .getByTestId('type-card')
        .filter({ hasText: newTypeName });

      // 2. Нажимаем кнопку "Редактировать"
      await typeCard.getByRole('button', { name: /Редактировать тип/i }).click();

      // 3. Проверяем, что появилось модальное окно
      const updateModal = page.getByRole('heading', {
        name: 'Редактирование типа',
      });
      await expect(updateModal).toBeVisible();

      // 4. Вводим новое имя
      await page.getByLabel(/Название типа/i).fill(updatedTypeName);

      // 5. Нажимаем кнопку "Обновить"
      await page.getByRole('button', { name: 'Обновить' }).click();

      // 6. Проверяем, что модальное окно ЗАКРЫЛОСЬ
      await expect(updateModal).not.toBeVisible();

      // 7. Проверяем уведомление об успехе
      await expect(page.getByText('Тип успешно обновлен')).toBeVisible();

      // 8. Проверяем, что на странице появился тип с новым именем
      await expect(
        page.getByRole('main').getByText(updatedTypeName, { exact: true })
      ).toBeVisible();

      // 9. Проверяем, что тип со старым именем исчез
      await expect(page.getByText(newTypeName)).not.toBeVisible();
    });

    // --- ЭТАП 3: Удаление ---
    await test.step('Удаление отредактированного типа', async () => {
      // 1. Находим карточку нашего обновленного типа
      const typeCard = page
        .getByTestId('type-card')
        .filter({ hasText: updatedTypeName });

      // 2. Нажимаем кнопку "Удалить" внутри этой карточки
      await typeCard.getByRole('button', { name: /Удалить тип/i }).click();

      // 3. Проверяем уведомление об успехе
      await expect(page.getByText('Тип успешно удален')).toBeVisible();

      // 4. Проверяем, что тип исчез со страницы
      await expect(page.getByText(updatedTypeName)).not.toBeVisible();
    });
  });
});