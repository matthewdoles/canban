import React from 'react';
import Moment from 'react-moment';

type Props = {
  author: string;
  comment: string;
  date: number;
  profilePic?: string;
};

const TodoComment = ({ author, comment, date, profilePic }: Props) => {
  return (
    <div className="flex flex-row">
      <div className="avatar placeholder m-2">
        <div className="w-10 h-10 rounded-full bg-primary">
          {profilePic ? (
            <img src={profilePic} />
          ) : (
            <span className="text-xl text-white font-bold">{author.charAt(0)}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col mx-4">
        <div className="flex flex-row">
          <p className="font-bold mr-4">{author}</p>
          <Moment format="MM/DD/YY, h:mm a">{date}</Moment>
        </div>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default TodoComment;
