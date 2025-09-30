import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useCertificates } from "../hooks/useCertificates";
import type { CertificateVerifyPayload } from "../types/api";

type VerifyFormValues = CertificateVerifyPayload;

export function VerifyCertificatePage() {
  const { verifyCertificate, verifyStatus, verifyResponse } = useCertificates();
  const [lastHash, setLastHash] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    defaultValues: { hash: "" },
  });

  const onSubmit = async ({ hash }: VerifyFormValues) => {
    const trimmedHash = hash.trim();
    setVerificationError(null);
    setLastHash(trimmedHash || null);

    if (!trimmedHash) {
      setVerificationError("Please enter a certificate hash.");
      return;
    }

    try {
      await verifyCertificate({ hash: trimmedHash });
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message ?? "Failed to verify certificate")
          : "Failed to verify certificate";
      setVerificationError(message);
    }
  };

  const handleReset = () => {
    reset({ hash: "" });
    setLastHash(null);
    setVerificationError(null);
  };

  const isLoading = isSubmitting || verifyStatus === "pending";
  const showResult = verifyStatus === "success" && verifyResponse && lastHash && !verificationError;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Verify certificate</h1>
        <p className="mt-2 text-sm text-slate-500">
          Paste the certificate hash exactly as it appears on the credential. We validate it against the blockchain record.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Certificate hash</CardTitle>
          <CardDescription>Only the hash is required for verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Certificate hash"
              placeholder="0x..."
              autoComplete="off"
              {...register("hash", { required: "Certificate hash is required" })}
              error={errors.hash?.message}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="w-full sm:w-auto" loading={isLoading}>
                Verify certificate
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleReset}
                disabled={isLoading}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner className="h-4 w-4 text-primary-600" />
          <span>Checking certificate authenticity…</span>
        </div>
      ) : null}

      {verificationError ? <Alert variant="danger">{verificationError}</Alert> : null}

      {showResult ? (
        <Alert variant={verifyResponse.status === "valid" ? "success" : "warning"}>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-slate-800">
              {verifyResponse.status === "valid" ? "Certificate is valid" : "Certificate could not be verified"}
            </span>
            <span className="text-xs text-slate-500">
              Queried hash: <span className="font-mono break-all">{lastHash}</span>
            </span>
            <span className="text-xs text-slate-500">Checked by: {verifyResponse.verified_by}</span>
            <span className="text-sm text-slate-600">{verifyResponse.message}</span>
          </div>
        </Alert>
      ) : null}
    </div>
  );
}
