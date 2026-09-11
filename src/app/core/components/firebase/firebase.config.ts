import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { environment } from '../../../../environments/environment';

export const firebaseApp: FirebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(environment.firebase);