export const useSession = jest.fn(() => ({
  data: {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg'
    },
    session: {
      id: 'test-session-id'
    }
  },
  isPending: false,
  error: null
}));

export const signIn = {
  email: jest.fn(),
  social: jest.fn()
};

export const signUp = {
  email: jest.fn()
};

export const signOut = jest.fn();

export const authClient = {
  useSession,
  signIn,
  signUp,
  signOut
};
