import mongoose from 'mongoose';
const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`Database Connected: ${con.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
export default connectDatabase;
