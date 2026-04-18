import { User } from "../../../core/models/user";

// ─── Coach Model ─────────────────────────────────────────
export interface Coach {
  id:                   number | string;
  fullNameEn:           string;
  fullNameAr:           string;
  status:               string; // e.g. "APPROVED"
  enabled:              boolean;
  disabled:             boolean;
  halfHourPrice:        number | null;
  hourlyPrice:          number | null;
  twoHoursPrice:        number | null;
  OneAndHalfHourPrice:  number | null;
  coachingIndustries:   CoachingIndustry[];
  bookingCount:         number;
}

// ─── Coaching Industry ────────────────────────────────────
export interface CoachingIndustry {
  id:     number;
  nameEn: string;
  nameAr: string;
}


// ─── Paginated API Response ───────────────────────────────
export interface CoachesResponse {
  httpStatus:  string;
  code:        string;
  messageEn:   string;
  messageAr:   string;
  data:        Coach[];
  count:       number;  
  pageCount:   number;  
  pageIndex:   number;  
  pageSize:    number;
  timeStamp:   string;
}

export interface CoachDetailResponse {
  httpStatus: string;
  code:       string;
  messageEn:  string;
  messageAr:  string;
  data:       CoachDetail;
  timeStamp:  string;
}


// ─── Query Params ─────────────────────────────────────────
export interface CoachesQuery {
  pageIndex:     number;
  pageSize: number;
  name?:  string;
  sortBy?:  string;
  sortDir?: 'ASC' | 'DESC'; 
}

export interface Country {
  id:number;
  code:        string;   // ISO 3166-1 alpha-2 e.g. 'EG'
  name:        string;   // 'Egypt'
  dialCode:    string;   // '+20'
  flag:        string;   // '🇪🇬'
  phoneLength: number[]; // [10] — valid local digit counts
  
}
export interface Nationality {
  id:number | string;
  code:        string;   // ISO 3166-1 alpha-2 e.g. 'EG'
  nameEn:        string;   // 'Egypt'
  nameAr:    string;  
}



export interface WhatsAppContact {
  countryCode: string;   // '+20'
  localNumber: string;   // '1012345678'
  e164:        string;   // '+201012345678'
}

export interface CoachingIndustry {
  id:     number;
  nameEn: string;
  nameAr: string;
}

export interface CoachDetail {
  id: number;

  // ─── Basic Info ─────────────────────────
  fullNameEn: string;
  fullNameAr: string;
  email: string;
  username: string;

  gender: 'MALE' | 'FEMALE'; // matches API
  birthDate: string; // ISO date string e.g. "1990-01-01"

  jobTitle: string;
  yearsOfExperience: number | null;
  availableEveryWeek: boolean;

  // ─── Status ─────────────────────────────
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'DEACTIVATED';
  enabled: boolean;


  // ─── Contact ────────────────────────────
  whatsAppNumber: string | null;

country: Country ; // cca2 (e.g. "EG")
nationality:Nationality;

  // ─── Pricing ────────────────────────────
  halfHourPrice: number;
  hourlyPrice: number;
  oneAndHalfHourPrice: number;
  twoHoursPrice: number;

  // ─── Media ──────────────────────────────
  profileImageUrl: string | null;
  profileImageId:string | null;

  // ─── Stats ──────────────────────────────
  bookingCount: number;

  // ─── Relations ──────────────────────────
  coachingIndustries: any[];
  languages: any[];
  certificates: any[];

  // ─── Audit ──────────────────────────────
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;

  // ─── Nested User ────────────────────────
  user: User;
}
