class AuthProvider {
  signInWithEmailAndPassword = jest.fn();
  createUserWithEmailAndPassword = jest.fn();
  signOut = jest.fn();
  onAuthStateChanged = jest.fn();
}

const mockAuth = new AuthProvider();

export const getAuth = jest.fn(() => mockAuth);
