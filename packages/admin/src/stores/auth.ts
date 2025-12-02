import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IAdminUser } from '@rocketbird/shared';

interface AuthState {
  token: string | null;
  adminInfo: IAdminUser | null;
  permissions: string[];
  login: (data: { token: string; adminInfo: IAdminUser; permissions: string[] }) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      adminInfo: null,
      permissions: [],

      login: (data) => {
        set({
          token: data.token,
          adminInfo: data.adminInfo,
          permissions: data.permissions,
        });
      },

      logout: () => {
        set({
          token: null,
          adminInfo: null,
          permissions: [],
        });
      },

      hasPermission: (permission: string) => {
        const { permissions } = get();
        // 超级管理员拥有所有权限
        if (permissions.includes('*')) return true;
        return permissions.includes(permission);
      },
    }),
    {
      name: 'rocketbird-admin-auth',
    }
  )
);
