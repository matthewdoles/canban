import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { MdDelete, MdOutlineAddCircle } from 'react-icons/md';

import ColorPicker from '../../ColorPicker';
import { useAppDispatch } from '../../../hooks';
import { Stage } from '../../../models/Stage.model';
import { submitBoard } from '../../../store/reducers/boards';
import { initStages } from '../../../const/initData';
import { inputStyles, messages } from '../../../const';

type Props = {
  checked: boolean;
  close: () => void;
};

const BoardForm = ({ checked, close }: Props) => {
  const [boardName, setBoardName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [stages, setStages] = useState<Stage[]>(initStages);
  const dispatch = useAppDispatch();

  const updateStageSetting = (stage: Stage, field: string, value: string) => {
    setError('');
    setStages((prevStages) => {
      const stageIndex = prevStages.findIndex((s) => s.stageOrder == stage.stageOrder);
      const updatedStage = { ...prevStages[stageIndex] };
      if (field === 'color') updatedStage.color = value;
      if (field === 'title') updatedStage.title = value;
      const newStageInfo = [
        ...prevStages.filter((s) => s.stageOrder !== stage.stageOrder),
        updatedStage
      ];
      return newStageInfo.sort((a, b) => a.stageOrder - b.stageOrder);
    });
  };

  const switchStagesOrdering = (stage: Stage) => {
    setError('');
    setStages((currStages) => {
      const currStageIndex = currStages.findIndex((s) => s.stageOrder === stage.stageOrder);
      const newStageInfo = [
        ...currStages.filter(
          (s) =>
            s.stageOrder !== currStages[currStageIndex].stageOrder &&
            s.stageOrder !== currStages[currStageIndex].stageOrder - 1
        )
      ];
      const movingUpStage = { ...currStages[currStageIndex] };
      movingUpStage.stageOrder = movingUpStage.stageOrder - 1;
      newStageInfo.push(movingUpStage);
      const movingDownStage = { ...currStages[currStageIndex - 1] };
      movingDownStage.stageOrder = movingDownStage.stageOrder + 1;
      newStageInfo.push(movingDownStage);
      return newStageInfo.sort((a, b) => a.stageOrder - b.stageOrder);
    });
  };

  const addStage = (stage: Stage) => {
    setError('');
    setStages((currStages) => {
      if (currStages.length === 5) {
        setError('Maximum number of stages reached.');
        return currStages;
      }
      const currStageIndex = currStages.findIndex((s) => s.stageOrder === stage.stageOrder);
      if (currStageIndex + 1 === currStages.length)
        return [
          ...currStages,
          {
            title: 'New Stage',
            stageOrder: currStages.length + 1,
            color: 'bg-green-500'
          }
        ];
      const newStageInfo = [
        ...currStages.filter((s) => s.stageOrder <= currStages[currStageIndex].stageOrder)
      ];
      newStageInfo.push({
        title: 'New Stage',
        stageOrder: currStages[currStageIndex].stageOrder + 1,
        color: 'bg-green-500'
      });
      let stageIndex = currStageIndex + 1;
      while (stageIndex < currStages.length) {
        const updatedStage = { ...currStages[stageIndex] };
        updatedStage.stageOrder = updatedStage.stageOrder + 1;
        newStageInfo.push(updatedStage);
        stageIndex++;
      }
      return newStageInfo.sort((a, b) => a.stageOrder - b.stageOrder);
    });
  };

  const removeStage = (stage: Stage) => {
    setError('');
    setStages((currStages) => {
      if (currStages.length === 2) {
        setError('Must have a minimum of 2 stages.');
        return currStages;
      }
      const currStageIndex = currStages.findIndex((s) => s.stageOrder === stage.stageOrder);
      if (currStageIndex + 1 === currStages.length)
        return [...currStages.filter((s) => s.stageOrder !== stage.stageOrder)];
      const newStageInfo = [
        ...currStages.filter((s) => s.stageOrder < currStages[currStageIndex].stageOrder)
      ];
      let stageIndex = currStageIndex + 1;
      while (stageIndex < currStages.length) {
        const updatedStage = { ...currStages[stageIndex] };
        updatedStage.stageOrder = updatedStage.stageOrder - 1;
        newStageInfo.push(updatedStage);
        stageIndex++;
      }
      return newStageInfo.sort((a, b) => a.stageOrder - b.stageOrder);
    });
  };

  const onSaveClick = () => {
    if (boardName.length === 0) {
      return setError('Please enter a board name.');
    }
    dispatch(submitBoard(boardName, stages));
    close();
  };

  const onCancelClick = () => {
    setBoardName('');
    setStages(initStages);
    setError('');
    close();
  };

  return (
    <>
      <input className="modal-toggle" checked={checked} readOnly type="checkbox" />
      <div className="modal">
        <div className="modal-box !min-w-[650px] p-0">
          <div className="w-full relative justify-center bg-primary rounded-t-lg p-1 "></div>
          <div className="flex flex-col w-full items-center p-4">
            <input
              className={`text-center max-w-sm ${inputStyles}`}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Board Name"
              type="text"
              value={boardName}
            />
            <p className="text-xl font-bold uppercase mt-2">Stages</p>
            {stages.map((stage, i) => (
              <div key={stage.stageOrder} className="flex flex-row items-center w-full max-w-xl">
                <ColorPicker
                  color={stage.color}
                  updateColor={(color: string) => updateStageSetting(stage, 'color', color)}
                />
                <input
                  className={inputStyles}
                  onChange={(e) => updateStageSetting(stage, 'title', e.target.value)}
                  type="text"
                  value={stage.title}
                />
                <div className="tooltip font-bold" data-tip="Move Up">
                  <FaArrowUp
                    className="mx-2 cursor-pointer hover:text-primary"
                    size={36}
                    onClick={() => {
                      if (i !== 0) {
                        switchStagesOrdering(stage);
                      }
                    }}
                  />
                </div>
                <div className="tooltip font-bold" data-tip="Move Down">
                  <FaArrowDown
                    className="mx-2 cursor-pointer hover:text-primary"
                    size={36}
                    onClick={() => {
                      if (i + 1 !== stages.length) {
                        switchStagesOrdering(stages[i + 1]);
                      }
                    }}
                  />
                </div>
                <div className="tooltip font-bold" data-tip="Add Below">
                  <MdOutlineAddCircle
                    className="cursor-pointer text-green-500 mx-2 "
                    onClick={() => addStage(stage)}
                    size={36}
                  />
                </div>
                <div className="tooltip font-bold" data-tip="Delete">
                  <MdDelete
                    className="cursor-pointer text-red-500 mx-2"
                    onClick={() => removeStage(stage)}
                    size={36}
                  />
                </div>
              </div>
            ))}
            <p className="text-xl text-center mx-4 mt-4">{messages.newBoardMessage}</p>
            {error.length > 0 ? (
              <div className="mt-4">
                <p className="text-xl text-red-500 font-bold">{error}</p>
              </div>
            ) : null}
            <div className="modal-action">
              <label className="btn bg-red-500 text-white w-20 border-none" onClick={onCancelClick}>
                Cancel
              </label>
              <label className="btn bg-green-500 text-white w-20 border-none" onClick={onSaveClick}>
                Save
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardForm;
