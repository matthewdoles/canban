import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Column from '../../components/Column';
import TodoDetail from '../../components/TodoDetail.tsx';
import { sampleTodos } from '../../const/sampleData';
import { getBoard } from '../../functions/db';
import { BoardSettings } from '../../models/BoardSettings';
import { Todo } from '../../models/Todo.model';

const Board = () => {
  const [activeTodo, setActiveTodo] = useState<Todo>({
    boardId: '',
    id: 0,
    stage: 'None',
    description: '',
    title: ''
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [boardSettings, setBoardSettings] = useState<BoardSettings>();
  const { id } = useParams();

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => setBoardSettings(await getBoard(id || '0'));

  return (
    <div className="drawer drawer-end">
      <input id="todo-detail-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8">
        <div className="flex flex-row w-full">
          {boardSettings?.stages.map((stage) => (
            <Column
              key={stage.title}
              activeTodo={activeTodo}
              activeHoverColumn={activeHoverColumn}
              allStages={boardSettings.stages}
              boardId={boardSettings.id || ''}
              color={stage.color}
              isDragging={isDragging}
              stage={stage.title}
              stageNumber={stage.stageOrder}
              todos={todos.filter((todo) => todo.stage === stage.title)}
              updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
              updateBoardTodos={(updatedTodo: Todo) => {
                setTodos((prevTodos: Todo[]) => {
                  const newTodos = [...prevTodos.filter((t) => t.id !== updatedTodo.id)];
                  newTodos.push(updatedTodo);
                  return newTodos;
                });
              }}
            />
          ))}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="todo-detail-drawer" className="drawer-overlay"></label>
        {boardSettings && <TodoDetail allStages={boardSettings.stages} todo={activeTodo} />}
      </div>
    </div>
  );
};

export default Board;
