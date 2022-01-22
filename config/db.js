require('dotenv').config();
const mongoose = require('mongoose');
async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@unica.mqs6a.mongodb.net/Unica?retryWrites=true&w=majority`,
    ),
      console.log('DB Connected');
  } catch (error) {
    console.log('Error');
  }
}

module.exports = { connect };
