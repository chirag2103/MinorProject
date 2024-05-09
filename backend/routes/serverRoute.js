import express from 'express';
import {
  createServerIp,
  getServerIp,
  sendData,
  sendTcpDump,
} from '../controllers/serverIpController.js';

const router = express.Router();

router.route('/api/servers').post(createServerIp);
router.route('/api/servers').get(getServerIp);
router.route('/api/send-data').post(sendData);
router.route('/api/sendtcpdump').post(sendTcpDump);

export default router;
