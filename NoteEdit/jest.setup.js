import mongoose from 'mongoose';

afterAll(async () => {
  // Cierrate mongoose por favor
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect().catch(() => {
    });
  }
}, 10000);
