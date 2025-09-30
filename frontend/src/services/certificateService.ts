import { apiClient } from "./apiClient";
import type {
  CertificateIssuePayload,
  CertificateIssueResponse,
  CertificateListResponse,
  CertificateVerifyPayload,
  CertificateVerifyResponse,
} from "../types/api";

export const certificateService = {
  async issueCertificate(payload: CertificateIssuePayload): Promise<CertificateIssueResponse> {
    const response = await apiClient.post<CertificateIssueResponse>("/issue", payload);
    return response.data;
  },

  async verifyCertificate(payload: CertificateVerifyPayload): Promise<CertificateVerifyResponse> {
    const response = await apiClient.post<CertificateVerifyResponse>("/verify", payload);
    return response.data;
  },

  async listCertificates(): Promise<CertificateListResponse> {
    const response = await apiClient.get<CertificateListResponse>("/certificates");
    return response.data;
  },
};
