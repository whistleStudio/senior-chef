const mongoose = require('mongoose');
const DBNAME = 'senior-chef';
const PORT = 27017;
const { DBADMIN, DBPASSWORD } = require('../private-data.json');

connectDB().catch(err => {
  console.error('Database connection error:', err);
});

async function connectDB() {
  await mongoose.connect(`mongodb://localhost:${PORT}/${DBNAME}`, {
    user: DBADMIN,
    pass: DBPASSWORD,
    authSource: 'admin'
  });
  console.log(`Connected to mongodb://localhost:${PORT}/${DBNAME}`);
}
