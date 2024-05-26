// const auth = {
//     onAuthStateChanged: jest.fn().mockImplementation((callback) => {
//       callback(); // Call the callback immediately for testing purposes
//       return () => {}; // Return an empty function for cleanup
//     }),

//     signInWithEmailAndPassword: jest.fn().mockResolvedValue({
//       user: { uid: 'mockUserId' },
//     }),

//     signOut: jest.fn().mockResolvedValue(),

//     createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
//       user: { uid: 'mockUserId' },
//     }),
//   };

//   export default auth;
