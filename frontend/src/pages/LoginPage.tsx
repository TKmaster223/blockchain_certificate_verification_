import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import type { LoginRequest } from "../types/api";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: LoginRequest) => {
    try {
      setErrorMessage(null);
      console.log(values);
      await login(values);
      toast.success("Logged in successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-slate-50 to-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-card backdrop-blur">
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Certificate Verification</p>
          <h1 className="text-2xl font-bold text-slate-900">Access your dashboard</h1>
          <p className="text-sm text-slate-500">Sign in with your credentials to manage certificates.</p>
        </div>

        {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            placeholder="Enter your username"
            autoComplete="username"
            {...register("username", { required: "Username is required" })}
            error={errors.username?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Default credentials</p>
          <ul className="mt-1 space-y-1">
            <li>Admin: <code className="font-mono text-slate-700">admin / admin123456</code></li>
            <li>Issuer: <code className="font-mono text-slate-700">university_issuer / issuer123456</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
