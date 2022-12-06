import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { MdDelete, MdOutlineAddCircle } from 'react-icons/md';
import { initStages } from '../../../const/initData';
import { useAppDispatch } from '../../../hooks';
import { Stage } from '../../../models/Stage.model';
import { submitBoard } from '../../../store/reducers/boards';
import ColorPicker from '../../ColorPicker';

const BoardForm = () => {
  const [boardName, setBoardName] = useState<string>('');
  const [stages, setStages] = useState<Stage[]>(initStages);
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();

  const inputStyles =
    'input !outline-0 text-xl w-full max-w-sm my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

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
  };

  const onCancelClick = () => {
    setError('');
  };

  return (
    <>
      <input type="checkbox" id="board-form" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0 !min-w-[650px]">
          <div className="w-full relative justify-center bg-primary p-1 rounded-t-lg">
            <p className="text-2xl text-white text-center font-bold">New Board</p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
            <input
              type="text"
              placeholder="Board Name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className={`text-center ${inputStyles}`}
            />
            <p className="text-xl font-bold mt-2 uppercase">Stages</p>
            {stages.map((stage, i) => (
              <div key={stage.stageOrder} className="flex flex-row items-center w-full max-w-xl">
                <ColorPicker
                  color={stage.color}
                  updateColor={(color: string) => updateStageSetting(stage, 'color', color)}
                />
                <input
                  type="text"
                  value={stage.title}
                  onChange={(e) => updateStageSetting(stage, 'title', e.target.value)}
                  className={inputStyles}
                />
                <div className="tooltip font-bold" data-tip="Move Up">
                  <FaArrowUp
                    size={36}
                    className="mx-2 cursor-pointer hover:text-primary"
                    onClick={() => {
                      if (i !== 0) {
                        switchStagesOrdering(stage);
                      }
                    }}
                  />
                </div>
                <div className="tooltip font-bold" data-tip="Move Down">
                  <FaArrowDown
                    size={36}
                    className="mx-2 cursor-pointer hover:text-primary"
                    onClick={() => {
                      if (i + 1 !== stages.length) {
                        switchStagesOrdering(stages[i + 1]);
                      }
                    }}
                  />
                </div>
                <div className="tooltip font-bold" data-tip="Add Below">
                  <MdOutlineAddCircle
                    size={36}
                    className="mx-2 cursor-pointer text-green-500"
                    onClick={() => addStage(stage)}
                  />
                </div>
                <div className="tooltip font-bold" data-tip="Delete">
                  <MdDelete
                    size={36}
                    className="mx-2 cursor-pointer text-red-500"
                    onClick={() => removeStage(stage)}
                  />
                </div>
              </div>
            ))}
            <p className="text-xl text-center mx-4 mt-4">
              Please be mindful that at this time stage settings cannot be altered after creation.
            </p>
            {error.length > 0 && (
              <div className="mt-4">
                <p className="text-xl text-red-500 font-bold">{error}</p>
              </div>
            )}
            <div className="modal-action">
              <label
                htmlFor="board-form"
                className="btn bg-red-500 text-white w-20 border-none"
                onClick={onCancelClick}>
                Cancel
              </label>
              <label
                htmlFor="board-form"
                className="btn bg-green-500 text-white w-20 border-none"
                onClick={onSaveClick}>
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
