import './Controls.css';

const Controls = (): JSX.Element => {
  const play = () => {
    console.log('')
  };

  const prev = () => {
    console.log('')
  };

  const next = () => {
    console.log('')
  };

  const shuffle = () => {
    console.log('')
  };

  const repeat = () => {
    console.log('')
  };
  
  return  (
    <div className="controls">
      <i id="shuffle" className="fa fa-random" onClick={shuffle} ></i>
      <i id="prev" className="fa fa-step-backward" onClick={prev} ></i>
      <i id="play" className="fa fa-play" onClick={play} ></i>
      <i id="next" className="fa fa-step-forward" onClick={next} ></i>
      <i id="repeat" className="fa fa-refresh" onClick={repeat} ></i>
    </div>
  );
};

export default Controls;