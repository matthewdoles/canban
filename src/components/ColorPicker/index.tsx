import React from 'react';
import { stageColors } from '../../const/stageColors';

type Props = {
  color: string;
  updateColor: (color: string) => void;
};

const ColorPicker = ({ color, updateColor }: Props) => {
  return (
    <div className="dropdown dropdown-right dropdown-end">
      <label tabIndex={0} className={`btn m-1 ${color} border-none`}>
        Color
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu flex items-center p-2 shadow bg-base-100 rounded-box w-32">
        <div className="grid grid-cols-3 grid-rows-3">
          {stageColors.map((c) => (
            <li
              key={c}
              className={`${c} h-8 w-8 rounded-none m-0 cursor-pointer`}
              onClick={() => updateColor(c)}></li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default ColorPicker;
