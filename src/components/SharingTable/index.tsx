import React from 'react';
import { MdDelete } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { BoardSharing } from '../../models/BoardSharing.model';
import { deleteSharing } from '../../store/reducers/boards';

type Props = {
  boardSharing: BoardSharing[];
  boardId: string;
};

const SharingTable = ({ boardSharing, boardId }: Props) => {
  const allUsers = useAppSelector((state) => state.user.allUsers);
  const dispatch = useAppDispatch();

  const handleDeleteShare = (uid: string) => {
    dispatch(deleteSharing(uid, boardId));
  };

  return (
    <>
      {boardSharing && (
        <div className="my-2">
          <p className="text-lg text-bold text-center font-bold">Current Sharing</p>
          <div className="overflow-x-auto w-full mt-4">
            <table className="table !min-w-[550px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="text-center">Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {boardSharing.map((share) => {
                  const u = allUsers.find((u) => u.uid === share.uid);
                  if (u) {
                    if (u.uid === share.uid) {
                      return (
                        <tr key={u.recordId}>
                          <td className="w-1/2">
                            <div className="flex items-center space-x-3">
                              <div className="avatar placeholder justify-end">
                                <div className="w-10 h-10 rounded-full bg-blue-500">
                                  {u.photoURL === null || u.photoURL.length === 0 ? (
                                    <span className="text-xl text-white font-bold">
                                      {u.displayName ? u.displayName.charAt(0) : u.email.charAt(0)}
                                    </span>
                                  ) : (
                                    <img src={u.photoURL} />
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{u.displayName}</div>
                                <div className="text-sm opacity-50">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="w-1/4 text-center">{share.access}</td>
                          <th className="w-1/4">
                            <div className="flex justify-center space-x-3">
                              <MdDelete
                                size={32}
                                className="cursor-pointer text-red-500"
                                onClick={() => handleDeleteShare(share.uid)}
                              />
                            </div>
                          </th>
                        </tr>
                      );
                    }
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default SharingTable;
