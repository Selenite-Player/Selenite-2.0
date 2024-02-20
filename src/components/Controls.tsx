import './Controls.css';
const { ipcRenderer } = window.require('electron');

type ControlsProps = {
  repeatState: string,
  shuffleState: boolean,
  isPlaying: boolean,
  setShowDevices: React.Dispatch<React.SetStateAction<boolean>>,
  showDevices: boolean
}

const Controls = ({ repeatState, shuffleState, isPlaying, setShowDevices, showDevices}: ControlsProps): JSX.Element => {
  const repeatOptions = ["off", "track", "context"];

  const play = () => {
    const message = isPlaying ? "pause" : "play";
    ipcRenderer.send(message);
  };

  const previous = () => {
    ipcRenderer.send('previous-song');
  };

  const next = () => {
    ipcRenderer.send('next-song');
  };

  const shuffle = () => {
    ipcRenderer.send('shuffle', !shuffleState);
  };

  const repeat = () => {
    const optionId = repeatOptions.indexOf(repeatState);
    const newId = (optionId >= repeatOptions.length-1) ? 0 : optionId + 1;

    ipcRenderer.send('repeat', repeatOptions[newId]);
  };

  const showDevicesPopover = () => {
    setShowDevices(!showDevices);
  };

  const getRepeatClassName = () => {
    switch(repeatState){
      case 'track':
        return 'fa fa-repeat active'
      case 'context':
        return 'fa fa-refresh active'
      case 'off':
        return 'fa fa-repeat'
    }
  };
  
  return  (
    <div id="controls">
      <i 
        id="shuffle" 
        aria-label="shuffle" 
        className={`fa fa-random ${shuffleState ? "active" : ""}` } 
        onClick={shuffle} >
      </i>
      <i id="previous" 
        aria-label="previous"
        className="fa fa-step-backward" 
        onClick={previous} >
      </i>
      <i 
        id="play" 
        aria-label="play"
        className={`fa ${isPlaying ? "fa-pause" : "fa-play"}`} 
        onClick={play} >
      </i>
      <i 
        id="next" 
        aria-label="next"
        className="fa fa-step-forward" 
        onClick={next} >
      </i>
      <i 
        id="repeat" 
        aria-label="repeat"
        className={getRepeatClassName()} 
        onClick={repeat} >
      </i>
      <i 
        id="devices" 
        aria-label="devices"
        className="fa fa-mobile"
        onClick={showDevicesPopover} >
      </i>
    </div>
  );
};

export default Controls;