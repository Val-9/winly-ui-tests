export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

export function getAuthCredentials(): { username: string; password: string } {
  const username = process.env.SETUP_USERNAME ?? process.env.LOGIN_USERNAME;
  const password = process.env.SETUP_PASSWORD ?? process.env.LOGIN_PASSWORD;

  if (!username || !password) {
    throw new Error('Auth credentials are required. Set SETUP_USERNAME/SETUP_PASSWORD or LOGIN_USERNAME/LOGIN_PASSWORD');
  }

  return { username, password };
}
