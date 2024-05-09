import mongoose from 'mongoose';
const serverSchema = new mongoose.Schema({
  hostname: String,
  port: String,
  ipAddress: String,
  password: String,
});

export default mongoose.model('Server', serverSchema);
