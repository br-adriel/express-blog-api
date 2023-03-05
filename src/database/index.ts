import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL ?? '');
    console.log('CONNECTED TO DATABASE');
  } catch (err) {
    console.log(err);
  }
}
