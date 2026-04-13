import { Coach } from "../coaches-management/Coaches.model";

// ─── Coach Model ─────────────────────────────────────────
export interface Coupon {
  id:                   number | string;
  title:                string;
  timeOfUse:             number;
  unlimitedUsage:               boolean; 
  allCoaches:              boolean;
  code:             string;
  discountPercentage:        number;
  expiryDate:          string | Date;
  usageCount:        number ;
  softDelete:  boolean ;
  coaches: Coach[];
  
}
export interface CouponQuery {
  pageIndex:     number;
  pageSize: number;
  name?:  string;
  sortBy?:  string;
  sortDir?: 'ASC' | 'DESC'; 
}

export interface CouponsResponse {
  httpStatus:  string;
  code:        string;
  messageEn:   string;
  messageAr:   string;
  data:        Coupon[];
  count:       number;  
  pageCount:   number;  
  pageIndex:   number;  
  pageSize:    number;
  timeStamp:   string;
}

export interface CouponPostData {
  title?:string;
  code:               string;
  discountPercentage: number;
  expiryDate:         string | Date;
  unlimitedUsage:     boolean;
  timesOfUse:         number;
  allCoaches:         boolean;
  coachIds: 
          number[];
    // fullNameEn: string;
    // fullNameAr: string;
     
}
 