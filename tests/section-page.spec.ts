import { test, expect } from '@playwright/test';

test.describe('SectionPage  E2E тест', () => {
  const newSectionName = `Тестовая секция`;
  const updatedSectionName = `Обновленная секция`;

  test('должен выполнить полный цикл: создать, отредактировать и удалить секцию', async ({
    page,
  }) => {
    await page.goto('/section');

    // --- ЭТАП 0: Проверка начального состояния ---
    await test.step('Проверка начального состояния страницы', async () => {
      // 1. Проверяем, что заголовок страницы виден
      await expect(
        page.getByRole('heading', { name: 'Секции', level: 1 })
      ).toBeVisible();

      // 2. Проверяем, что кнопка для создания типа на месте
      await expect(
        page.getByRole('button', { name: /Создать секцию/i })
      ).toBeVisible();

      // 3. Проверяем, что на странице есть хотя бы одна карточка типа (если есть данные)
      // или, по крайней мере, контейнер для них.
      // Это подтверждает, что компонент отрендерился.

      await expect(page.getByTestId('section-card').first()).toBeVisible({
        timeout: 10000,
      });
    });
    // --- ЭТАП 1: Создание ---
    await test.step('Создание новой секции', async () => {
      // 1. Кликаем на кнопку "Создать секцию"
      await page.getByRole('button', { name: /Создать секцию/i }).click();

      // 2. Проверяем, что появилось модальное окно
      const createModal = page.getByRole('heading', {
        name: 'Создать секцию',
      });
      await expect(createModal).toBeVisible();

      // 3. Вводим имя новой секции
      await page.getByLabel(/Название секции/i).fill(newSectionName);

      // 4. Нажимаем кнопку "Создать"
      await page.getByRole('button', { name: 'Создать' }).click();

      // 5. Проверяем, что модальное окно ЗАКРЫЛОСЬ
      await expect(createModal).not.toBeVisible();

      // 6. Проверяем уведомление об успехе
      await expect(page.getByText('Секция успешно создана')).toBeVisible();

      // 7. Проверяем, что новая секция появилась в списке
      await expect(
        page.getByRole('main').getByText(newSectionName, { exact: true })
      ).toBeVisible();
    });
    // --- ЭТАП 2: Редактирование ---
    await test.step('Редактирование созданной секции', async () => {
      // 1. Находим карточку нашей новой секции
      const sectionCard = page
        .getByTestId('section-card')
        .filter({ hasText: newSectionName });

      // 2. Нажимаем кнопку "Редактировать"
      await sectionCard.getByRole('button', { name: /Редактировать/i }).click();

      // 3. Проверяем, что появилось модальное окно
      const updateModal = page.getByRole('heading', {
        name: 'Редактировать секцию',
      });
      await expect(updateModal).toBeVisible();

      // 4. Вводим новое имя
      await page.getByLabel(/Название секции/i).fill(updatedSectionName);

      // 5. Нажимаем кнопку "Обновить"
      await page.getByRole('button', { name: 'Обновить' }).click();

      // 6. Проверяем, что модальное окно ЗАКРЫЛОСЬ
      await expect(updateModal).not.toBeVisible();

      // 7. Проверяем уведомление об успехе
      await expect(page.getByText('Секция успешно обновлена')).toBeVisible();

      // 8. Проверяем, что на странице появилась секция с новым именем
      await expect(
        page.getByRole('main').getByText(updatedSectionName, { exact: true })
      ).toBeVisible();

      // 9. Проверяем, что секция со старым именем исчезла
      await expect(page.getByText(newSectionName)).not.toBeVisible();
    });

    // --- ЭТАП 3: Удаление ---
    await test.step('Удаление отредактированной секции', async () => {
      // 1. Находим карточку нашей обновленной секции
      const sectionCard = page
        .getByTestId('section-card')
        .filter({ hasText: updatedSectionName });

      // 2. Нажимаем кнопку "Удалить" внутри этой карточки
      await sectionCard.getByRole('button', { name: /delete/i }).click();

      // 3. Проверяем, что появился диалог подтверждения
      await expect(
        page.getByRole('heading', { name: 'Удалить секцию' })
      ).toBeVisible();

      // 4. Подтверждаем удаление
      await page.getByRole('button', { name: 'Удалить' }).click();

      // 5. Проверяем уведомление об успехе
      await expect(page.getByText('Секция успешно удалена')).toBeVisible();

      // 6. Проверяем, что секция исчезла со страницы
      await expect(page.getByText(updatedSectionName)).not.toBeVisible();
    });
  });
});
