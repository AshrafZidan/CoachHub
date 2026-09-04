import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  updateDoc
} from 'firebase/firestore';


import {
  CNotification
} from './notification.model';
import { firestore } from '../../core/components/firebase/firebase.config';


@Injectable({
  providedIn: 'root'
})
export class NotificationService
  implements OnDestroy {

  // =========================================================
  // STATE
  // =========================================================

  private readonly notificationsSubject =
    new BehaviorSubject<CNotification[]>([]);

  readonly notifications$ =
    this.notificationsSubject.asObservable();


  // =========================================================
  // NEW NOTIFICATION EVENT
  // =========================================================

  private readonly newNotificationSubject =
    new Subject<CNotification>();

  readonly newNotification$ =
    this.newNotificationSubject.asObservable();


  // =========================================================
  // LOADING
  // =========================================================

  private readonly loadingSubject =
    new BehaviorSubject<boolean>(false);

  readonly loading$ =
    this.loadingSubject.asObservable();


  // =========================================================
  // FIREBASE LISTENER
  // =========================================================

  private unsubscribeFirestore:
    (() => void) | null = null;


  // =========================================================
  // CURRENT USER
  // =========================================================

  private currentCoachId:
    number | null = null;


  // =========================================================
  // START LISTENING
  // =========================================================

  startCoachNotifications(
    coachId: number
  ): void {

    // Same coach already connected
    if (
      this.currentCoachId === coachId &&
      this.unsubscribeFirestore
    ) {
      return;
    }

    // Stop previous listener
    this.stopNotifications();

    this.currentCoachId = coachId;

    this.loadingSubject.next(true);


    // =======================================================
    // COLLECTION
    // =======================================================

    const notificationsRef =
      collection(
        firestore,
        'notifications'
      );


    // =======================================================
    // QUERY
    // =======================================================

    const notificationsQuery =
      query(

        notificationsRef,

        where(
          'coachId',
          '==',
          coachId
        ),

        orderBy(
          'createdDate',
          'desc'
        )
      );


    // =======================================================
    // REALTIME LISTENER
    // =======================================================

    this.unsubscribeFirestore =
      onSnapshot(

        notificationsQuery,

        snapshot => {

          const notifications:
            CNotification[] = [];


          // ---------------------------------------------------
          // MAP FIRESTORE DOCUMENTS
          // ---------------------------------------------------

          snapshot.docs.forEach(firebaseDoc => {

            const data =
              firebaseDoc.data();


            const createdDate =
              data['createdDate']?.toDate
                ? data['createdDate'].toDate()
                : new Date(
                    data['createdDate'] ?? Date.now()
                  );


            notifications.push({

              id:
                firebaseDoc.id,

              coachId:
                Number(data['coachId']),

              titleEn:
                data['titleEn'] ?? '',

              titleAr:
                data['titleAr'] ?? '',

              bodyEn:
                data['bodyEn'] ?? '',

              bodyAr:
                data['bodyAr'] ?? '',

              read:
                data['read'] ?? false,

              createdDate,

            //   type:
            //     data['type'] ?? undefined,

            //   route:
            //     data['route'] ?? undefined

            });

          });


          // ---------------------------------------------------
          // DETECT NEW NOTIFICATIONS
          // ---------------------------------------------------

          this.handleNewNotifications(
            notifications,
            snapshot
          );


          // ---------------------------------------------------
          // UPDATE STATE
          // ---------------------------------------------------

          this.notificationsSubject.next(
            notifications
          );

          this.loadingSubject.next(false);
        },


        error => {

          console.error(
            'Firebase notifications error:',
            error
          );

          this.notificationsSubject.next([]);

          this.loadingSubject.next(false);
        }
      );
  }


  // =========================================================
  // DETECT NEW NOTIFICATIONS
  // =========================================================

  private firstSnapshotReceived = false;

  private knownNotificationIds =
    new Set<string>();


  private handleNewNotifications(
    notifications: CNotification[],
    snapshot: any
  ): void {

    // -------------------------------------------------------
    // FIRST LOAD
    // -------------------------------------------------------

    if (!this.firstSnapshotReceived) {

      notifications.forEach(notification => {

        this.knownNotificationIds.add(
          notification.id
        );

      });

      this.firstSnapshotReceived = true;

      return;
    }


    // -------------------------------------------------------
    // NEW DOCUMENTS
    // -------------------------------------------------------

    snapshot.docChanges().forEach(
      (change: any) => {

        if (
          change.type !== 'added'
        ) {
          return;
        }


        const notification =
          notifications.find(
            item =>
              item.id === change.doc.id
          );


        if (!notification) {
          return;
        }


        // Already handled
        if (
          this.knownNotificationIds.has(
            notification.id
          )
        ) {
          return;
        }


        this.knownNotificationIds.add(
          notification.id
        );


        // ---------------------------------------------------
        // EMIT NEW NOTIFICATION
        // ---------------------------------------------------

        this.newNotificationSubject.next(
          notification
        );
      }
    );
  }


  // =========================================================
  // MARK AS READ
  // =========================================================

  async markAsRead(
    notificationId: string
  ): Promise<void> {

    try {

      const notificationRef =
        doc(
          firestore,
          'notifications',
          notificationId
        );


      await updateDoc(
        notificationRef,
        {
          read: true
        }
      );

    } catch (error) {

      console.error(
        'Failed to mark notification as read:',
        error
      );

    }
  }


  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  async markAllAsRead(): Promise<void> {

    const notifications =
      this.notificationsSubject.value;


    const unread =
      notifications.filter(
        notification =>
          !notification.read
      );


    await Promise.all(
      unread.map(
        notification =>
          this.markAsRead(
            notification.id
          )
      )
    );
  }


  // =========================================================
  // GET CURRENT NOTIFICATIONS
  // =========================================================

  getNotifications(): CNotification[] {

    return this.notificationsSubject.value;
  }


  // =========================================================
  // GET UNREAD COUNT
  // =========================================================

  getUnreadCount(): number {

    return this.notificationsSubject.value
      .filter(
        notification =>
          !notification.read
      )
      .length;
  }


  // =========================================================
  // STOP LISTENER
  // =========================================================

  stopNotifications(): void {

    if (this.unsubscribeFirestore) {

      this.unsubscribeFirestore();

      this.unsubscribeFirestore =
        null;
    }


    this.currentCoachId =
      null;


    this.firstSnapshotReceived =
      false;


    this.knownNotificationIds.clear();


    this.notificationsSubject.next([]);

    this.loadingSubject.next(false);
  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.stopNotifications();
  }
}