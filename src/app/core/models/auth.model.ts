/**
 * Authentication Models
 * Update your existing auth.model.ts with these types
 */

// ─── LOGIN REQUEST ────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
  roleName?: string; // Optional, e.g., "ADMIN"
}

// ─── LOGIN RESPONSE ───────────────────────────────────
export interface LoginData {
  accessToken: string;
  refreshToken: {
    id: string;
    token: string;
    expiryDate: string;
  };
  permissions?: string[]; // ✅ Array of permission strings from backend
  // Add other fields your backend returns
}

// ─── API RESPONSE ──────────────────────────────────────
export interface ApiResponse<T> {
  httpStatus: number;
  code: string;
  messageEn: string;
  messageAr: string;
  data: T;
  count?: number;
}

// ─── API ERROR ────────────────────────────────────────
export interface ApiError {
  httpStatus?: number;
  code?: string;
  messageEn?: string;
  messageAr?: string;
  data?: any;
}

// ─── USER ─────────────────────────────────────────────
export interface User {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[]; // e.g., ['ROLE_ADMIN']
}

// ─── OPTIONAL: Extended User with Permissions ─────────
export interface UserWithPermissions extends User {
  permissions: string[];
}
// ─── Role Enum ───────────────────────────────────────────
export enum RoleName {
  ADMIN = 'ADMIN',
  USER  = 'USER',
  COACH = 'COACH'
}