import { defineConfig, devices } from '@playwright/test';


// Используйте dotenv для чтения переменных окружения из .env файла
// require('dotenv').config();

// См. https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests',
  /* Запускать тесты в файлах параллельно */
  fullyParallel: true,
  /* Завершать выполнение, если один из тестов упал */
  forbidOnly: !!process.env.CI,
  /* Количество повторных попыток при неудаче */
  retries: process.env.CI ? 2 : 0,
  /* Количество параллельных воркеров */
  workers: process.env.CI ? 1 : undefined,
  /* Репортер для вывода результатов. См. https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Глобальные настройки для всех проектов */
  use: {
    /* Базовый URL для таких действий, как `await page.goto('/')` */
    baseURL: 'http://localhost:3000',

    /* Собирать трассировку при неудачной попытке. См. https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Конфигурация для отдельных проектов */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Запуск dev-сервера перед началом тестов */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
