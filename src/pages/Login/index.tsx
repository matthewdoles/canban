import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { BounceLoader } from 'react-spinners';
import { SET_USER_ERROR, SET_USER_LOADING } from '../../store/reducers/user';
import { FirebaseError } from 'firebase/app';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const inputStyles =
    '!outline-0 text-xl w-full max-w-md my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  useEffect(() => {
    if (user.firebaseUser !== null) {
      navigate('/dashboard');
    }
  }, [user.firebaseUser]);

  const handleFormSubmit = async () => {
    dispatch({ type: SET_USER_LOADING, loading: true });
    dispatch({ type: SET_USER_ERROR, error: '' });
    if (isCreate) {
      if (email.length > 0 && password.length > 0) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (user) => {
            addDoc(collection(firestore, 'users'), {
              email: user.user.email,
              emailVerified: user.user.emailVerified,
              creationTime: user.user.metadata.creationTime,
              photoURL: user.user.photoURL,
              uid: user.user.uid,
              displayName: user.user.email
            });
            setEmail('');
            setPassword('');
          })
          .catch((err: FirebaseError) => {
            if (
              err.message ===
              'Firebase: Password should be at least 6 characters (auth/weak-password).'
            ) {
              dispatch({
                type: SET_USER_ERROR,
                error: 'Password must be at least six characters long.'
              });
            } else if (err.message === 'Firebase: Error (auth/invalid-email).') {
              dispatch({ type: SET_USER_ERROR, error: 'Please enter a valid email to sign up.' });
            } else if (err.message === 'Firebase: Error (auth/email-already-in-use).') {
              dispatch({
                type: SET_USER_ERROR,
                error: 'Email is already in use by an existing user.'
              });
            } else {
              dispatch({
                type: SET_USER_ERROR,
                error: 'Unknown error occured. Please try again later.'
              });
            }
          })
          .finally(() => {
            dispatch({ type: SET_USER_LOADING, loading: false });
          });
      }
    } else {
      if (email.length > 0 && password.length > 0) {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            setEmail('');
            setPassword('');
          })
          .catch((err: FirebaseError) => {
            if (err.message === 'Firebase: Error (auth/wrong-password).') {
              dispatch({ type: SET_USER_ERROR, error: 'Incorrect email/password.' });
            } else if (err.message === 'Firebase: Error (auth/invalid-email).') {
              dispatch({ type: SET_USER_ERROR, error: 'Please enter a valid email to sign-in.' });
            } else {
              dispatch({
                type: SET_USER_ERROR,
                error: 'Unknown error occured. Please try again later.'
              });
            }
          })
          .finally(() => {
            dispatch({ type: SET_USER_LOADING, loading: false });
          });
      }
    }
  };

  return (
    <div className="pt-8">
      {user.firebaseUser === null && (
        <div className="lg:w-2/5 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-white shadow-lg items-center rounded-lg">
          <div className="w-full relative justify-center bg-primary p-1 rounded-t-lg">
            <p
              className="text-xl text-white text-center font-bold"
              style={{ fontFamily: 'Noto Sans' }}>
              {user.firebaseUser !== null ? 'Logout' : isCreate ? 'Create Account' : 'Login'}
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
            <p className="text-red-500 font-bold">{user.error}</p>
            <div className="flex flex-col w-full items-center mt-4">
              {user.loading && (
                <div className="flex flex-row justify-center p-4">
                  <BounceLoader size={75} color="#3B82F6" />
                </div>
              )}
              {!user.loading && (
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
      )}
    </div>
  );
}

export default Login;
