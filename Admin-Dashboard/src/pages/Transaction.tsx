import AdminSidebar from '../components/AdminSidebar';
import { useState, useEffect } from 'react';
// import '../styles/Addserver.scss';
import SSHTerminal from './sshTerminal';

interface Server {
  hostname: string;
  port: string;
  ipAddress: string;
}

const Transaction: React.FC = () => {
  const [hostname, setHostname] = useState<string>('');
  const [port, setPort] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [servers, setServers] = useState<Server[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [sshComponentVisible, setSshComponentVisible] =
    useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:4000/api/servers');
      const data: Server[] = await response.json();
      setServers(data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/servers', {
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

  const handleIPClick = (server: Server): void => {
    sendDataToServer(server);
    setSshComponentVisible(true);
    setSelectedServer(server);
  };

  const sendDataToServer = async (server: Server): Promise<void> => {
    try {
      const response = await fetch('http://localhost:4000/api/send-data', {
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

  const handleCloseTerminal = (): void => {
    setSshComponentVisible(false);
    setSelectedServer(null);
  };

  return (
    <div>
      {/* <div className='admin-container'> */}
      {/* <AdminSidebar /> */}
      <div className='add-server-container'>
        <h1 className='add-server-header'>
          Add Servers{' '}
          <span
            className='add-server-plus'
            onClick={() => setShowForm(!showForm)}
          >
            +
          </span>
        </h1>
        {showForm && (
          <form onSubmit={handleSubmit} className='add-server-form'>
            <label>
              Host name:
              <input
                type='text'
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
              />
            </label>
            <label>
              Port Number:
              <input
                type='text'
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </label>
            <label>
              IP Address:
              <input
                type='text'
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <input type='submit' value='Save' />
          </form>
        )}
      </div>
      {formSubmitted || <div className='horizontal-line'></div>}
      {servers.map((server, index) => (
        <div key={index} className='server-container'>
          <h2>Host name: {server.hostname}</h2>
          <h3>Port Number: {server.port} </h3>
          <h3>
            IP Address:{' '}
            <span
              className='Ip'
              onClick={() => handleIPClick(server)}
              style={{ cursor: 'pointer' }}
            >
              {server.ipAddress}
            </span>
          </h3>
          {sshComponentVisible &&
            selectedServer &&
            selectedServer.ipAddress === server.ipAddress && (
              <button
                className='ssh-component-close-button'
                onClick={handleCloseTerminal}
              >
                Close SSH Terminal
              </button>
            )}
        </div>
      ))}
      {formSubmitted || <div className='horizontal-line'></div>}
      {sshComponentVisible && selectedServer && (
        <div className='ssh-component'>
          <SSHTerminal server={selectedServer} onClose={handleCloseTerminal} />
        </div>
      )}
    </div>
  );
};

export default Transaction;
