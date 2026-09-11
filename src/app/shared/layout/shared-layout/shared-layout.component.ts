import {
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from "@angular/core";

import { CommonModule } from "@angular/common";

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";

import { SkeletonModule } from "primeng/skeleton";

import { TranslateService } from "@ngx-translate/core";

import { Subject, takeUntil } from "rxjs";

import { AuthService } from "../../../core/services/auth.service";
import { User } from "../../../core/models/auth.model";

import {
  NotificationRole,
  NotificationService,
} from "../../Notifaction/notification.service";

import { CNotification } from "../../Notifaction/notification.model";

import { ToastService } from "../../../core/services/toast.service";
import { FcmService } from "../../Notifaction/firebase-notification.service";

type UserRole = "COACH" | "COACHEE" | null;

interface JwtPayload {
  roles?: unknown;
  role?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  [key: string]: unknown;
}

interface NavItem {
  label: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: "app-shared-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SkeletonModule,
  ],
  templateUrl: "./shared-layout.component.html",
  styleUrls: ["./shared-layout.component.scss"],
})
export class SharedLayoutComponent implements OnInit, OnDestroy {
  // =========================================================
  // SERVICES
  // =========================================================

  protected readonly authService = inject(AuthService);

  private readonly translate = inject(TranslateService);

  private readonly router = inject(Router);

  private readonly notificationService = inject(NotificationService);

  private readonly toastService = inject(ToastService);

  private readonly fcmService = inject(FcmService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly ngZone = inject(NgZone);

  // =========================================================
  // DESTROY
  // =========================================================

  private readonly destroy$ = new Subject<void>();

  // =========================================================
  // USER STATE
  // =========================================================

  userRole = signal<UserRole>(null);

  username = signal<string>("User");

  language = signal<"en" | "ar">("en");

  // =========================================================
  // MENU
  // =========================================================

  menuOpen = false;

  notificationMenuOpen = false;

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  notificationsLoading = false;

  notifications: CNotification[] = [];

  unreadCount = signal<number>(0);

  // =========================================================
  // NAVIGATION
  // =========================================================

  coachNavItems: NavItem[] = [
    {
      label: "Bookings",
      route: "/coach/bookings",
      exact: true,
    },
    {
      label: "Calendar",
      route: "/coach/calendar",
      exact: false,
    },
    {
      label: "Todo",
      route: "/coach/todo",
      exact: false,
    },
    {
      label: "Coachees",
      route: "/coach/Coachees",
      exact: false,
    },
  ];

  coacheeNavItems: NavItem[] = [
    {
      label: "Find Coach",
      route: "/coachee/find-coach",
      exact: true,
    },
    {
      label: "Booking",
      route: "/coachee/bookings",
      exact: false,
    },
    {
      label: "Todo",
      route: "/coachee/todo",
      exact: false,
    },
  ];

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {
    this.initializeUser();

    this.loadLanguage();

    this.initializeNotifications();

    this.initializeFcm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================================================
  // USER
  // =========================================================

  private initializeUser(): void {
    try {
      const user = this.authService.getUser?.() as User | undefined;

      if (user) {
        this.extractRoleFromUser(user);

        this.extractUsernameFromUser(user);
      }

      if (!this.userRole()) {
        this.detectRoleFromToken();
      }
    } catch (error: unknown) {
      console.error("Error initializing user:", error);

      this.userRole.set(null);

      this.username.set("User");
    }
  }

  // =========================================================
  // ROLE FROM USER
  // =========================================================

  private extractRoleFromUser(user: User): void {
    if (!user.roles || user.roles.length === 0) {
      return;
    }

    const roleString = String(user.roles[0]);

    const normalizedRole = roleString.toUpperCase();

    if (normalizedRole.includes("COACHEE")) {
      this.userRole.set("COACHEE");

      return;
    }

    if (normalizedRole.includes("COACH")) {
      this.userRole.set("COACH");
    }
  }

  // =========================================================
  // USERNAME
  // =========================================================

  private extractUsernameFromUser(user: User): void {
    const parts: string[] = [];

    if (user.firstName) {
      parts.push(user.firstName);
    }

    if (user.lastName) {
      parts.push(user.lastName);
    }

    if (parts.length > 0) {
      this.username.set(parts.join(" "));
    }
  }

  // =========================================================
  // ROLE FROM JWT
  // =========================================================

  private detectRoleFromToken(): void {
    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!token) {
        return;
      }

      const decoded = this.decodeToken(token);

      if (!decoded) {
        return;
      }

      const roles = decoded["roles"];

      if (Array.isArray(roles)) {
        for (const role of roles) {
          const roleString = String(role).toUpperCase();

          if (roleString.includes("COACHEE")) {
            this.userRole.set("COACHEE");

            break;
          }

          if (roleString.includes("COACH")) {
            this.userRole.set("COACH");

            break;
          }
        }
      }

      if (!this.userRole()) {
        const role = decoded["role"];

        if (typeof role === "string") {
          const normalizedRole = role.toUpperCase();

          if (normalizedRole.includes("COACHEE")) {
            this.userRole.set("COACHEE");
          } else if (normalizedRole.includes("COACH")) {
            this.userRole.set("COACH");
          }
        }
      }

      const firstName = decoded["firstName"];

      const lastName = decoded["lastName"];

      const parts: string[] = [];

      if (typeof firstName === "string" && firstName) {
        parts.push(firstName);
      }

      if (typeof lastName === "string" && lastName) {
        parts.push(lastName);
      }

      if (parts.length > 0) {
        this.username.set(parts.join(" "));
      }
    } catch (error: unknown) {
      console.error("Error detecting role from token:", error);
    }
  }

