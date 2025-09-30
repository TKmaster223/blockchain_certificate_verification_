import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import type { UserRole } from "../types/api";

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: "Administrator", value: "admin" },
  { label: "Issuer", value: "issuer" },
  { label: "Verifier", value: "user" },
];

export function UserManagementPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const { usersQuery, updateRole, updateStatus } = useUsers(isAdmin);

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Only administrators can manage users");
      navigate("/dashboard", { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  const sortedUsers = useMemo(() => {
    return [...(usersQuery.data ?? [])].sort((a, b) => a.username.localeCompare(b.username));
  }, [usersQuery.data]);

  const handleRoleChange = async (username: string, nextRole: UserRole) => {
    if (username === user?.username) {
      toast("You can't change your own role", { icon: "🤔" });
      return;
    }

    try {
      await toast.promise(
        updateRole({ username, payload: { role: nextRole } }),
        {
          loading: "Updating role…",
          success: "Role updated",
          error: "Unable to update role",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusToggle = async (username: string, isActive: boolean) => {
    if (username === user?.username) {
      toast("You can't deactivate yourself", { icon: "😅" });
      return;
    }

    try {
      await toast.promise(
        updateStatus({ username, payload: { is_active: !isActive } }),
        {
          loading: "Updating status…",
          success: "Status updated",
          error: "Unable to update status",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">User management</h1>
        <p className="mt-2 text-sm text-slate-500">
          Control platform access, elevate issuers, and deactivate compromised accounts.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Team roster</CardTitle>
          <CardDescription>All platform users fetched from the FastAPI backend.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {usersQuery.isLoading ? <Spinner /> : null}
          {usersQuery.isError ? <Alert variant="danger">Unable to load users</Alert> : null}

          {!usersQuery.isLoading && !usersQuery.isError ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr className="text-left">
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map((entry) => (
                      <tr key={entry.username}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{entry.username}</td>
                        <td className="px-4 py-3 text-slate-600">{entry.email}</td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.role}
                            onChange={(event) => handleRoleChange(entry.username, event.target.value as UserRole)}
                            aria-label={`Role for ${entry.username}`}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          >
                            {roleOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={entry.is_active ? "success" : "warning"}>{entry.is_active ? "Active" : "Suspended"}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(entry.username, entry.is_active)}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            {entry.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
