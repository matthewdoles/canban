import React, { useState } from 'react';
import ColorPicker from '../ColorPicker';
import { BoardSettings } from '../../models/BoardSettings';
import { Stage } from '../../models/Stage';

type Props = {
  addNewBoard: (board: BoardSettings) => void;
};

const BoardForm = ({ addNewBoard }: Props) => {
  const [boardName, setBoardName] = useState<string>('Board Name');
  const [stages, setStages] = useState<Stage[]>([
    { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
    { title: 'In Progress', color: 'bg-yellow-400', stageOrder: 2 },
    { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
  ]);
  return (
    <>
      <input type="checkbox" id="board-form" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0">
          <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
            <p className="text-xl text-white text-center font-bold uppercase">New Board</p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="input !outline-0 text-lg w-full max-w-sm my-4 border-x-transparent border-t-transparent rounded-none border-b-2 mr-2 border-gray-200"
            />
            <p className="text-xl font-bold mt-2 uppercase">Stages</p>
            {stages.map((stage) => (
              <div key={stage.stageOrder} className="flex flex-row items-center w-full max-w-sm">
                <input
                  type="text"
                  value={stage.title}
                  onChange={(e) =>
                    setStages((currStages) => {
                      const currStageIndex = currStages.findIndex(
                        (s) => s.stageOrder == stage.stageOrder
                      );
                      const newStage = currStages[currStageIndex];
                      newStage.title = e.target.value;
                      const newStageInfo = [
                        ...currStages.filter((s) => s.stageOrder !== stage.stageOrder),
                        newStage
                      ];
                      return newStageInfo.sort((a, b) => a.stageOrder - b.stageOrder);
                    })
                  }
                  className="input w-full !outline-0 text-lg  my-4 border-x-transparent border-t-transparent rounded-none border-b-2 mr-2 border-gray-200"
                />
                <ColorPicker
                  color={stage.color}
                  updateColor={(color: string) =>
                    setStages((currStages) => {
                      const currStageIndex = currStages.findIndex(
                        (s) => s.stageOrder == stage.stageOrder
                      );
                      const newStage = currStages[currStageIndex];
                      newStage.color = color;
                      const newStageInfo = [
                        ...currStages.filter((s) => s.stageOrder !== stage.stageOrder),
                        newStage
                      ];
                      return newStageInfo.sort((a, b) => a.stageOrder - b.stageOrder);
                    })
                  }
                />
              </div>
            ))}
            <div className="modal-action">
              <label htmlFor="board-form" className="btn bg-red-500 w-20 border-none">
                Cancel
              </label>
              <label
                htmlFor="board-form"
                className="btn bg-green-500 w-20 border-none"
                onClick={() => addNewBoard({ boardName, stages })}>
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
