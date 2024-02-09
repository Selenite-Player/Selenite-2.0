import './TimeRange.css';
const { ipcRenderer } = window.require('electron');

type TimeRangeProps = {
  progress: number,
  duration: number
}

const TimeRange = ({progress, duration}: TimeRangeProps) => {
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    ipcRenderer.send('seek', e.target.value);
  }

  return (
    <input 
      id="time-range"
      aria-label="time-range"
      className="time-range" 
      type="range" 
      value={progress}
      max={duration}
      onChange={(e) => seek(e)}
    />
  )
};

export default TimeRange;