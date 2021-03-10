import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Activity } from '../models/activity';

const firebaseConfig = {
  apiKey: 'AIzaSyAl1aO7tkbBDgCOK1AGx0XGTmPEVQspjrE',
  authDomain: 'taugor-react-app.firebaseapp.com',
  projectId: 'taugor-react-app',
  storageBucket: 'taugor-react-app.appspot.com',
  messagingSenderId: '427492510140',
  appId: '1:427492510140:web:3a7d6f6f669b12809c03b9',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const firestore = firebase.firestore();

export const addActivity = (
  activity: Activity,
  userId: string,
): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> => {
  return firestore.collection('activities').add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: userId,
    ...activity,
  });
};

export const getActivities = (
  userId: string,
): Promise<
  firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
> => {
  return firestore
    .collection('activities')
    .where('createdBy', '==', userId)
    .get();
};

export const deleteActivity = (actitivyId: string): Promise<void> => {
  return firestore.collection('activities').doc(actitivyId).delete();
};

export const editActivityStatus = (activity: Activity): Promise<void> => {
  return firestore
    .collection('activities')
    .doc(activity.id)
    .update({ status: activity.status });
};

export const editActivityUser = (activity: Activity): Promise<void> => {
  return firestore
    .collection('activities')
    .doc(activity.id)
    .update({ user: activity.user });
};
