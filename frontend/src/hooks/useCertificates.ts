import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { certificateService } from "../services/certificateService";
import type {
  CertificateIssuePayload,
  CertificateIssueResponse,
  CertificateVerifyPayload,
  CertificateVerifyResponse,
} from "../types/api";

export function useCertificates() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["certificates"],
    queryFn: () => certificateService.listCertificates(),
  });

  const issueMutation = useMutation({
    mutationKey: ["issue-certificate"],
    mutationFn: (payload: CertificateIssuePayload) => certificateService.issueCertificate(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });

  const verifyMutation = useMutation({
    mutationKey: ["verify-certificate"],
    mutationFn: (payload: CertificateVerifyPayload) => certificateService.verifyCertificate(payload),
  });

  return {
    listQuery,
    issueCertificate: issueMutation.mutateAsync,
    issueStatus: issueMutation.status,
    issueResponse: issueMutation.data as CertificateIssueResponse | undefined,
    verifyCertificate: verifyMutation.mutateAsync,
    verifyStatus: verifyMutation.status,
    verifyResponse: verifyMutation.data as CertificateVerifyResponse | undefined,
  };
}
