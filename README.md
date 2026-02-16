# Winly UI Automation Framework

Главный документ фреймворка. Ниже — единые правила для разработки, ревью и масштабирования автотестов на Playwright в этом репозитории.

## 1) Цель фреймворка

### Что тестируем
- UI-критические пользовательские сценарии Winly (логин, покупка паков, проверки баланса).
- Интеграцию UI + backend контрактов через API-клиенты в тестах (например, проверка изменения баланса после покупки).
- Поведение системы в браузере Chromium с изоляцией по контекстам.

### Для чего
- Быстро и стабильно ловить регрессии в пользовательских флоу, влияющих на деньги/балансы/доступ.
- Дать команде предсказуемый фидбек в CI по качеству релиза.
- Поддерживать тестовый код как продукт: читабельность, расширяемость, повторное использование.

### Ожидаемый уровень качества
- **Стабильность**: флейки недопустимы; любые нестабильные тесты считаются дефектом автоматизации.
- **Детерминизм**: тесты не зависят от порядка запуска и не «лечатся» `waitForTimeout`.
- **Диагностируемость**: при падении должны оставаться trace/video/screenshot и понятные шаги.
- **Скорость обратной связи**: параллельный запуск, разумные таймауты, минимальные лишние ожидания.

---

## 2) Архитектура

### Архитектурные слои
1. **Tests (`src/tests`)**
   - Описывают бизнес-сценарии на уровне действий пользователя и бизнес-ожиданий.
   - Не содержат деталей DOM-разметки.
2. **Pages (`src/pages`)**
   - Page Object Model: локаторы и UI-действия инкапсулированы в классы страниц/модалок/iframe.
   - Тесты используют методы страниц, а не `page.locator(...)` напрямую.
3. **Fixtures (`src/fixtures`)**
   - DI-слой: единая точка создания page object и API-клиентов.
   - Общие подготовительные шаги (авторизация, env-конфиг).
4. **API clients (`src/api`)**
   - Вспомогательные клиенты для валидации состояния backend и синхронизации с UI.
5. **Types (`src/types`)**
   - Доменные типы и контракты данных.

### Структура папок
- `src/tests/auth` — авторизация/преднастройка сессии.
- `src/tests/deposit` — сценарии депозитов/покупок.
- `src/pages/base` — базовый класс c общими операциями.
- `src/pages/*` — доменные page objects по зонам приложения.
- `src/fixtures` — кастомные фикстуры Playwright и bootstrap логики.
- `playwright.config.ts` — единые настройки раннера, проектов и артефактов.

### Паттерны и DSL
- **POM + Fixture DI** — основной DSL проекта.
  - Шаги теста читаются как бизнес-скрипт: `openShop -> selectCoinPack -> completePurchase -> verifyBalance`.
- **test.step(...)** — для важных этапов и диагностируемости отчётов.
- **Web-first assertions** (`expect(locator)...`, `expect.poll`) — стандарт синхронизации.

### Где писать что
- Новый бизнес-сценарий: `src/tests/<domain>/<feature>.spec.ts`.
- Новый экран/модалка/iframe: `src/pages/<domain>/<Entity>Page|Modal.ts`.
- Повторяемая настройка/DI: `src/fixtures/*`.
- Проверки backend/вспомогательные запросы: `src/api/*`.
- Доменные типы DTO: `src/types/*`.

---

## 3) Стиль кода и тестов

### Naming
- Тесты: `should ...` или `... successfully ...` с явным бизнес-результатом.
- Методы POM: глагол + сущность (`openLoginModal`, `selectCoinPackByBusinessData`, `waitForSuccess`).
- Локаторы: `submitButton`, `usernameInput`, `sideNavigation` (что это, а не как найдено).

### Структура теста
Рекомендуемый формат: **AAA / Given-When-Then**.

- **Given**: подготовка данных/состояния (API, preconditions, стартовая навигация).
- **When**: действия пользователя через POM.
- **Then**: UI + API-ассерты, явно проверяющие бизнес-ожидания.

Минимальный каркас:

```ts
test('Should ...', async ({ page, somePage, someAPI }) => {
  // Given
  await page.goto('/');
  const before = await someAPI.getState();

  // When
  await somePage.performAction();

  // Then
  await expect(somePage.successToast).toBeVisible();
  await expect.poll(() => someAPI.getState()).toBe(before + 1);
});
```

### Правила локаторов
- Предпочитать **web-first** локаторы:
  - `getByRole(...)`
  - `getByPlaceholder(...)`
  - `getByTestId(...)` (если добавлен стабильный test id)
- Избегать хрупких XPath и длинных CSS-цепочек, завязанных на DOM-иерархию.
- Соблюдать strictness: действие на элементе — только с локатором, который однозначно находит один элемент.

