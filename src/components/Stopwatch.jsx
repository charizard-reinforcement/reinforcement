import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 10), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);

  const formatNumber = (num, digits) => num.toString().padStart(digits, '0');

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="flex items-center space-x-2">
        <Timer className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-semibold text-gray-800">Google Stopwatch</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 w-80">
        <div className="text-5xl font-bold text-center mb-8 font-mono tracking-wider">
          <span className="text-blue-500">{formatNumber(hours, 2)}</span>
          <span className="text-red-500">:</span>
          <span className="text-yellow-500">{formatNumber(minutes, 2)}</span>
          <span className="text-red-500">:</span>
          <span className="text-green-500">{formatNumber(seconds, 2)}</span>
          <span className="text-red-500">.</span>
          <span className="text-blue-500">{formatNumber(milliseconds, 2)}</span>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartStop}
            className={`${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white p-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${
              isRunning ? 'red' : 'green'
            }-500`}
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}