import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,

      setAuth: (user, tokens) => set({
        user,
        accessToken:  tokens.access,
        refreshToken: tokens.refresh,
      }),

      clearAuth: () => set({
        user:         null,
        accessToken:  null,
        refreshToken: null,
      }),

      isLoggedIn: () => !!get().accessToken,
    }),
    {
      name: 'tenebra-auth',  // key di localStorage
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)