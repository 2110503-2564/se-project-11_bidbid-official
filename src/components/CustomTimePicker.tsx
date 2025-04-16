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
    <div className="bg-white p-6 rounded shadow flex gap-2 items-center">
      <input
        type="number"
        value={hour}
        min={8}
        max={17}
        onChange={handleHourChange}
        className="w-20 p-2 border rounded text-center"
      />

      <span className="text-xl">:</span>

      <select
        value={minute}
        onChange={handleMinuteChange}
        className="w-20 p-2 border rounded text-center"
      >
        <option value={0}>00</option>
        <option value={30}>30</option>
      </select>
    </div>
  );
}
