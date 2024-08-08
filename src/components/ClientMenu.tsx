import './ClientMenu.css';
import { useState } from "react";
const { ipcRenderer } = window.require('electron');

const ClientMenu = () => {
  const [id, setId] = useState("");
  const [warning, setWarning] = useState(false);

  function saveId() {
    ipcRenderer.send("add-client-id", id);
  };

  ipcRenderer.on('client-error', () => {
    setWarning(true);
  });

  return (
    <div className="menu-input">
      <p>Please enter your <a href="https://developer.spotify.com/documentation/general/guides/authorization/app-settings/" target="_blank" rel="noreferrer" >Spotify Client ID</a> here</p>
      <input type="text" placeholder="Client ID" value={id} onChange={(event) => setId(event.target.value)}/>
      <p className={`warning ${warning ? "show" : ""}`}>The client id you provided is invalid</p>
      <button className="menu-save-btn" onClick={saveId}>Save</button>
    </div>
  );
};

export default ClientMenu;