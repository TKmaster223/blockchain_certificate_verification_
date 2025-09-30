import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useCertificates } from "../hooks/useCertificates";
import { useAuth } from "../hooks/useAuth";
import { normaliseCertificateIssuePayload } from "../lib/certificates";
import type { CertificateIssuePayload } from "../types/api";

export function IssueCertificatePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { issueCertificate, issueStatus, issueResponse } = useCertificates();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificateIssuePayload>({
    defaultValues: {
      student_name: "",
      student_email: "",
      institution: "",
      degree: "",
      graduation_year: new Date().getFullYear(),
      cgpa: undefined,
      reg_number: "",
      honours: "",
      state_of_origin: "",
    },
  });

  const canIssue = user?.role === "admin" || user?.role === "issuer";

  useEffect(() => {
    if (!loading && !canIssue) {
      toast.error("You don't have permission to issue certificates");
      navigate("/certificates", { replace: true });
    }
  }, [canIssue, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!canIssue) {
    return null;
  }

  const onSubmit = async (values: CertificateIssuePayload) => {
    try {
  const payload = normaliseCertificateIssuePayload(values);

      await issueCertificate(payload);
      toast.success("Certificate issued successfully");
      reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to issue certificate";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Issue certificate</h1>
        <p className="mt-2 text-sm text-slate-500">Fill in the graduate details and confirm to mint a verifiable credential.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Graduate information</CardTitle>
          <CardDescription>Required fields for blockchain-backed issuance.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Student name"
                placeholder="Jane Doe"
                {...register("student_name", { required: "Student name is required" })}
                error={errors.student_name?.message}
              />

              <Input
                label="Student email"
                type="email"
                placeholder="jane.doe@example.edu"
                helperText="Optional. Used for contact and audit metadata."
                {...register("student_email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={errors.student_email?.message}
              />

              <Input
                label="Institution"
                placeholder="University of Blockchain"
                {...register("institution", { required: "Institution is required" })}
                error={errors.institution?.message}
              />

              <Input
                label="Degree"
                placeholder="BSc Computer Science"
                {...register("degree", { required: "Degree is required" })}
                error={errors.degree?.message}
              />

              <Input
                label="Graduation year"
                type="number"
                min={1950}
                max={new Date().getFullYear() + 1}
                {...register("graduation_year", {
                  required: "Graduation year is required",
                  valueAsNumber: true,
                  min: { value: 1950, message: "Year must be later than 1950" },
                  max: { value: new Date().getFullYear() + 1, message: "Year must be in the near future" },
                })}
                error={errors.graduation_year?.message}
              />

              <Input
                label="CGPA"
                type="number"
                step="0.01"
                min={0}
                max={5}
                helperText="Optional. Use the standard 5.0 scale."
                {...register("cgpa", {
                  valueAsNumber: true,
                  min: { value: 0, message: "CGPA cannot be negative" },
                  max: { value: 5, message: "CGPA must be on a 5.0 scale" },
                })}
                error={errors.cgpa?.message}
              />

              <Input
                label="Registration number"
                placeholder="ENG/2018/042"
                helperText="Optional identifier supplied by the institution."
                {...register("reg_number")}
                error={errors.reg_number?.message}
              />

              <Input
                label="Honours"
                placeholder="First Class"
                helperText="Optional honours or distinctions."
                {...register("honours")}
                error={errors.honours?.message}
              />

              <Input
                label="State of origin"
                placeholder="Kaduna"
                helperText="Optional. Helps contextualize local records."
                {...register("state_of_origin")}
                error={errors.state_of_origin?.message}
              />
            </div>

            <Button type="submit" loading={isSubmitting || issueStatus === "pending"} className="w-full md:w-auto">
              Issue certificate
            </Button>
          </form>
        </CardContent>
      </Card>

      {issueStatus === "pending" ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner className="h-4 w-4 text-primary-600" />
          <span>Minting certificate on chain. This might take a few seconds…</span>
        </div>
      ) : null}

      {issueStatus === "error" ? <Alert variant="danger">Something went wrong. Please try again.</Alert> : null}

      {issueStatus === "success" && issueResponse ? (
        <Alert variant="success">
          Certificate <strong>{issueResponse.certificate.student_name}</strong> issued. Hash:
          <span className="ml-1 font-mono text-xs">{issueResponse.certificate.certificate_hash ?? issueResponse.certificate.hash}</span>
        </Alert>
      ) : null}
    </div>
  );
}
