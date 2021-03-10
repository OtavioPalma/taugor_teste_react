import firebase from 'firebase';

export interface AuthState {
  user: firebase.User;
}

export interface AuthContextData {
  user: firebase.User;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}