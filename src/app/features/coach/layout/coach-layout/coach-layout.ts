import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule,
  Router
} from '@angular/router';

import {
  Subscription
} from 'rxjs';

import {
  SkeletonModule
} from 'primeng/skeleton';

import {
  MessageService
} from 'primeng/api';

import {
  NotificationService
} from '../../../../shared/Notifaction/notification.service';

import {
  CNotification
} from '../../../../shared/Notifaction/notification.model';

import {
  AuthService
} from '../../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-coach-layout',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    SkeletonModule,
    ToastModule
  ],

  templateUrl: './coach-layout.html',

  styleUrls: ['./coach-layout.scss'],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class CoachLayoutComponent
  implements OnInit, OnDestroy {


  // =========================================================
  // SERVICES
  // =========================================================

  private readonly authService =
    inject(AuthService);

  private readonly notificationService =
    inject(NotificationService);

  private readonly messageService =
    inject(MessageService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly router =
    inject(Router);


  // =========================================================
  // SUBSCRIPTIONS
  // =========================================================

  private readonly subscriptions =
    new Subscription();


  // =========================================================
  // PROFILE
  // =========================================================

  menuOpen = false;


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  notificationMenuOpen = false;

  notifications:
    CNotification[] = [];

  notificationsLoading = false;


  // =========================================================
  // LANGUAGE
  // =========================================================

  language:
    'en' | 'ar' = 'en';


  // =========================================================
  // USER
  // =========================================================

  username = 'Coach';


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadUserName();

    this.initializeNotifications();
  }


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  private initializeNotifications(): void {

    const coachId =
      this.getCoachIdFromToken();


    if (!coachId) {

      console.warn(
        'Coach ID not found in token'
      );

      return;
    }


    // -------------------------------------------------------
    // START FIREBASE REALTIME LISTENER
    // -------------------------------------------------------

    this.notificationService
      .startCoachNotifications(
        coachId
      );


    // -------------------------------------------------------
    // NOTIFICATIONS STATE
    // -------------------------------------------------------

    this.subscriptions.add(

      this.notificationService
        .notifications$
        .subscribe(
          notifications => {

            this.notifications =
              notifications;

            this.notificationsLoading =
              false;

            this.cdr.markForCheck();
          }
        )
    );


    // -------------------------------------------------------
    // LOADING STATE
    // -------------------------------------------------------

    this.subscriptions.add(

      this.notificationService
        .loading$
        .subscribe(
          loading => {

            this.notificationsLoading =
              loading;

            this.cdr.markForCheck();
          }
        )
    );


    // -------------------------------------------------------
    // NEW NOTIFICATION
    // -------------------------------------------------------

    this.subscriptions.add(

      this.notificationService
        .newNotification$
        .subscribe(
          notification => {

            this.showNotificationToast(
              notification
            );

            this.cdr.markForCheck();
          }
        )
    );
  }


  // =========================================================
  // TOAST
  // =========================================================

  private showNotificationToast(
    notification: CNotification
  ): void {

    const title =
      this.getNotificationTitle(
        notification
      );

    const body =
      this.getNotificationBody(
        notification
      );


    this.messageService.add({

      severity: 'info',

      summary: title,

      detail: body,

      life: 5000

    });
  }


  // =========================================================
  // TOGGLE NOTIFICATIONS
  // =========================================================

  toggleNotifications(): void {

    this.notificationMenuOpen =
      !this.notificationMenuOpen;


    this.menuOpen = false;


    this.cdr.markForCheck();
  }


  // =========================================================
  // CLOSE NOTIFICATIONS
  // =========================================================

  closeNotifications(): void {

    this.notificationMenuOpen =
      false;

    this.cdr.markForCheck();
  }


  // =========================================================
  // UNREAD COUNT
  // =========================================================

  get unreadCount(): number {

    return this.notifications
      .filter(
        notification =>
          !notification.read
      )
      .length;
  }


  // =========================================================
  // MARK AS READ
  // =========================================================

  async markAsRead(
    notification: CNotification
  ): Promise<void> {

    if (notification.read) {
      return;
    }


    await this.notificationService
      .markAsRead(
        notification.id
      );
  }


  // =========================================================
  // NOTIFICATION CLICK
  // =========================================================

  async onNotificationClick(
    notification: CNotification
  ): Promise<void> {

    await this.markAsRead(
      notification
    );


    // if (notification.route) {

    //   this.notificationMenuOpen =
    //     false;

    //   this.router.navigateByUrl(
    //     notification.route
    //   );
    // }
  }


  // =========================================================
  // MARK ALL READ
  // =========================================================

  async markAllAsRead(): Promise<void> {

    await this.notificationService
      .markAllAsRead();
  }


  // =========================================================
  // NOTIFICATION TITLE
  // =========================================================

  getNotificationTitle(
    notification: CNotification
  ): string {

    if (
      this.language === 'ar'
    ) {

      return (
        notification.titleAr ||
        notification.titleEn ||
        ''
      );
    }


    return (
      notification.titleEn ||
      notification.titleAr ||
      ''
    );
  }


  // =========================================================
  // NOTIFICATION BODY
  // =========================================================

  getNotificationBody(
    notification: CNotification
  ): string {

    if (
      this.language === 'ar'
    ) {

      return (
        notification.bodyAr ||
        notification.bodyEn ||
        ''
      );
    }


    return (
      notification.bodyEn ||
      notification.bodyAr ||
      ''
    );
  }


  // =========================================================
  // NOTIFICATION TIME
  // =========================================================

  getNotificationTime(
    date: Date
  ): string {

    if (!date) {
      return '';
    }


    const notificationDate =
      new Date(date);


    if (
      Number.isNaN(
        notificationDate.getTime()
      )
    ) {

      return '';
    }


    const now =
      new Date();


    const difference =
      now.getTime() -
      notificationDate.getTime();


    const seconds =
      Math.floor(
        difference / 1000
      );


    const minutes =
      Math.floor(
        seconds / 60
      );


    const hours =
      Math.floor(
        minutes / 60
      );


    const days =
      Math.floor(
        hours / 24
      );


    if (seconds < 60) {
      return 'Just Now';
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


    return notificationDate
      .toLocaleDateString(
        this.language === 'ar'
          ? 'ar-EG'
          : 'en-GB'
      );
  }


  // =========================================================
  // PROFILE MENU
  // =========================================================

  toggleMenu(): void {

    this.menuOpen =
      !this.menuOpen;

    this.notificationMenuOpen =
      false;

    this.cdr.markForCheck();
  }


  closeMenu(): void {

    this.menuOpen =
      false;

    this.cdr.markForCheck();
  }


  // =========================================================
  // LANGUAGE
  // =========================================================

  toggleLanguage(): void {

    this.language =
      this.language === 'ar'
        ? 'en'
        : 'ar';

    this.cdr.markForCheck();
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  handleLogout(): void {

    this.notificationService
      .stopNotifications();


    this.closeMenu();

    this.authService.logout();


    this.router.navigate([
      '/auth/login'
    ]);
  }


  // =========================================================
  // CLICK OUTSIDE
  // =========================================================

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(
    event: MouseEvent
  ): void {

    const target =
      event.target as HTMLElement;


    if (
      !target.closest(
        '.notification-wrapper'
      )
    ) {

      this.notificationMenuOpen =
        false;
    }


    if (
      !target.closest(
        '.profile-dropdown'
      )
    ) {

      this.menuOpen =
        false;
    }


    this.cdr.markForCheck();
  }


  // =========================================================
  // USER NAME
  // =========================================================

  private loadUserName(): void {

    const token =
      localStorage.getItem(
        'access_token'
      );


    if (!token) {

      this.username =
        'Coach';

      return;
    }


    try {

      const payload =
        JSON.parse(
          atob(
            token.split('.')[1]
          )
        );


      this.username =
        payload.name ||
        'Coach';


      localStorage.setItem(
        'username',
        this.username
      );


      this.cdr.markForCheck();

    } catch (error) {

      console.error(
        'Failed to decode token',
        error
      );


      this.username =
        localStorage.getItem(
          'username'
        ) ||
        'Coach';


      this.cdr.markForCheck();
    }
  }


  // =========================================================
  // GET COACH ID
  // =========================================================

  private getCoachIdFromToken():
    number | null {

    const token =
      localStorage.getItem(
        'access_token'
      );


    if (!token) {
      return null;
    }


    try {

      const payload =
        JSON.parse(
          atob(
            token.split('.')[1]
          )
        );


      return payload.coachId
        ? Number(payload.coachId)
        : null;

    } catch (error) {

      console.error(
        'Failed to read coachId',
        error
      );

      return null;
    }
  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();

    this.notificationService
      .stopNotifications();
  }
}