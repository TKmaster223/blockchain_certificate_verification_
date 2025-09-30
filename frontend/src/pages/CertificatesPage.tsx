import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useCertificates } from "../hooks/useCertificates";
import { useAuth } from "../hooks/useAuth";

export function CertificatesPage() {
  const { user } = useAuth();
  const { listQuery } = useCertificates();

  const certificates = useMemo(() => listQuery.data?.certificates ?? [], [listQuery.data]);

  const groupedByInstitution = useMemo(() => {
    return certificates.reduce<Record<string, number>>((acc, cert) => {
      if (!cert.institution) return acc;
      acc[cert.institution] = (acc[cert.institution] ?? 0) + 1;
      return acc;
    }, {});
  }, [certificates]);

  const canIssue = user?.role === "admin" || user?.role === "issuer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Certificates</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Browse issued certificates, grouped by institution. Use the quick actions to issue or verify new records.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/certificates/verify"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Verify certificate
          </Link>
          {canIssue ? (
            <Link
              to="/certificates/issue"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Issue certificate
            </Link>
          ) : null}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {Object.entries(groupedByInstitution).map(([institution, count]) => (
          <Card key={institution}>
            <CardHeader>
              <CardDescription>Institution</CardDescription>
              <CardTitle className="text-xl">{institution}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-slate-500">
              <span>{count} certificates</span>
              <Badge variant="outline">{certificates.length ? Math.round((count / certificates.length) * 100) : 0}%</Badge>
            </CardContent>
          </Card>
        ))}
        {certificates.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No certificates yet</CardTitle>
              <CardDescription>Issue your first certificate to see it listed here.</CardDescription>
            </CardHeader>
            <CardContent>
              {canIssue ? (
                <Link
                  to="/certificates/issue"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Issue certificate
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">All certificates</h2>
          <span className="text-sm text-slate-500">{certificates.length} records</span>
        </div>

        {listQuery.isLoading ? <Spinner /> : null}
        {listQuery.isError ? <Alert variant="danger">Unable to load certificates</Alert> : null}

        {!listQuery.isLoading && !listQuery.isError ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr className="text-left">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Degree</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Issued by</th>
                  <th className="px-4 py-3">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      No certificates available yet.
                    </td>
                  </tr>
                ) : (
                  certificates.map((certificate) => (
                    <tr key={certificate.certificate_hash ?? certificate.hash ?? certificate._id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{certificate.student_name}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.institution}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.degree}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.graduation_year}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.issued_by ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-primary-600">
                        {certificate.certificate_hash ?? certificate.hash ?? ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
