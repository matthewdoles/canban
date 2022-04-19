import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAppSelector } from '../../hooks';

function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.firebaseUser);

  const inputStyles =
    '!outline-0 text-xl w-full max-w-md my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  const handleFormSubmit = async () => {
    try {
      if (isCreate) {
        if (email.length > 0 && password.length > 0) {
          await createUserWithEmailAndPassword(auth, email, password);
          setEmail('');
          setPassword('');
        }
      } else {
        if (email.length > 0 && password.length > 0) {
          await signInWithEmailAndPassword(auth, email, password);
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <div className="pt-8">
      <div className="lg:w-2/5 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-white shadow-lg items-center rounded-lg">
        <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
          <p
            className="text-xl text-white text-center font-bold"
            style={{ fontFamily: 'Noto Sans' }}>
            {user !== null ? 'Logout' : isCreate ? 'Create Account' : 'Login'}
          </p>
        </div>
        <div className="flex flex-col w-full items-center p-4">
          {user === null && (
            <>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input ${inputStyles}`}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input ${inputStyles}`}
              />
            </>
          )}
          {user !== null && (
            <p>
              {user.email} &bull; {user.uid}
            </p>
          )}
          <div className="flex flex-col w-full items-center mt-4">
            {user !== null ? (
              <label className="btn bg-red-500 w-40 border-none my-2" onClick={signOut}>
                Logout
              </label>
            ) : (
              <>
                <label
                  className="btn bg-green-500 w-40 border-none my-2"
                  onClick={handleFormSubmit}>
                  {isCreate ? 'Create' : 'Login'}
                </label>
                <label
                  className="btn btn-ghost w-40 border-none my-2"
                  onClick={() => setIsCreate(!isCreate)}>
                  {isCreate ? 'Login' : 'Sign Up'}
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
