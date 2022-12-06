import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { BoardSettings } from '../../../models/BoardSettings.model';
import { Stage } from '../../../models/Stage.model';

import { Todo } from '../../../models/Todo.model';
import TodoCard from '../TodoCard';

type Props = {
  archivedTodos: Todo[];
  board: BoardSettings;
  updateActiveTodo: (todo: Todo) => void;
};

const ArchiveTodos = ({ archivedTodos, board, updateActiveTodo }: Props) => {
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [archivedCount, setArchivedCount] = useState<number>(0);

  useEffect(() => {
    setArchivedCount(archivedTodos.length);
    if (board.stages.length > 0) setSelectedStage(board.stages[board.stages.length - 1].title);
  }, [archivedTodos, board]);

  return (
    <div className="collapse bg-accent m-2">
      <input type="checkbox" />
      <div className="collapse-title flex items-center">
        <MdAdd size={28} color="white" />
        <p className="text-xl text-white font-bold mx-4">Archive</p>
        <p className="text-xl text-white font-bold opacity-60">({archivedCount})</p>
      </div>
      <div className="collapse-content">
        <div className="flex">
          {board.stages.map((stage: Stage, i: number) => (
            <p
              key={i}
              onClick={() => setSelectedStage(stage.title)}
              className={`text-lg text-white capitalize mx-2 cursor-pointer btn btn-sm border-none ${
                selectedStage === stage.title ? `${stage.color} text-white` : 'btn-ghost'
              }`}>
              {stage.title}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {archivedTodos?.map((todo: Todo) => {
            if (todo.stage === selectedStage) {
              return (
                <div key={todo.id}>
                  <TodoCard
                    color={
                      board.stages.find((stage: Stage) => {
                        return stage.title === todo.stage;
                      })?.color || 'bg-blue-500'
                    }
                    clicked={(todo) => updateActiveTodo(todo)}
                    disabled={true}
                    todo={todo}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default ArchiveTodos;
