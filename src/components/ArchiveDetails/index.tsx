import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useAppSelector } from '../../hooks';
import { Archive } from '../../models/Archive.model';
import { Stage } from '../../models/Stage.model';
import { Todo } from '../../models/Todo.model';
import TodoCard from '../TodoCard';

type Props = {
  updateActiveTodo: (todo: Todo) => void;
};

const ArchiveDetails = ({ updateActiveTodo }: Props) => {
  const activeBoard = useAppSelector((state) => state.boards.activeBoard);
  const archivedData = useAppSelector((state) => state.boards.activeBoardArchive);
  const [selectedStage, setSelectedStage] = useState<string>(activeBoard?.stages[0].title);
  const [archivedCount, setArchivedCount] = useState<number>(0);
  const [archivedTodos, setArchivedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    let count = 0;
    const todos: Todo[] = [];
    archivedData.forEach((archiveRecord: Archive) => {
      if (archiveRecord.todos) {
        count += archiveRecord.todos.length;
        archiveRecord.todos.forEach((todo) => todos.push(todo));
      }
    });
    setArchivedCount(count);
    setArchivedTodos(todos);
  }, [archivedData]);

  return (
    <div tabIndex={0} className="collapse bg-gray-100 m-2">
      <input type="checkbox" />
      <div className="collapse-title flex">
        <MdAdd size={28} />
        <p className="text-xl font-bold mx-2">Archive</p>
        <p className="text-xl opacity-25 font-bold">({archivedCount})</p>
      </div>
      <div className="collapse-content">
        <div className="flex">
          {activeBoard?.stages.map((stage: Stage, i: number) => (
            <p
              key={i}
              onClick={() => setSelectedStage(stage.title)}
              className={`text-lg capitalize mx-2 cursor-pointer btn btn-sm border-none ${
                selectedStage === stage.title ? `${stage.color} text-white` : 'btn-ghost'
              }`}>
              {stage.title}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {archivedTodos?.map((todo: Todo) => {
            if (todo.stage === selectedStage) {
              return (
                <div key={todo.id}>
                  <TodoCard
                    color={
                      activeBoard?.stages.find((stage: Stage) => {
                        return stage.title === todo.stage;
                      })?.color
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

export default ArchiveDetails;
