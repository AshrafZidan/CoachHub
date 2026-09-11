export interface CNotification {
  id: string | number;

  coachId?: number;
  coacheeId?: number;

  titleEn: string;
  titleAr: string;

  bodyEn: string;
  bodyAr: string;

  read: boolean;
  createdDate: Date;

  type?: string;
  route?: string;
  relatedId?: number;
}
export interface NotificationsResponse {
  httpStatus?: string;
  code?: string;
  timeStamp?: string;
  messageEn?: string;
  messageAr?: string;

  data?:  CNotification[];

  count?: number;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;

  errors?: {
    messageEn?: string;
    messageAr?: string;
  }[];
}