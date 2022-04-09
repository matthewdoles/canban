import React from 'react';
import BoardCard from '../../components/BoardCard';

const Dashboard = () => {
  return (
    <div className="flex flex-col p-8 mx-auto items-center">
      <p className="text-2xl text-white font-bold uppercase">My Boards</p>
      <button className="btn w-36 mt-4 mb-2 bg-blue-500 border-none">New Board</button>
      <div className="w-3/4 lg:w-1/3">
        <BoardCard />
      </div>
    </div>
  );
};

export default Dashboard;
