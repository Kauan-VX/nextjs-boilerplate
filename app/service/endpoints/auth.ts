import { api } from "./api";

export const AuthApi = {
  login: async ({
    email,
    password,
    mfa_token,
  }: {
    email: string;
    password: string;
    mfa_token: string;
  }) => {
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);
    params.append("mfa_token", mfa_token);

    return await api.post("core/auth-admin", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  refresh: async ({ refresh }: { refresh: string }) => {
    const params = new URLSearchParams();
    params.append("refresh", refresh);

    return await api.post("core/token-refresh", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },
};
