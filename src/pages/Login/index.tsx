import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.firebaseUser);
  const navigate = useNavigate();

  const inputStyles =
    '!outline-0 text-xl w-full max-w-md my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  useEffect(() => {
    if (user !== null) {
      navigate('/dashboard');
    }
  }, [user]);

  const handleFormSubmit = async () => {
    try {
      if (isCreate) {
        if (email.length > 0 && password.length > 0) {
          createUserWithEmailAndPassword(auth, email, password)
            .then(async (user) => {
              await addDoc(collection(firestore, 'users'), {
                email: user.user.email,
                emailVerified: user.user.emailVerified,
                creationTime: user.user.metadata.creationTime,
                photoURL: user.user.photoURL,
                uid: user.user.uid,
                displayName: user.user.email
              });
            })
            .catch((error) => {
              console.log(error);
            });
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

  return (
    <div className="pt-8">
      {user === null && (
        <div className="lg:w-2/5 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-white shadow-lg items-center rounded-lg">
          <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
            <p
              className="text-xl text-white text-center font-bold"
              style={{ fontFamily: 'Noto Sans' }}>
              {user !== null ? 'Logout' : isCreate ? 'Create Account' : 'Login'}
            </p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
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

            <div className="flex flex-col w-full items-center mt-4">
              <label className="btn bg-green-500 w-40 border-none my-2" onClick={handleFormSubmit}>
                {isCreate ? 'Create' : 'Login'}
              </label>
              <label
                className="btn btn-ghost w-40 border-none my-2"
                onClick={() => setIsCreate(!isCreate)}>
                {isCreate ? 'Login' : 'Sign Up'}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