### Правила ожиданий и ассертов
- ❌ Запрещено: `page.waitForTimeout(...)`.
- ✅ Использовать auto-wait Playwright + web-first assertions (`toBeVisible`, `toHaveText`, `toBeEnabled`).
- Для eventual consistency между UI и API — `expect.poll(...)`.

### Логирование и отчётность
- В POM допустимо техническое логирование через базовый `log(...)`.
- Критические шаги теста оформлять через `test.step(...)`.
- Обязательно сохранять артефакты падений (trace/screenshot/video уже включены конфигом).

---

## 4) Принципы работы с AI в этом репозитории

### AI можно
- Генерировать черновики тестов/страниц/фикстур в существующей архитектуре POM + fixtures.
- Предлагать рефакторинг для уменьшения дублирования и повышения устойчивости.
- Помогать с анализом флейков по trace/error и предлагать детерминированные правки.

### AI нельзя
- Добавлять `waitForTimeout` и другие «костыли ожидания».
- Хардкодить нестабильные селекторы (XPath/CSS по глубокой структуре) при наличии role/test-id подхода.
- Оставлять «временные» решения вида `TODO: пока так`, если это влияет на надёжность.
- Дублировать код, который должен быть вынесен в POM/BasePage/fixtures.
- Маскировать архитектурные проблемы отключением тестов, `test.fixme` без причины, увеличением таймаутов «наугад».

### Ожидаемый стиль AI-ответов
- Кратко: что сделано.
- Точно: почему решение устойчиво и как влияет на флейки.
- Прозрачно: какие проверки/команды запускались.
- Без «магии»: если есть ограничения среды — явно указать.

### Что считаем «грязью»
- «Пока так» в продовом тестовом коде без задачи на устранение.
- Хардкод бизнес-данных там, где нужен доменный источник (API/fixture/config).
- Неинкапсулированные локаторы в тестах.
- Несогласованный стиль именования и структуры файлов.

---

## 5) Эталонные примеры

Ниже шаблоны, которых придерживаемся как «идеальных».

### Идеальный тест (бизнес-поток)
```ts
test('Should successfully purchase coin pack', async ({
  page,
  lobbyPage,
  shopModal,
  purchaseModal,
  paymentFrame,
  coinPacksAPI,
  depositAPI,
  balanceAPI,
}) => {
  // Given
  await page.goto('/');
  const packs = await coinPacksAPI.fetchCoinPacks();
  const selectedPack = packs.find(p => p.status === 'active');
  if (!selectedPack) throw new Error('No active coin pack found');

  const gcBefore = await balanceAPI.getBalance('GC');
  const scBefore = await balanceAPI.getBalance('SC');

  // When
  await lobbyPage.openShop();
  const selected = await shopModal.selectCoinPackByBusinessData(selectedPack);
  await purchaseModal.waitForOpen();
  const depositInit = await purchaseModal.clickCompletePurchaseAndWaitDeposit(selected.packId);

  await paymentFrame.fillCardDetails({
    number: '4000020951595032',
    expiry: '11/30',
    cvv: '777',
    holder: 'Test Test',
  });
  await paymentFrame.submit();
  await purchaseModal.waitForSuccess();
  await depositAPI.waitForDepositComplete(depositInit.paymentId);

  // Then
  await expect.poll(() => balanceAPI.getBalance('GC')).toBe(gcBefore + selected.gcAmount);
  await expect.poll(() => balanceAPI.getBalance('SC')).toBe(scBefore + selected.scAmount);
});
```

### Идеальная фикстура
```ts
export const test = base.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  lobbyPage: async ({ page }, use) => use(new LobbyPage(page)),
  balanceAPI: async ({ request }, use) => use(new BalanceAPIClient(request)),
});
```

Принцип: тест получает готовые зависимости и описывает сценарий, а не создание объектов.

### Идеальный page object
```ts
export class LoginPage extends BasePage {
  readonly usernameInput = this.page.getByPlaceholder('Enter username');
  readonly passwordInput = this.page.getByPlaceholder('Enter password');
  readonly submitButton = this.page.getByRole('button', { name: 'Login' });

  async login(username: string, password: string): Promise<void> {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.submitButton);
  }
}
```

Принцип: локаторы и техническая механика скрыты внутри POM, снаружи — бизнес-действие.

---

## 6) Быстрый старт

1. Установить зависимости:
   - `npm install`
   - `npx playwright install`
2. Создать `.env` из `.env.example` и заполнить валидные креды.
3. Запуск тестов:
   - `npm run test`
4. Открыть отчёт:
   - `npm run report`

---

## 7) Definition of Done для изменений в тестовом коде

Изменение готово к merge, если:
- тест/фича детерминированны и не используют жёсткие паузы;
- локаторы устойчивые и читаемые;
- дублирование вынесено в POM/fixtures/base;
- падения диагностируются по trace/video/screenshot;
- пройдены локальные проверки, а описание PR объясняет мотивацию и риски.
