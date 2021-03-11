import firebase from 'firebase';

export interface AuthState {
  user: firebase.User;
}

export interface AuthContextData {
  user: firebase.User;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  recovery(email: string): Promise<void>;
  signOut(): void;
}
