function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

export function getRequiredEnv(name: string): string {
  return required(name);
}


export function getSetupCredentials(): { username: string; password: string } {
  return {
    username: required('SETUP_USERNAME'),
    password: required('SETUP_PASSWORD'),
  };
}


export function getLoginTestCredentials(): { username: string; password: string } {
  return {
    username: required('LOGIN_USERNAME'),
    password: required('LOGIN_PASSWORD'),
  };
}
