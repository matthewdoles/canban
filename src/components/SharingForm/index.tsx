import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { BoardSettings } from '../../models/BoardSettings.model';
import { getUsers } from '../../store/reducers/user';
import SharingSearch from '../SharingSearch';
import SharingTable from '../SharingTable';

type Props = {
  selectedBoard: BoardSettings;
};

const SharingForm = ({ selectedBoard }: Props) => {
  const error = useAppSelector((state) => state.boards.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedBoard.sharing) dispatch(getUsers(selectedBoard.sharing));
  }, [selectedBoard]);

  return (
    <>
      <input type="checkbox" id="share-form" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0 !min-w-[650px]">
          <div className="w-full relative justify-center bg-purple-500 p-1 rounded-t-lg">
            <p className="text-2xl text-white text-center font-bold">Sharing</p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
            <SharingSearch selectedBoard={selectedBoard} />
            <p className="text-red-500 font-bold">{error}</p>
            {selectedBoard.sharing && selectedBoard.id && (
              <SharingTable boardSharing={selectedBoard.sharing} boardId={selectedBoard.id} />
            )}
          </div>
          <div className="modal-action pb-4 pr-4">
            <label htmlFor="share-form" className="btn bg-red-500 text-white w-20 border-none">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharingForm;
