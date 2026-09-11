import { Injectable, OnDestroy, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";

import { CNotification } from "./notification.model";
import { environment } from "../../../environments/environment";

export type NotificationRole = "COACH" | "COACHEE";

interface NotificationPageResponse {
  items: CNotification[];
  totalCount?: number;
  totalPages?: number;
  pageIndex?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService implements OnDestroy {
  private readonly http = inject(HttpClient);

  private readonly destroy$ = new Subject<void>();

  private readonly apiUrl = environment.apiUrl;

  /**
   * Number of notifications requested per API call.
   *
   * Increase this if you want fewer API requests while scrolling.
   */
  private readonly pageSize = 20;

  private pageIndex = 0;
  private hasMoreNotifications = true;
  private loadingMore = false;

  private currentRole: NotificationRole | null = null;
  private currentUserId: number | null = null;

  /**
   * All notifications currently loaded in the UI.
   */
  private readonly notificationsSubject = new BehaviorSubject<CNotification[]>(
    []
  );

  readonly notifications$: Observable<CNotification[]> =
    this.notificationsSubject.asObservable();

  /**
   * Emits whenever a new notification arrives through FCM.
   *
   * SharedLayout can use this for toast/realtime handling.
   */
  private readonly newNotificationSubject = new Subject<CNotification>();

  readonly newNotification$: Observable<CNotification> =
    this.newNotificationSubject.asObservable();

  /**
   * True while notifications are being loaded/refreshed.
   */
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Number of unread notifications currently loaded.
   */
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);

  readonly unreadCount$: Observable<number> =
    this.unreadCountSubject.asObservable();

  /**
   * Initialize notification service for the logged-in user.
   */
  initialize(userId: number, role: NotificationRole): void {
    if (!Number.isFinite(userId) || userId <= 0) {
      console.warn("Invalid notification user ID:", userId);
      return;
    }

    const sameUser = this.currentUserId === userId && this.currentRole === role;

    this.currentUserId = userId;
    this.currentRole = role;

    /**
     * Avoid reloading notifications every time
     * SharedLayout initializes again.
     */
    if (sameUser && this.notificationsSubject.value.length > 0) {
      return;
    }

    this.resetPagination();

    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);

    this.loadNotifications(true);
  }

  /**
   * Load notifications from backend.
   *
   * reset = true:
   * - clears pagination
   * - loads page 0
   *
   * reset = false:
   * - loads the next page
   */
  loadNotifications(reset = false): void {
    if (!this.currentRole) {
      return;
    }

    /**
     * Prevent duplicate requests.
     */
    if (this.loadingMore) {
      return;
    }

    /**
     * Don't request another page after the backend
     * tells us there are no more notifications.
     */
    if (!reset && !this.hasMoreNotifications) {
      return;
    }

    if (reset) {
      this.pageIndex = 0;
      this.hasMoreNotifications = true;
    }

    this.loadingMore = true;
    this.loadingSubject.next(true);

    const endpoint = this.getNotificationsEndpoint();

    const params = new HttpParams()
      .set("pageIndex", this.pageIndex)
      .set("pageSize", this.pageSize);

    this.http
      .get<unknown>(endpoint, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const page = this.mapNotificationPage(response);

          if (reset) {
            this.notificationsSubject.next(page.items);
          } else {
            this.appendNotifications(page.items);
          }

          this.updatePaginationState(page);

          this.updateUnreadCount(this.notificationsSubject.value);

          this.loadingMore = false;
          this.loadingSubject.next(false);
        },

        error: (error: unknown) => {
          console.error("Failed to load notifications:", error);

          this.loadingMore = false;
          this.loadingSubject.next(false);
        },
      });
  }

  /**
   * Load next page.
   *
   * This is what the notification list infinite-scroll
   * handler should call.
   */
  loadNextPage(): void {
    if (this.loadingMore || !this.hasMoreNotifications) {
      return;
    }

    this.loadNotifications(false);
  }

  /**
   * Refresh notification list from page 0.
   */
  refreshNotifications(): void {
    if (!this.currentRole) {
      return;
    }

    this.loadNotifications(true);
  }

  /**
   * Get role-specific notification endpoint.
   */
  private getNotificationsEndpoint(): string {
    if (this.currentRole === "COACHEE") {
      return `${this.apiUrl}/mobile/api/notifications/coachee`;
    }

    return `${this.apiUrl}/mobile/api/notifications/coach`;
  }

  /**
   * Normalize different possible backend pagination formats.
   *
   * Supported examples:
   *
   * [
   *   {...},
   *   {...}
   * ]
   *
   * {
   *   content: [...]
   * }
   *
   * {
   *   items: [...]
   * }
   *
   * {
   *   data: [...]
   * }
   *
   * {
   *   data: {
   *     content: [...]
   *   }
   * }
   */
  private mapNotificationPage(response: unknown): NotificationPageResponse {
    if (Array.isArray(response)) {
      return {
        items: this.mapNotifications(response),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
    }

    if (!response || typeof response !== "object") {
      return {
        items: [],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
    }

    const objectResponse = response as Record<string, unknown>;

    /**
     * Handle:
     *
     * {
     *   data: {
     *     content: [...]
     *   }
     * }
     */
    const nestedData = objectResponse["data"];

    const dataObject =
      nestedData && typeof nestedData === "object" && !Array.isArray(nestedData)
        ? (nestedData as Record<string, unknown>)
        : null;

    const rawItems =
      objectResponse["content"] ??
      objectResponse["items"] ??
      (Array.isArray(nestedData) ? nestedData : undefined) ??
      dataObject?.["content"] ??
      dataObject?.["items"] ??
      [];

    const items = Array.isArray(rawItems)
      ? this.mapNotifications(rawItems)
      : [];

    const totalCount =
      this.toNumber(objectResponse["totalCount"]) ??
      this.toNumber(dataObject?.["totalCount"]);

    const totalElements =
      this.toNumber(objectResponse["totalElements"]) ??
      this.toNumber(dataObject?.["totalElements"]);

    const totalPages =
      this.toNumber(objectResponse["totalPages"]) ??
      this.toNumber(dataObject?.["totalPages"]);

    const responsePageIndex =
      this.toNumber(objectResponse["pageIndex"]) ??
      this.toNumber(dataObject?.["pageIndex"]);

    const responsePageSize =
      this.toNumber(objectResponse["pageSize"]) ??
      this.toNumber(dataObject?.["pageSize"]);

    return {
      items,

      totalCount: totalCount ?? totalElements,

      totalPages,

      pageIndex: responsePageIndex ?? this.pageIndex,

      pageSize: responsePageSize ?? this.pageSize,
    };
  }

  /**
   * Map backend notification DTOs to frontend model.
   */
  private mapNotifications(data: unknown[]): CNotification[] {
    return data
      .filter(
        (item): item is Record<string, unknown> =>
          !!item && typeof item === "object" && !Array.isArray(item)
      )
      .map((notification) => ({
        id: String(notification["id"] ?? ""),

        coachId:
          notification["coachId"] != null
            ? Number(notification["coachId"])
            : undefined,

        coacheeId:
          notification["coacheeId"] != null
            ? Number(notification["coacheeId"])
            : undefined,

        titleEn: String(notification["titleEn"] ?? ""),

        titleAr: String(notification["titleAr"] ?? ""),

        bodyEn: String(notification["bodyEn"] ?? ""),

        bodyAr: String(notification["bodyAr"] ?? ""),

        read: Boolean(notification["read"] ?? false),

        createdDate: this.parseDate(notification["createdDate"]),

        type:
          notification["type"] != null
            ? String(notification["type"])
            : undefined,

        route:
          notification["route"] != null
            ? String(notification["route"])
            : undefined,

        relatedId:
          notification["relatedId"] != null
            ? Number(notification["relatedId"])
            : undefined,
      }));
  }

  /**
   * Append next page without duplicating notifications.
   */
  private appendNotifications(notifications: CNotification[]): void {
    if (notifications.length === 0) {
      return;
    }

    const current = this.notificationsSubject.value;

    const existingIds = new Set(
      current.map((notification) => String(notification.id))
    );

    const newNotifications = notifications.filter(
      (notification) => !existingIds.has(String(notification.id))
    );

    if (newNotifications.length === 0) {
      return;
    }

    this.notificationsSubject.next([...current, ...newNotifications]);
  }

  /**
   * Determine whether another page exists.
   */
  private updatePaginationState(page: NotificationPageResponse): void {
    if (page.totalPages != null) {
      this.hasMoreNotifications = this.pageIndex + 1 < page.totalPages;
    } else {
      /**
       * If backend does not provide totalPages,
       * assume another page exists only when the
       * current page was completely filled.
       */
      this.hasMoreNotifications = page.items.length >= this.pageSize;
    }

    /**
     * Move to the next page only after a successful
     * request.
     */
    this.pageIndex++;
  }

  /**
   * Convert backend date value to Date.
   */
  private parseDate(value: unknown): Date {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return new Date();
  }

  /**
   * Safely convert a value to number.
   */
  private toNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return undefined;
  }

  /**
   * Register the actual Firebase FCM token
   * with the backend.
   *
   * IMPORTANT:
   * This must receive the Firebase getToken()
   * value, NOT the JWT access token.
   */
  registerFcmToken(token: string): Observable<unknown> {
    if (!token) {
      throw new Error("FCM token is required");
    }

    if (!this.currentRole) {
      throw new Error("Notification role is not initialized");
    }

    const endpoint =
      this.currentRole === "COACH"
        ? `${this.apiUrl}/mobile/api/notifications/coach/fcm-token`
        : `${this.apiUrl}/mobile/api/notifications/coachee/fcm-token`;

    return this.http.put(endpoint, { token });
  }

  /**
   * Handle an FCM notification received
   * while the application is open.
   */
  handleRealtimeNotification(payload: unknown): void {
    const notification = this.mapFcmNotification(payload);

    if (!notification) {
      return;
    }

    /**
     * Immediately notify the UI so it can show
     * a toast / realtime notification.
     */
    this.newNotificationSubject.next(notification);

    /**
     * Backend remains the source of truth.
     *
     * Reload page 0 so the persisted notification
     * is eventually reflected in the notification list.
     */
    this.refreshNotifications();
  }

  /**
   * Convert Firebase payload to CNotification.
   */
  private mapFcmNotification(payload: unknown): CNotification | null {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const raw = payload as Record<string, unknown>;

    const rawData = raw["data"];

    const data =
      rawData && typeof rawData === "object"
        ? (rawData as Record<string, unknown>)
        : raw;

    const title = data["titleEn"] ?? data["title"];

    const body = data["bodyEn"] ?? data["body"];

    if (title == null && body == null) {
      return null;
    }

    return {
      id: String(data["notificationId"] ?? data["id"] ?? `fcm-${Date.now()}`),

      coachId: data["coachId"] != null ? Number(data["coachId"]) : undefined,

      coacheeId:
        data["coacheeId"] != null ? Number(data["coacheeId"]) : undefined,

      titleEn: String(title ?? ""),

      titleAr: String(data["titleAr"] ?? ""),

      bodyEn: String(body ?? ""),

      bodyAr: String(data["bodyAr"] ?? ""),

      read: false,

      createdDate: new Date(),

      type: data["type"] != null ? String(data["type"]) : undefined,

      route: data["route"] != null ? String(data["route"]) : undefined,

      relatedId:
        data["relatedId"] != null ? Number(data["relatedId"]) : undefined,
    };
  }

  /**
   * Mark one notification as read.
   */
  markAsRead(notificationId: string | number): Observable<unknown> {
    const endpoint = `${this.apiUrl}/mobile/api/notifications/read/${notificationId}`;

    return this.http.put(endpoint, {}).pipe(takeUntil(this.destroy$));
  }

  /**
   * Mark all notifications as read
   * for the current role.
   */
  markAllAsRead(): Observable<unknown> {
    if (!this.currentRole) {
      throw new Error("Notification role is not initialized");
    }

    const endpoint =
      this.currentRole === "COACH"
        ? `${this.apiUrl}/mobile/api/notifications/coach/read-all`
        : `${this.apiUrl}/mobile/api/notifications/coachee/read-all`;

    return this.http.put(endpoint, {}).pipe(takeUntil(this.destroy$));
  }

  /**
   * Update one notification locally
   * after successful API response.
   */
  updateLocalNotificationAsRead(notificationId: string | number): void {
    const id = String(notificationId);

    const notifications = this.notificationsSubject.value.map((notification) =>
      String(notification.id) === id
        ? {
            ...notification,
            read: true,
          }
        : notification
    );

    this.notificationsSubject.next(notifications);

    this.updateUnreadCount(notifications);
  }

  /**
   * Mark all currently loaded notifications
   * as read locally.
   */
  updateLocalNotificationsAsRead(): void {
    const notifications = this.notificationsSubject.value.map(
      (notification) => ({
        ...notification,
        read: true,
      })
    );

    this.notificationsSubject.next(notifications);

    this.unreadCountSubject.next(0);
  }

  /**
   * Recalculate unread count from loaded notifications.
   */
  private updateUnreadCount(notifications: CNotification[]): void {
    const count = notifications.filter(
      (notification) => !notification.read
    ).length;

    this.unreadCountSubject.next(count);
  }

  /**
   * Whether another page can be loaded.
   */
  hasMore(): boolean {
    return this.hasMoreNotifications;
  }

  /**
   * Whether an API request is currently running.
   */
  isLoadingMore(): boolean {
    return this.loadingMore;
  }

  /**
   * Get currently loaded notifications synchronously.
   */
  getNotifications(): CNotification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Get current unread count synchronously.
   */
  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Reset pagination state.
   */
  private resetPagination(): void {
    this.pageIndex = 0;
    this.hasMoreNotifications = true;
    this.loadingMore = false;
  }

  /**
   * Clear everything on logout.
   */
  clear(): void {
    this.currentRole = null;
    this.currentUserId = null;

    this.resetPagination();

    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    this.loadingSubject.next(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}