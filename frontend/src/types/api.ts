export type UserRole = "admin" | "issuer" | "user";

export interface User {
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserStatusRequest {
  is_active: boolean;
}

export interface CertificateIssuePayload {
  student_name: string;
  student_email?: string;
  institution: string;
  degree: string;
  graduation_year: number;
  cgpa?: number;
  reg_number?: string;
  honours?: string;
  state_of_origin?: string;
}

export interface CertificateRecord extends CertificateIssuePayload {
  _id?: string;
  hash: string;
  certificate_hash?: string;
  issued_by?: string;
  issuer_email?: string;
  created_at?: string;
}

export interface CertificateVerifyPayload {
  hash: string;
}

export interface CertificateIssueResponse {
  message: string;
  certificate: CertificateRecord;
  issued_by: string;
}

export interface CertificateVerifyResponse {
  message: string;
  verified_by: string;
  status: "valid" | "invalid";
}

export interface CertificateListResponse {
  certificates: CertificateRecord[];
  count: number;
  accessed_by: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
