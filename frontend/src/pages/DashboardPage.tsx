import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { useCertificates } from "../hooks/useCertificates";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { listQuery } = useCertificates();
  const { user } = useAuth();

  const { totalCertificates, uniqueInstitutions, recentCertificates } = useMemo(() => {
    const certificates = listQuery.data?.certificates ?? [];
    const unique = new Set(certificates.map((cert) => cert.institution)).size;
    return {
      totalCertificates: listQuery.data?.count ?? certificates.length,
      uniqueInstitutions: unique,
      recentCertificates: certificates.slice(0, 5),
    };
  }, [listQuery.data]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-slate-500">Welcome back, {user?.username ?? "user"}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard overview</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Monitor certificate issuance activity, quickly verify records, and keep track of institutions using the platform.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total certificates</CardDescription>
            <CardTitle className="text-3xl">{totalCertificates}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            Issued certificates stored on-chain across all institutions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active institutions</CardDescription>
            <CardTitle className="text-3xl">{uniqueInstitutions}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            Partner universities and issuers contributing verified credentials.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Accessed by</CardDescription>
            <CardTitle className="text-lg">{listQuery.data?.accessed_by ?? "N/A"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            API account currently authenticated.
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent certificates</h2>
          <Badge variant="outline">Latest 5</Badge>
        </div>

        {listQuery.isLoading ? <Spinner /> : null}

        {listQuery.isError ? <Alert variant="danger">Unable to load certificates.</Alert> : null}

        {!listQuery.isLoading && !listQuery.isError ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Degree</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm">
                {recentCertificates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      No certificates found. Issue one to get started.
                    </td>
                  </tr>
                ) : (
                  recentCertificates.map((certificate) => (
                    <tr key={certificate.certificate_hash ?? certificate.hash ?? certificate._id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{certificate.student_name}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.institution}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.degree}</td>
                      <td className="px-4 py-3 text-slate-600">{certificate.graduation_year}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {(certificate.certificate_hash ?? certificate.hash ?? "").slice(0, 12)}...
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
