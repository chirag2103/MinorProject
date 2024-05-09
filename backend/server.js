import app from './app.js';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';
import { Server } from 'socket.io';
import http from 'http';
import { Client } from 'ssh2';

dotenv.config({ path: './config/config.env' });
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  },
});
const executeCommand = (sshClient, command) => {
  return new Promise((resolve, reject) => {
    sshClient.exec(command, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }
      let data = '';
      stream.on('data', (chunk) => {
        data += chunk;
      });
      stream.on('close', () => {
        resolve(data.trim());
      });
    });
  });
};
io.on('connection', (socket) => {
  const sshConfig = {
    host: '127.0.0.1',
    port: 2222,
    username: 'kali',
    password: 'kali',
  };

  const sshClient = new Client();
  sshClient
    .on('ready', () => {
      console.log('SSH connection established');

      const sendDataToClient = (data) => {
        socket.emit('server-details', data);
      };

      const fetchAndSendServerDetails = () => {
        Promise.all([
          executeCommand(sshClient, 'ss -ln'),
          executeCommand(sshClient, 'top -bn1 | grep "Cpu(s)" && free -m'),
          executeCommand(sshClient, 'df -h'),
          executeCommand(sshClient, 'netstat -s'),
          executeCommand(sshClient, 'who'),
          executeCommand(sshClient, 'cat /proc/cpuinfo'),
        ])
          .then(
            ([
              portsOutput,
              cpuMemoryUsage,
              diskSpace,
              networkStats,
              loggedInUsers,
              cpuInfo,
            ]) => {
              let serverDetails = {
                ports: {
                  open: 0,
                  closed: 0,
                },
                cpuUsage: '',
                numberOfCPUs: 0,
                memoryUsage: '',
                diskSpace,
                tcp_active_Connections: 0,
                udp_packets_received: 0,
                icmp_messages_received: 0,
                loggedInUsers: loggedInUsers,
              };

              // Parse ports output
              portsOutput.split('\n').forEach((line) => {
                if (line.includes('LISTEN')) {
                  serverDetails.ports.open++;
                } else if (line.includes('CLOSED')) {
                  serverDetails.ports.closed++;
                }
              });

              const cpuInfoMatch = cpuInfo.match(/cpu cores\s+:\s+(\d+)/);
              if (cpuInfoMatch) {
                serverDetails.numberOfCPUs = parseInt(cpuInfoMatch[1]);
              }
              const cpuUsageLine = cpuMemoryUsage.match(/%Cpu\(s\):\s(.*)/);
              if (cpuUsageLine) {
                const cpuUsageValues = cpuUsageLine[1].trim().split(/\s*,\s*/);
                serverDetails.cpuUsage = {
                  userTime: parseFloat(cpuUsageValues[0]),
                  systemTime: parseFloat(cpuUsageValues[1]),
                  niceTime: parseFloat(cpuUsageValues[2]),
                  idleTime: parseFloat(cpuUsageValues[3]),
                  IOWaitTime: parseFloat(cpuUsageValues[4]),
                  hardwareInterruptTime: parseFloat(cpuUsageValues[5]),
                  softwareInterruptTime: parseFloat(cpuUsageValues[6]),
                  stolenTime: parseFloat(cpuUsageValues[7]),
                };
              }

              // Parse memory usage
              const memoryUsageValues = cpuMemoryUsage.match(
                /Mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/
              );
              if (memoryUsageValues) {
                serverDetails.memoryUsage = {
                  total: memoryUsageValues[1],
                  used: memoryUsageValues[2],
                  free: memoryUsageValues[3],
                  shared: memoryUsageValues[4],
                  bufferCache: memoryUsageValues[5],
                  available: memoryUsageValues[6],
                };
              }

              const tcpMatches = networkStats.match(/Tcp:\s+(\d+)/);
              if (tcpMatches) {
                serverDetails.tcp_active_Connections = parseInt(tcpMatches[1]);
              }

              const udpMatches = networkStats.match(/Udp:\s+(\d+)/);
              if (udpMatches) {
                serverDetails.udp_packets_received = parseInt(udpMatches[1]);
              }

              const icmpMatches = networkStats.match(/Icmp:\s+(\d+)/);
              if (icmpMatches) {
                serverDetails.icmp_messages_received = parseInt(icmpMatches[1]);
              }

              sendDataToClient(serverDetails);
            }
          )
          .catch((err) => {
            console.error('Error executing commands:', err);
            socket.emit('error', {
              message: 'Error executing commands: ' + err.message,
            });
          });
      };

      fetchAndSendServerDetails();

      const updateInterval = setInterval(fetchAndSendServerDetails, 1000);

      socket.on('disconnect', () => {
        sshClient.end();
        clearInterval(updateInterval);
      });
    })
    .connect(sshConfig);

  sshClient.on('error', (err) => {
    console.error('SSH connection error:', err);
    socket.emit('error', { message: 'SSH connection error: ' + err.message });
  });
});
const port = process.env.PORT || 4000;
connectDatabase();
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
