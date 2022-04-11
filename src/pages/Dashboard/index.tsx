import React from 'react';
import BoardCard from '../../components/BoardCard';
import BoardForm from '../../components/BoardForm';

const Dashboard = () => {
  return (
    <>
      <div className="md:w-1/3 sm:w-4/5 flex flex-col mx-auto bg-gray-100 shadow-lg items-center rounded-lg">
        <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
          <p className="text-lg text-white text-center font-bold uppercase">My Boards</p>
          <label
            className="absolute right-3 top-0 text-3xl text-white font-bold cursor-pointer"
            htmlFor="board-form">
            +
          </label>
        </div>
        <div className="w-full p-4">
          <BoardCard />
        </div>
      </div>
      <BoardForm />
    </>
  );
};

export default Dashboard;
