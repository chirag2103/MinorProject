import React, { useState, useEffect} from 'react';
import './AddServer.css';
import SSHTerminal from './sshTerminal';


const AddServer = () => {
  const [hostname, setHostname] = useState('');
  const [port, setPort] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [password, setPassword] = useState('');
  const [servers, setServers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sshComponentVisible, setSshComponentVisible] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/servers');
      const data = await response.json();
      setServers(data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostname, port, ipAddress, password }),
      });
      if (response.ok) {
        setFormSubmitted(true);
        setHostname('');
        setPort('');
        setIpAddress('');
        setPassword('');
        setShowForm(false);
        fetchServers();
      } else {
        console.error('Failed to add server:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };

  const handleIPClick = (server) => {
    sendDataToServer(server);
    setSshComponentVisible(true);
    setSelectedServer(server);
  };

  const sendDataToServer = async (server) => {
    try {
      const response = await fetch('http://localhost:3001/api/send-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(server),
      });
      if (!response.ok) {
        console.error('Failed to send data to server:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  const handleCloseTerminal = () => {
    setSshComponentVisible(false);
    setSelectedServer(null);
  };

  return (
    <div>
      <div className="add-server-container">
        <h1 className="add-server-header">
          Add Servers <span className="add-server-plus" onClick={() => setShowForm(!showForm)}>+</span>
        </h1>
        {showForm && (
          <form onSubmit={handleSubmit} className="add-server-form">
            <label>
              Host name:
              <input type="text" value={hostname} onChange={e => setHostname(e.target.value)} />
            </label>
            <label>
              Port Number:
              <input type="text" value={port} onChange={e => setPort(e.target.value)} />
            </label>
            <label>
              IP Address:
              <input type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <input type="submit" value="Save" />
          </form>
        )}
      </div>
      {formSubmitted || <div className="horizontal-line"></div>}
      {servers.map((server, index) => (
        <div key={index} className="server-container">
          <h2>Host name: {server.hostname}</h2>
          <h3>Port Number: {server.port} </h3>
          <h3>IP Address: <span className='Ip' onClick={() => handleIPClick(server)} style={{ cursor: 'pointer' }}>{server.ipAddress}</span></h3>
          {sshComponentVisible && selectedServer && selectedServer.ipAddress === server.ipAddress && (
            <button className="ssh-component-close-button" onClick={handleCloseTerminal}>Close SSH Terminal</button>
          )}
        </div>
      ))}
      {formSubmitted || <div className="horizontal-line"></div>}
      {sshComponentVisible && selectedServer && (
        <div className="ssh-component">
          <SSHTerminal server={selectedServer} onClose={handleCloseTerminal} />
        </div>
      )}
    </div>
  );
};

export default AddServer;
