import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { firestore } from '../../firebase';
import { useAppDispatch } from '../../hooks';
import { BoardSettings } from '../../models/BoardSettings.model';
import { User } from '../../models/User.model';
import { addSharing } from '../../store/reducers/boards';

type Props = {
  selectedBoard: BoardSettings;
};

const SharingSearch = ({ selectedBoard }: Props) => {
  const [email, setEmail] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();

  const inputStyles =
    '!outline-0 text-xl w-full my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  const searchForUser = () => {
    const q = query(collection(firestore, 'users'), where('email', '==', email), limit(1));
    getDocs(q).then((userDocs) => {
      userDocs.forEach((userDoc) => {
        const user = { ...userDoc.data() };
        if (userDoc.exists()) {
          setUser({
            recordId: userDoc.id,
            email: user.email,
            emailVerified: user.emailVerified,
            creationTime: user.creationTime,
            photoURL: user.photoURL,
            uid: user.uid,
            displayName: user.displayName
          });
        }
      });
    });
  };

  const handleBoardSharing = () => {
    if (selectedBoard.id && user !== null) {
      dispatch(addSharing(user.uid, selectedBoard.id));
      setEmail('');
      setUser(null);
    }
  };

  return (
    <>
      <div className="flex flex-row w-3/4 items-center">
        <input
          type="text"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`input ${inputStyles}`}
        />
        <button className="btn bg-purple-500 w-20 border-none" onClick={searchForUser}>
          Search
        </button>
      </div>
      {user !== null && (
        <div className="flex flex-row items-center w-full justify-evenly my-4">
          <div className="flex flex-row items-center">
            <div className="avatar placeholder justify-end">
              <div className="w-10 h-10 rounded-full bg-blue-500">
                {user.photoURL === null || user.photoURL.length === 0 ? (
                  <span className="text-xl text-white font-bold">
                    {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                  </span>
                ) : (
                  <img src={user.photoURL} />
                )}
              </div>
            </div>
            <div className="flex flex-col ml-4">
              <p className="text-xl font-bold">{user.displayName}</p>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <button className="btn bg-green-500 w-20 border-none" onClick={handleBoardSharing}>
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SharingSearch;
