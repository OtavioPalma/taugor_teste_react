export interface FirebaseError {
  code: number;
  message: string;
}

interface firebaseErrorsInterface {
  [key: string]: string;
}

export const firebaseErrors: firebaseErrorsInterface = {
  'auth/user-not-found': 'Email não encontrado',
  'auth/wrong-password': 'Senha incorreta',
  'auth/email-already-in-use': 'Email já cadastrado',
};
