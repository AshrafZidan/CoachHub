import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  getMessaging,
  getToken,
  isSupported,
  Messaging,
  onMessage,
  MessagePayload
} from 'firebase/messaging';

import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';
import { firebaseApp } from '../../core/components/firebase/firebase.config';
import { ToastService } from '../../core/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(ToastService);


  private messaging: Messaging | null = null;
  private unsubscribeOnMessage: (() => void) | null = null;

  async start(): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const supported = await isSupported();

      if (!supported) {
        console.warn('Firebase Messaging is not supported.');
        return null;
      }

      // IMPORTANT: use the initialized Firebase app
      this.messaging = getMessaging(firebaseApp);

      this.listenForMessages();

      return await this.getFcmToken();
    } catch (error) {
      console.error(
        'Failed to initialize Firebase Messaging:',
        error
      );

      return null;
    }
  }

  public async getFcmToken(): Promise<string | null> {
  if (!this.messaging || !isPlatformBrowser(this.platformId)) {
    return null;
  }

  try {
    const permission = Notification.permission;

    if (permission === 'denied') {
      this.toastService.warn(
        'Browser notifications are blocked. Please enable notifications in site settings.'
      );
      
      return null;
    }

    if (permission === 'default') {
      const requestedPermission =
        await Notification.requestPermission();

      if (requestedPermission !== 'granted') {
        console.warn(
          'Notification permission was not granted.'
        );

        return null;
      }
    }

    const token = await getToken(this.messaging, {
      vapidKey: environment.firebase.vapidKey
    });

    if (!token) {
      console.warn('FCM token was not returned.');
      return null;
    }

    console.log('FCM token received.');

    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
}
  private listenForMessages(): void {
    if (!this.messaging || this.unsubscribeOnMessage) {
      return;
    }

    this.unsubscribeOnMessage = onMessage(
      this.messaging,
      (payload: MessagePayload) => {
        console.log('Foreground notification received:', payload);

        this.notificationService.handleRealtimeNotification(payload);
      }
    );
  }

  stop(): void {
    this.unsubscribeOnMessage?.();
    this.unsubscribeOnMessage = null;
    this.messaging = null;
  }
}