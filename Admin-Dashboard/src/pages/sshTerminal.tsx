import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
} from 'react';
import io, { Socket } from 'socket.io-client'; // Import the socket.io-client library
import ansiRegex from 'ansi-regex';

interface Server {
  hostname: string;
  port: string;
  ipAddress: string;
}

interface SSHTerminalProps {
  server: Server; // Define the type for the 'server' prop
  onClose: () => void; // Define the type for the 'onClose' prop
}

const SSHTerminal: React.FC<SSHTerminalProps> = ({ server, onClose }) => {
  const [input, setInput] = useState<string>('');
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null); // Define the socketRef with SocketIOClient.Socket type

  useEffect(() => {
    socketRef.current = io('http://localhost:4000'); // Initialize the socket connection

    socketRef.current.on('output', (data: string) => {
      const cleanData = data.replace(ansiRegex(), '');
      setOutputLines((prevLines) => [...prevLines, cleanData]);
      // setOutputLines((prevLines) => [...prevLines, data]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputLines]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        handleCtrlC();
        event.preventDefault();
      }
      if (event.ctrlKey && event.key === 'x') {
        handleCtrlX();
        event.preventDefault();
      }
      if (event.ctrlKey && event.key === 's') {
        handleCtrlS();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput !== '') {
      if (socketRef.current && socketRef.current.connected) {
        if (trimmedInput === 'clear') {
          clearScreen();
        } else {
          await socketRef.current.emit(
            'command',
            trimmedInput,
            (error: any) => {
              if (error) {
                console.error('Error emitting event:', error);
              } else {
                console.log('Event emitted successfully');
              }
            }
          );
        }
        setInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        console.error('Socket connection is not established.');
      }
    }
  };

  const clearScreen = () => {
    setOutputLines([]);
    if (socketRef.current) {
      socketRef.current.emit('command', 'clear');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFormSubmit(e);
    }
  };

  const handleCtrlC = () => {
    if (socketRef.current) {
      socketRef.current.emit('command', 'ctrl_c');
    }
  };

  const handleCtrlX = () => {
    if (socketRef.current) {
      socketRef.current.emit('command', 'ctrl_x');
    }
  };

  const handleCtrlS = () => {
    if (socketRef.current) {
      socketRef.current.emit('command', 'ctrl_s');
    }
  };

  return (
    <div className='ssh-terminal'>
      <div className='ssh-header'>
        <h1 className='ssh-title'>SSH Web Console</h1>
      </div>
      <div className='output-container' ref={outputRef}>
        {outputLines.map((line, index) => (
          <div key={index} className='output-line'>
            {line.trim()}
          </div>
        ))}
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            className='input'
            type='text'
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder='Type a command...'
          />
        </form>
      </div>
    </div>
  );
};

export default SSHTerminal;
