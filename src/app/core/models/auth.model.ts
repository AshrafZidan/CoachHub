// ─── User Object (from JWT token) ────────────────────────
export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
  [key: string]: any; // Allow additional fields from token
}

// ─── Role Enum ───────────────────────────────────────────
export enum RoleName {
  ADMIN = 'ADMIN',
  USER  = 'USER',
  COACH = 'COACH'
}

// ─── Login Request Payload ───────────────────────────────
export interface LoginRequest {
  email:    string;
  password: string;
  roleName: RoleName;
}

// ─── Refresh Token Object ────────────────────────────────
export interface RefreshToken {
  id:          number;
  token:       string;
  expiryDate:  string;
}

// ─── Login Response Data ─────────────────────────────────
export interface LoginData {
  accessToken:  string;
  refreshToken: RefreshToken;
}

// ─── API Wrapper Response ────────────────────────────────
export interface ApiResponse<T> {
  httpStatus: string;
  code:       string;
  timeStamp:  string;
  messageEn:  string;
  messageAr:  string;
  data:       T;
  count:      number;
}

// ─── API Error Response ──────────────────────────────────
export interface ApiError {
  httpStatus: string;
  code:       string;
  timeStamp:  string;
  messageEn:  string;
  messageAr:  string;
  data:       null;
}