import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import ansiRegex from 'ansi-regex';

const SSHTerminal = () => {
    const [input, setInput] = useState('');
    const [outputLines, setOutputLines] = useState([]);
    const inputRef = useRef(null);
    const outputRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = socketIOClient('http://localhost:3001');

        socketRef.current.on('output', (data) => {
            const cleanData = data.replace(ansiRegex(), ''); 
            setOutputLines(prevLines => [...prevLines, cleanData]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [outputLines]);

    useEffect(() => {
        const handleKeyDown = (event) => {
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

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (trimmedInput !== '') {
            if (socketRef.current && socketRef.current.connected) {
                if (trimmedInput === 'clear') {
                    clearScreen();
                } else {
                    socketRef.current.emit('command', trimmedInput, (error) => {
                        if (error) {
                            console.error('Error emitting event:', error);
                        } else {
                            console.log('Event emitted successfully');
                        }
                    });
                }
                setInput('');
                inputRef.current.focus();
            } else {
                console.error('Socket connection is not established.');
            }
        }
    };

    const clearScreen = () => {
        setOutputLines([]);
        socketRef.current.emit('command', 'clear');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleFormSubmit(e);
        }
    };

    const handleCtrlC = () => {
        socketRef.current.emit('command', 'ctrl_c');
    };

    const handleCtrlX = () => {
        socketRef.current.emit('command', 'ctrl_x');
    };

    const handleCtrlS = () => {
        socketRef.current.emit('command', 'ctrl_s');
    };


    return (
        <div className="ssh-terminal">
            <div className="ssh-header">
                <h1 className="ssh-title">SSH Web Console</h1>

            </div>
            <div className="output-container" ref={outputRef}>
                {outputLines.map((line, index) => (
                    <div key={index} className="output-line">{line}</div>
                ))}
                <form onSubmit={handleFormSubmit}>
                    <input
                        ref={inputRef}
                        className="input"
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command..."
                    />
                </form>
            </div>
        </div>
    );
};

export default SSHTerminal;
