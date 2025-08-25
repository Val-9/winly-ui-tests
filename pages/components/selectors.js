// Central place for resilient selectors.
export const topBar = {
  loginButton:  (page) => page.getByRole('button', { name: /^Log in$/i }).first(),
  signUpButton: (page) => page.getByRole('button', { name: /^Sign up$/i }).first(),
  rewardsButton:(page) => page.getByRole('button', { name: /Rewards/i }),
  shopButton:   (page) => page.getByRole('button', { name: /^Shop$/i }),
  avatarButton: (page) => page.locator('button, a')
                             .filter({ has: page.locator('img[alt=""]') }).first(),
};

export const authModal = {
  root: (page) => page.getByRole('dialog'),

  // Tabs
  registrationTab: (page) => page.getByRole('tab', { name: /^Registration$/i }),
  loginTab:        (page) => page.getByRole('tab', { name: /^Login$/i }),

  // Step 1 (Registration)
  username: (page) => page.locator('input[name="username"]'),
  next:     (page) => page.getByRole('button', { name: /^Next$/i }),

  // Step 2 (Registration)
  password:        (page) => page.locator('input[name="password"]'),
  confirmPassword: (page) => page.locator('input[name="confirmPassword"]'),
  ageCheckbox:     (page) =>
    page.getByLabel(/I am at least 18 years old and not a resident of the restricted states/i),
  termsCheckbox:   (page) =>
    page.getByLabel(/I accept the Terms of Use and Privacy Policy/i),
  join:            (page) => page.getByRole('button', { name: /Join Us/i }),

  // Login (используем те же username/password + submit)
  submitLogin: (page) => page.getByRole('button', { name: /^Login$/i }),
};


// ---------- HOME ----------
export const home = {
  // Секция "All Games" (у разделов общий класс mb-8 — фильтруем по заголовку)
  allGamesSection: (page) =>
    page.locator('div.mb-8').filter({
      has: page.getByRole('heading', { name: /All Games/i }), // без ^$
    }).first(),

  // Заголовок внутри секции
  allGamesHeading: (page) =>
    home.allGamesSection(page).getByRole('heading', { name: /All Games/i }),

  // Грид именно в этой секции (а не любой на странице)
  allGamesGrid: (page) =>
    home.allGamesSection(page).locator('div._gamesGrid_416wv_1'),

  // Карточка по title
  gameCardByTitle: (page, title) =>
    home.allGamesGrid(page).locator(`div[title="${title}"]`).first(),

  // Первая карточка списка
  firstCard: (page) =>
    home.allGamesGrid(page).locator('div[title]').first(),

  // Кнопка Play внутри карточки
  playBtnInsideCard: (card) =>
    card.getByRole('button', { name: /^Play$/i }),
};




