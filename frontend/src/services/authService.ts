import { apiClient } from "./apiClient";
import { tokenStorage } from "../lib/token";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
  User,
} from "../types/api";

export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>("/auth/login", credentials);
    tokenStorage.setToken(response.data.access_token);
    tokenStorage.setUser(response.data.user);
    return response.data;
  },

  async register(payload: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>("/auth/register", payload);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    tokenStorage.setUser(response.data);
    return response.data;
  },

  async listUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/auth/users");
    return response.data;
  },

  async updateUserRole(username: string, payload: UpdateUserRoleRequest): Promise<void> {
    await apiClient.patch(`/auth/users/${username}/role`, payload);
  },

  async updateUserStatus(username: string, payload: UpdateUserStatusRequest): Promise<void> {
    await apiClient.patch(`/auth/users/${username}/activate`, payload);
  },

  logout() {
    tokenStorage.clearAll();
  },
};
