import './TimeRange.css';
import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

type TimeRangeProps = {
  progress: number,
  duration: number
}

const TimeRange = ({progress, duration}: TimeRangeProps) => {
  const [value, setValue] = useState(`${progress}`);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if(!seeking) {
      setValue(`${progress}`);
    }
  }, [progress]); // eslint-disable-line

  const seek = () => {
    ipcRenderer.send('seek', value);
    setTimeout(() => setSeeking(false), 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeeking(true);
    setValue(e.target.value);
  };

  return (
    <input 
      id="time-range"
      aria-label="time-range"
      className="time-range" 
      type="range" 
      value={value}
      max={duration}
      onChange={(e) => handleChange(e)}
      onMouseUp={seek}
    />
  )
};

export default TimeRange;