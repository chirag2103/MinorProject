// Required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('ssh2');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

mongoose.connect(
  'mongodb+srv://chirag:chirag21@cluster0.1rdisk4.mongodb.net/MinorProject1?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const serverSchema = new mongoose.Schema({
  hostname: String,
  port: String,
  ipAddress: String,
  password: String,
});

const Server = mongoose.model('Server', serverSchema);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

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

app.post('/api/servers', async (req, res) => {
  try {
    const server = new Server(req.body);
    await server.save();
    res.status(201).send(server);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/servers', async (req, res) => {
  try {
    const servers = await Server.find();
    res.send(servers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/send-data', async (req, res) => {
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
