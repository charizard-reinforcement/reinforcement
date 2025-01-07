import mongoose from 'mongoose';

const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.connection.once('open', () => {
    console.log('🥳 Connection to Copytory established');
  });
};

export default connectDB;