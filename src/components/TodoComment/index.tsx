import React from 'react';

type Props = {
  author: string;
  comment: string;
  date: string;
  profilePic: string;
};

const TodoComment = ({ author, comment, date, profilePic }: Props) => {
  return (
    <div className="flex flex-row">
      <div className="avatar placeholder m-2">
        <div className="w-10 h-10 rounded-full bg-blue-500">
          {profilePic.length === 0 ? (
            <span className="text-xl text-white font-bold">{author.charAt(0)}</span>
          ) : (
            <img src={profilePic} />
          )}
        </div>
      </div>
      <div className="flex flex-col mx-4">
        <div className="flex flex-row">
          <p className="font-bold mr-4">{author}</p>
          <p className="text-gray-400">{date}</p>
        </div>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default TodoComment;
