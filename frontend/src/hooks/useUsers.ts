import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { UpdateUserRoleRequest, UpdateUserStatusRequest, User } from "../types/api";

export function useUsers(enabled = true) {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => authService.listUsers(),
    enabled,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ username, payload }: { username: string; payload: UpdateUserRoleRequest }) =>
      authService.updateUserRole(username, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ username, payload }: { username: string; payload: UpdateUserStatusRequest }) =>
      authService.updateUserStatus(username, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    usersQuery,
    updateRole: updateRoleMutation.mutateAsync,
    updateRoleStatus: updateRoleMutation.status,
    updateStatus: updateStatusMutation.mutateAsync,
    updateStatusState: updateStatusMutation.status,
  };
}