  // =========================================================
  // DECODE JWT
  // =========================================================

  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split(".")[1];

      if (!base64Url) {
        return null;
      }

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (character) =>
              "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      );

      const parsed: unknown = JSON.parse(jsonPayload);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return null;
      }

      return parsed as JwtPayload;
    } catch (error: unknown) {
      console.error("Error decoding token:", error);

      return null;
    }
  }

  // =========================================================
  // LANGUAGE
  // =========================================================

  private loadLanguage(): void {
    const lang =
      this.translate.getCurrentLang() ||
      this.translate.getFallbackLang() ||
      "en";

    this.language.set(lang === "ar" ? "ar" : "en");
  }

  // =========================================================
  // NAV ITEMS
  // =========================================================

  get navItems(): NavItem[] {
    return this.userRole() === "COACH"
      ? this.coachNavItems
      : this.coacheeNavItems;
  }

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  private initializeNotifications(): void {
    const user = this.authService.getUser?.() as User | undefined;

    if (!user) {
      console.warn("Notification initialization skipped: no user.");

      return;
    }

    const role = this.userRole();

    if (role !== "COACH" && role !== "COACHEE") {
      console.warn("Notification initialization skipped: invalid role.", role);

      return;
    }

    const userId = Number(user.id);

    if (!Number.isFinite(userId) || userId <= 0) {
      console.warn("Invalid notification user ID:", user.id);

      return;
    }

    // -------------------------------------------------------
    // Notifications
    // -------------------------------------------------------

    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.ngZone.run(() => {
            this.notifications = notifications;

            /*
             * Force Angular to render the
             * new notification state immediately.
             */
            this.cdr.detectChanges();
          });
        },
      });

    // -------------------------------------------------------
    // Loading
    // -------------------------------------------------------

    this.notificationService.loading$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (loading) => {
        this.ngZone.run(() => {
          this.notificationsLoading = loading;

          console.log("[Notifications] loading:", loading);

          /*
           * This is important for the
           * skeleton -> list transition.
           */
          this.cdr.detectChanges();
        });
      },
    });

    // -------------------------------------------------------
    // Unread count
    // -------------------------------------------------------

    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.ngZone.run(() => {
            this.unreadCount.set(count);

            this.cdr.detectChanges();
          });
        },
      });

    // -------------------------------------------------------
    // Realtime FCM notification
    // -------------------------------------------------------

    this.notificationService.newNotification$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notification) => {
          this.ngZone.run(() => {
            const title = this.getNotificationTitle(notification);

            const body = this.getNotificationBody(notification);

            this.toastService.info(title, body);

            this.cdr.detectChanges();
          });
        },
      });

    // -------------------------------------------------------
    // Initialize AFTER subscriptions
    // -------------------------------------------------------

    this.notificationService.initialize(userId, role as NotificationRole);
  }

  // =========================================================
  // FCM
  // =========================================================

  private async initializeFcm(): Promise<void> {
    try {
      if (!this.authService.isLoggedIn()) {
        return;
      }

      const role = this.userRole();

      if (role !== "COACH" && role !== "COACHEE") {
        return;
      }

      const token = await this.fcmService.start();

      if (!token) {
        return;
      }

      this.notificationService
        .registerFcmToken(token)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log("FCM token registered successfully.");

            this.ngZone.run(() => {
              this.cdr.detectChanges();
            });
          },

          error: (error: unknown) => {
            console.error("Failed to register FCM token:", error);
          },
        });
    } catch (error: unknown) {
      console.error("Failed to initialize FCM:", error);
    }
  }

  // =========================================================
  // INFINITE SCROLL
  // =========================================================

  onNotificationsScroll(event: Event): void {
    const element = event.target as HTMLElement;

    if (!element) {
      return;
    }

    const threshold = 80;

    const nearBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - threshold;

    if (!nearBottom) {
      return;
    }

    this.notificationService.loadNextPage();
  }

  // =========================================================
  // TRACK BY
  // =========================================================

  trackByNotificationId(_index: number, notification: CNotification): string {
    return String(notification.id);
  }

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  markAllAsRead(): void {
    if (this.unreadCount() === 0) {
      return;
    }

    this.notificationService
      .markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.updateLocalNotificationsAsRead();

          this.ngZone.run(() => {
            this.unreadCount.set(0);

            this.cdr.detectChanges();
          });

          console.log("All notifications marked as read.");
        },

        error: (error: unknown) => {
          console.error("Failed to mark all notifications as read:", error);
        },
      });
  }

  // =========================================================
  // NOTIFICATION CLICK
  // =========================================================

  onNotificationClick(notification: CNotification): void {
    this.notificationMenuOpen = false;

    if (!notification.read) {
      this.notificationService
        .markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.ngZone.run(() => {
              this.notificationService.updateLocalNotificationAsRead(
                notification.id
              );

              this.cdr.detectChanges();
            });
          },

          error: (error: unknown) => {
            console.error("Failed to mark notification as read:", error);
          },
        });
    }

    if (notification.route) {
      this.router.navigateByUrl(notification.route);
    }
  }

  // =========================================================
  // NOTIFICATION TITLE
  // =========================================================

  getNotificationTitle(notification: CNotification): string {
    if (this.language() === "ar") {
      return notification.titleAr || notification.titleEn || "Notification";
    }

    return notification.titleEn || notification.titleAr || "Notification";
  }

  // =========================================================
  // NOTIFICATION BODY
  // =========================================================

  getNotificationBody(notification: CNotification): string {
    if (this.language() === "ar") {
      return notification.bodyAr || notification.bodyEn || "";
    }

    return notification.bodyEn || notification.bodyAr || "";
  }

  // =========================================================
  // NOTIFICATION TIME
  // =========================================================

  getNotificationTime(date: Date): string {
    try {
      const notificationDate = date instanceof Date ? date : new Date(date);

      const now = new Date();

      const diff = now.getTime() - notificationDate.getTime();

      if (diff < 0) {
        return "just now";
      }

      const minutes = Math.floor(diff / 60000);

      const hours = Math.floor(diff / 3600000);

      const days = Math.floor(diff / 86400000);

      if (minutes < 1) {
        return "just now";
      }

      if (minutes < 60) {
        return `${minutes}m ago`;
      }

      if (hours < 24) {
        return `${hours}h ago`;
      }

      if (days < 7) {
        return `${days}d ago`;
      }

      return notificationDate.toLocaleDateString();
    } catch {
      return "";
    }
  }

  // =========================================================
  // TOGGLE NOTIFICATIONS
  // =========================================================

  toggleNotifications(): void {
    this.notificationMenuOpen = !this.notificationMenuOpen;

    if (this.notificationMenuOpen) {
      this.menuOpen = false;
    }

    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  }

  // =========================================================
  // PROFILE MENU
  // =========================================================

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      this.notificationMenuOpen = false;
    }

    this.cdr.detectChanges();
  }

  closeMenu(): void {
    this.menuOpen = false;

    this.cdr.detectChanges();
  }

  // =========================================================
  // LANGUAGE
  // =========================================================

  toggleLanguage(): void {
    const newLang = this.language() === "ar" ? "en" : "ar";

    this.language.set(newLang);

    this.translate.use(newLang);

    localStorage.setItem("language", newLang);

    this.cdr.detectChanges();
  }

  // =========================================================
  // SIGNUP
  // =========================================================

  navigateToSignup(): void {
    this.router.navigate([
      "/auth/register",
      {
        role: this.userRole() === "COACH" ? "COACHEE" : "coach",
      },
    ]);
  }

  // =========================================================
  // SIGN IN
  // =========================================================

  navigateToSignIn(): void {
    this.router.navigate(["/auth/login"]);
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  handleLogout(): void {
    this.notificationService.clear();

    this.fcmService.stop();

    if (this.authService.logout) {
      this.authService.logout();
    } else if (this.authService.cleartoken) {
      this.authService.cleartoken();
    } else {
      localStorage.removeItem("token");

      localStorage.removeItem("access_token");

      localStorage.removeItem("authToken");

      localStorage.removeItem("user");
    }

    this.menuOpen = false;

    this.notificationMenuOpen = false;

    this.notifications = [];

    this.unreadCount.set(0);

    this.notificationsLoading = false;

    this.cdr.detectChanges();
  }

  // =========================================================
  // OUTSIDE CLICK
  // =========================================================

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const clickedNotification = !!target.closest(".notification-wrapper");

    const clickedProfile = !!target.closest(".profile-dropdown");

    let changed = false;

    if (!clickedNotification && this.notificationMenuOpen) {
      this.notificationMenuOpen = false;

      changed = true;
    }

    if (!clickedProfile && this.menuOpen) {
      this.menuOpen = false;

      changed = true;
    }

    if (changed) {
      this.cdr.detectChanges();
    }
  }
}
