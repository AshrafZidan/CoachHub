import { Coach } from "../coaches-management/Coaches.model";

// ─── Coach Model ─────────────────────────────────────────
export interface Admin {

  id: number;
      fullName: string;
      email: string;
      enabled:boolean;
      permissions: [
        {
          code: string;
          nameEn: string;
          nameAr: string;
        }
      ]
}
export interface AdminsQuery {
  pageIndex:     number;
  pageSize: number;
  search?:  string;
  sortBy?:  string;
  sortDir?: 'ASC' | 'DESC'; 
}

export interface AdminsResponse {
  httpStatus:  string;
  code:        string;
  messageEn:   string;
  messageAr:   string;
  data:        Admin[];
  count:       number;  
  pageCount:   number;  
  pageIndex:   number;  
  pageSize:    number;
  timeStamp:   string;
}

export interface AdminPostData {
  fullName:string;
  email:               string;
  permissions: AdminsPermissions[];
}
export interface AdminsPermissions {
  code: string;
  nameEn: string;
  nameAr: string;
}