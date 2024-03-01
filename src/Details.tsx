import './Details.css';
/* import { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron'); */

const sampleData = [{
    img: "../assets/pfp.png",
    title: "A Message to Myself - Mahogany Sessions",
    artist: "Roo Panes",
    duration: 180000+25000
  },
  {
    img: "../assets/pfp.png",
    title: "This Too Shall Pass",
    artist: "Parables and Primes",
    duration: 290000+25000
  }
]

const ListItem = ({track, num}: any) => {
  const time = new Date(track.duration);

  return (
    <div className="details-table-item">
      <p className='details-list-number'>{num}</p>
      <p className='details-list-title'>
        <img src="../assets/pfp.png" alt="" />
        {track.title}
      </p>
      <p className='details-list-artist'>{track.artist}</p>
      <p className='details-list-duration'>{`${time.getMinutes()}:${time.getSeconds()}`}</p>
    </div>
  )
}

const Details = () => {
  /* useEffect(() => {
    ipcRenderer.on('update-context', (e, context) => {
      
    })
  },[]);

  const closeDetails = () => {
    ipcRenderer.send('close-details');
  }; */

  return (
    <div id="details-window">
      <div id="title-wrapper">
        <img src="../assets/pfp.png" alt="" />
        <div id="title-text">
          <p id="details-title">This is a very long title but with reasonable words that aren't endlessly long</p>
          <p id="details-info">27 songs, 2hr 11min</p>
        </div>
      </div>
      <div id="details-content">
        <div id="details-table-header">
          <p className='details-list-number'>#</p>
          <p className='details-list-title'>Title</p>
          <p className='details-list-artist'>Artist</p>
          <p className='details-list-duration'><i className='fa fa-clock-o'/></p>
        </div>
        {sampleData.map((item, i) => 
          <ListItem key={i} track={item} num={i+1} />
        )}
      </div>
    </div>
  )
};

export default Details;