// store/use-auth.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types/user";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  originalUserType: string | null;
  isImpersonating: boolean;
  sessionExpiry: number | null;
  loggingOut: boolean;
  isHydrated: boolean;
  // Novos campos para armazenar dados originais do admin
  originalAccessToken: string | null;
  originalRefreshToken: string | null;
  originalUser: User | null;
  originalSessionExpiry: number | null;
  // Actions
  setAccessToken: (data: { accessToken: string }) => void;
  setRefreshToken: (data: { refreshToken: string }) => void;
  setUser: (user: User) => void;
  login: (
    tokens: { accessToken: string; refreshToken: string },
    user?: User | null,
  ) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isSessionValid: () => boolean;
  extendSession: () => void;
  startImpersonation: (
    tokens: { accessToken: string; refreshToken: string },
    originalUserType: string,
  ) => void;
  stopImpersonation: () => void;
}

const SESSION_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 dias em millisegundos

// Função para definir cookie
const setCookie = (name: string, value: string, days: number = 2) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
};

// Função para remover cookie
const removeCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isImpersonating: false,
      sessionExpiry: null,
      originalUserType: null,
      loggingOut: false,
      isHydrated: false,
      // Novos campos inicializados
      originalAccessToken: null,
      originalRefreshToken: null,
      originalUser: null,
      originalSessionExpiry: null,

      setAccessToken: (data) => {
        set({
          accessToken: data.accessToken,
          isAuthenticated: !!data.accessToken,
        });
      },

      setRefreshToken: (data) => {
        set({ refreshToken: data.refreshToken });
      },

      setUser: (user) => {
        set({ user });
      },

      login: (tokens, user = null) => {
        const expiryTime = Date.now() + SESSION_DURATION;
        const newState = {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: true,
          sessionExpiry: expiryTime,
        };

        set(newState);

        // Definir cookie para o middleware
        setCookie("auth-storage", JSON.stringify({ state: newState }), 2);
      },

      logout: () => {
        const currentState = get();

        // Prevenir recursão infinita
        if (currentState.loggingOut) {
          return;
        }

        set({ loggingOut: true });

        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          sessionExpiry: null,
          loggingOut: false,
          // Limpar também dados originais
          isImpersonating: false,
          originalUserType: null,
          originalAccessToken: null,
          originalRefreshToken: null,
          originalUser: null,
          originalSessionExpiry: null,
        });

        // Limpar localStorage e cookies
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          removeCookie("auth-storage");
        }
      },

      getAccessToken: () => {
        const state = get();

        // Prevenir recursão durante logout
        if (state.loggingOut) {
          return null;
        }

        if (!state.isSessionValid()) {
          state.logout();
          return null;
        }
        return state.accessToken;
      },

      startImpersonation: (tokens, originalUserType) => {
        const currentState = get();

        // Salvar dados atuais do admin antes da personificação
        set({
          // Salvar dados originais do admin
          originalAccessToken: currentState.accessToken,
          originalRefreshToken: currentState.refreshToken,
          originalUser: currentState.user,
          originalSessionExpiry: currentState.sessionExpiry,
          originalUserType,
          // Definir novos tokens da modelo
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isImpersonating: true,
          // Manter autenticação ativa
          isAuthenticated: true,
        });

        // Atualizar cookie
        const updatedState = get();
        setCookie("auth-storage", JSON.stringify({ state: updatedState }), 2);
      },

      stopImpersonation: () => {
        const currentState = get();

        // Restaurar dados originais do admin
        const restoredState = {
          accessToken: currentState.originalAccessToken,
          refreshToken: currentState.originalRefreshToken,
          user: currentState.originalUser,
          sessionExpiry: currentState.originalSessionExpiry,
          isAuthenticated: true, // Manter autenticado como admin
          isImpersonating: false,
          originalUserType: null,
          // Limpar dados originais salvos
          originalAccessToken: null,
          originalRefreshToken: null,
          originalUser: null,
          originalSessionExpiry: null,
        };

        set(restoredState);

        // Atualizar cookie
        setCookie("auth-storage", JSON.stringify({ state: restoredState }), 2);
      },

      getRefreshToken: () => {
        const state = get();

        // Prevenir recursão durante logout
        if (state.loggingOut) {
          return null;
        }

        if (!state.isSessionValid()) {
          state.logout();
          return null;
        }
        return state.refreshToken;
      },

      isSessionValid: () => {
        const state = get();
        // Se não está autenticado, não precisa validar sessão
        if (!state.isAuthenticated) {
          return false;
        }

        // Para personificação, usar dados originais se disponíveis
        const expiryToCheck =
          state.isImpersonating && state.originalSessionExpiry
            ? state.originalSessionExpiry
            : state.sessionExpiry;

        // Se não tem sessionExpiry ou accessToken, sessão é inválida
        if (!expiryToCheck || !state.accessToken) {
          return false;
        }

        // Verificar se a sessão não expirou
        return Date.now() < expiryToCheck;
      },

      extendSession: () => {
        const state = get();
        if (state.isAuthenticated && state.accessToken) {
          const newExpiryTime = Date.now() + SESSION_DURATION;

          // Se está personificando, estender sessão original
          if (state.isImpersonating) {
            set({ originalSessionExpiry: newExpiryTime });
          } else {
            set({ sessionExpiry: newExpiryTime });
          }

          // Atualizar cookie
          const updatedState = get();
          setCookie("auth-storage", JSON.stringify({ state: updatedState }), 2);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Persistir todos os campos necessários
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        sessionExpiry: state.sessionExpiry,
        isAuthenticated: state.isAuthenticated,
        isImpersonating: state.isImpersonating,
        originalUserType: state.originalUserType,
        originalAccessToken: state.originalAccessToken,
        originalRefreshToken: state.originalRefreshToken,
        originalUser: state.originalUser,
        originalSessionExpiry: state.originalSessionExpiry,
      }),
      // Verificar validade da sessão ao hidratar
      onRehydrateStorage: () => (resolvedState: AuthState | undefined) => {
        if (resolvedState) {
          resolvedState.isHydrated = true;

          if (
            resolvedState.isAuthenticated &&
            !resolvedState.isSessionValid()
          ) {
            resolvedState.logout();
          } else if (resolvedState.isAuthenticated) {
            // Sincronizar cookie após hidratação
            setCookie(
              "auth-storage",
              JSON.stringify({ state: resolvedState }),
              2,
            );
          }
        }
      },
    },
  ),
);
