import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Activity } from '../models/activity';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_TAUGOR_API_KEY,
  authDomain: process.env.REACT_APP_TAUGOR_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_TAUGOR_PROJECT_ID,
  storageBucket: process.env.REACT_APP_TAUGOR_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_TAUGOR_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_TAUGOR_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

export const emailSignIn = (
  email: string,
  password: string,
): Promise<firebase.auth.UserCredential> => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const emailSignUp = (
  email: string,
  password: string,
): Promise<firebase.auth.UserCredential> => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const emailRecovery = (email: string): Promise<void> => {
  return auth.sendPasswordResetEmail(email);
};

export const addUser = (user: {
  email: string | null;
  displayName: string | null;
  uid: string;
}): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> => {
  return firestore.collection('users').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    ...user,
  });
};

export const getUsers = (): Promise<
  firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
> => {
  return firestore.collection('users').orderBy('created').get();
};

export const addActivity = (
  activity: Activity,
  userId: string,
): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> => {
  return firestore.collection('activities').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    ...activity,
    events: [
      {
        type: 'create',
        created: new Date(),
        user: userId,
      },
    ],
  });
};

export const getActivity = (
  activityId: string,
): Promise<
  firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
> => {
  return firestore.collection('activities').doc(activityId).get();
};

export const getActivities = (
  status?: string,
): Promise<
  firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
> => {
  if (status) {
    return firestore
      .collection('activities')
      .where('status', '==', status)
      .orderBy('created')
      .get();
  }

  return firestore.collection('activities').orderBy('created').get();
};

export const deleteActivity = (actitivyId: string): Promise<void> => {
  return firestore.collection('activities').doc(actitivyId).delete();
};

export const editActivityStatus = (
  activity: Activity,
  userId: string,
): Promise<void> => {
  return firestore
    .collection('activities')
    .doc(activity.id)
    .update({
      status: activity.status,
      events: [
        ...activity.events,
        {
          type: 'edit-status',
          created: new Date(),
          user: userId,
        },
      ],
    });
};

export const editActivityUser = (
  activity: Activity,
  userId: string,
): Promise<void> => {
  return firestore
    .collection('activities')
    .doc(activity.id)
    .update({
      user: activity.user,
      events: [
        ...activity.events,
        {
          type: 'edit-user',
          created: new Date(),
          user: userId,
        },
      ],
    });
};
