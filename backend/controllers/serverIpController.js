import { Client } from 'ssh2';
import catchAsyncError from '../middleware/catchAsyncError.js';
import Server from '../models/serverIpModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendToken } from '../utils/jwtToken.js';
import { io } from '../server.js';
function sendCtrlC(shellStream) {
  if (shellStream) {
    shellStream.write('\x03');
  } else {
    console.log('SSH connection not established.');
  }
}

function sendCtrlX(shellStream) {
  if (shellStream) {
    shellStream.write('\x18');
  } else {
    console.log('SSH connection not established.');
  }
}

function sendCtrlS(shellStream) {
  if (shellStream) {
    shellStream.write('\x13');
  } else {
    console.log('SSH connection not established.');
  }
}

export const createServerIp = catchAsyncError(async (req, res, next) => {
  const server = new Server(req.body);
  await server.save();
  sendToken(server, 201, res);
});

export const getServerIp = catchAsyncError(async (req, res, next) => {
  const servers = await Server.find();
  if (!servers) {
    return next(new ErrorHandler('Error retriving information', 401));
  }
  res.send(servers);
});

const getData = catchAsyncError(async (req, res, next) => {
  const { ipAddress, port, hostname, password } = req.body;
  console.log(req.body);
  const numericPort = parseInt(port, 10);
  console.log(ipAddress, port, hostname, password);

  const conn = new Client();
  conn
    .on('ready', () => {
      conn.shell((err, stream) => {
        if (err) {
          console.error('SSH shell error:', err);
          return res.status(500).send('SSH shell error');
        }

        stream.on('data', (data) => {
          io.emit('output', data.toString());
        });

        io.on('connection', (socket) => {
          socket.on('command', (command) => {
            console.log('Received command:', command);
            if (stream && stream.writable) {
              if (command === 'ctrl_c') {
                sendCtrlC(stream);
              } else if (command === 'ctrl_x') {
                sendCtrlX(stream);
              } else if (command === 'ctrl_s') {
                sendCtrlS(stream);
              } else {
                try {
                  stream.write(`${command}\n`);
                } catch (error) {
                  console.error('Error writing to stream:', error);
                }
              }
            } else {
              console.error('Stream is not available or not writable.');
            }
          });
        });
      });
    })
    .connect({
      host: ipAddress,
      port: numericPort,
      username: hostname,
      password: password,
    });
  console.log('Connection');

  res.status(200).send('SSH connection established');
});

export const sendData = catchAsyncError(async (req, res, next) => {
  try {
    const { ipAddress, port, hostname, password } = req.body;
    console.log(req.body);
    const numericPort = parseInt(port, 10);
    console.log(ipAddress, port, hostname, password);

    const conn = new Client();
    conn
      .on('ready', () => {
        conn.shell((err, stream) => {
          if (err) {
            console.error('SSH shell error:', err);
            return res.status(500).send('SSH shell error');
          }

          stream.on('data', (data) => {
            io.emit('output', data.toString());
          });

          io.on('connection', (socket) => {
            socket.on('command', (command) => {
              console.log('Received command:', command);
              if (stream && stream.writable) {
                if (command === 'ctrl_c') {
                  sendCtrlC(stream);
                } else if (command === 'ctrl_x') {
                  sendCtrlX(stream);
                } else if (command === 'ctrl_s') {
                  sendCtrlS(stream);
                } else {
                  try {
                    stream.write(`${command}\n`);
                  } catch (error) {
                    console.error('Error writing to stream:', error);
                  }
                }
              } else {
                console.error('Stream is not available or not writable.');
              }
            });
          });
        });
      })
      .connect({
        host: ipAddress,
        port: numericPort,
        username: hostname,
        password: password,
      });
    console.log('Connection');

    res.status(200).send('SSH connection established');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const sendTcpDump = catchAsyncError(async (req, res, next) => {
  try {
    const { ipAddress, port, hostname, password } = req.body;
    console.log(req.body);
    const numericPort = parseInt(port, 10);
    console.log(ipAddress, port, hostname, password);

    const conn = new Client();
    conn
      .on('ready', () => {
        conn.shell((err, stream) => {
          if (err) {
            console.error('SSH shell error:', err);
            return res.status(500).send('SSH shell error');
          }

          stream.on('data', (data) => {
            io.emit('output', data.toString());
          });

          io.on('connection', (socket) => {
            socket.on('command', (command) => {
              console.log('Received command:', command);
              if (stream && stream.writable) {
                if (command === 'ctrl_c') {
                  sendCtrlC(stream);
                } else if (command === 'ctrl_x') {
                  sendCtrlX(stream);
                } else if (command === 'ctrl_s') {
                  sendCtrlS(stream);
                } else {
                  try {
                    stream.write(`${command}\n`);
                  } catch (error) {
                    console.error('Error writing to stream:', error);
                  }
                }
              } else {
                console.error('Stream is not available or not writable.');
              }
            });
          });
        });
      })
      .connect({
        host: ipAddress,
        port: numericPort,
        username: hostname,
        password: password,
      });
    console.log('Connection');

    res.status(200).send('SSH connection established');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
