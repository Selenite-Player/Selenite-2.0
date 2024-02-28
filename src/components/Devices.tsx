import { useState, useEffect } from "react";

import './Devices.css';
const { ipcRenderer } = window.require('electron');

const Devices = ({show, setShowDevices}: {show: boolean, setShowDevices: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    ipcRenderer.send('get-devices');
    ipcRenderer.on('update-devices', (e, data) => {
      setDevices(data);
    });
  }, []);

  useEffect(() => {
    if(show){
      ipcRenderer.send('get-devices');
    }
  }, [show]);

  const changeDevice = (id: string) => {
    ipcRenderer.send('change-device', id);
    setShowDevices(false);
  };

  return (
    <div id="device-popover" >
      <ul>
        { devices.map(device => 
          <li 
            className={device.is_active ? 'selected' : ''}
            key={device.id}
            onClick={() => changeDevice(device.id)}
          >
            {device.name}
          </li>
        )}
      </ul>
    </div>
  )
};

export default Devices;