import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "../../store/use-auth";
import { AuthApi } from "./auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const publicRoutes = ["/core/auth/", "/core/change-password/", "/core/refresh"];

api.interceptors.request.use(
  function (config) {
    const isPublicRoute = publicRoutes.some((route) =>
      config.url?.startsWith(route),
    );
    if (!isPublicRoute) {
      const authState = useAuthStore.getState();
      // Não tentar obter token se logout está em progresso
      if (!authState.loggingOut) {
        const accessToken = authState.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    }

    return config;
  },
  function (error) {
    toast.error(`Erro de requisição: ${error.message}`);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  function (response) {
    if (response.data?.access) {
      useAuthStore
        .getState()
        .setAccessToken({ accessToken: response.data.access });
    }
    if (response.data?.refresh) {
      useAuthStore
        .getState()
        .setRefreshToken({ refreshToken: response.data.refresh });
    }

    return response;
  },
  function (error) {
    const { response } = error;

    if (response?.data?.access) {
      useAuthStore
        .getState()
        .setAccessToken({ accessToken: response.data.access });
    }
    if (response?.data?.refresh) {
      useAuthStore
        .getState()
        .setRefreshToken({ refreshToken: response.data.refresh });
    }

    const errorMessage =
      response?.data?.detail || response?.data?.message || "Erro desconhecido";

    // Não exibir toast para erros de página inválida (serão tratados localmente)
    if (!errorMessage.includes("Invalid page")) {
      toast.error(`Erro: ${errorMessage}`);
    }

    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.config?.url?.includes("core/refresh")) {
      return Promise.reject(error);
    }

    // Handle both 401 (Unauthorized) and 403 (Forbidden) as they may indicate expired tokens
    if (
      !error.response ||
      (error.response.status !== 401 && error.response.status !== 403) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Verificar se logout está em progresso para evitar recursão
    const authState = useAuthStore.getState();
    if (authState.loggingOut) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const refreshToken = authState.getRefreshToken();
      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }
      const response = await AuthApi.refresh({ refresh: refreshToken });
      const { access, refresh } = response.data;
      authState.setAccessToken({ accessToken: access });
      authState.setRefreshToken({ refreshToken: refresh });
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Verificar novamente se logout não está em progresso antes de chamar
      const currentAuthState = useAuthStore.getState();
      if (!currentAuthState.loggingOut) {
        currentAuthState.logout();
      }
      return Promise.reject(refreshError);
    }
  },
);
