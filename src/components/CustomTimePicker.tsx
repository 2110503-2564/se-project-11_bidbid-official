"use client";

import { useState } from "react";

export default function CustomTimePicker() {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = parseInt(e.target.value);
    if (newHour < 8) newHour = 8;
    if (newHour > 17) newHour = 17;
    setHour(newHour);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinute(parseInt(e.target.value));
  };

  const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="bg-white w-full max-w-[300px] h-[40px] rounded flex items-center gap-2">
      <input
        type="number"
        value={hour}
        min={8}
        max={17}
        onChange={handleHourChange}
        className="w-[60px] h-full text-sm text-center focus:outline-none rounded border border-gray-300"
      />

      <span className="text-sm">:</span>

      <select
        value={minute}
        onChange={handleMinuteChange}
        className="w-[60px] h-full text-sm text-center focus:outline-none rounded border border-gray-300"
      >
        <option value={0}>00</option>
        <option value={30}>30</option>
      </select>
    </div>
  );
}
