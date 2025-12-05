const mongoose = require('mongoose');
const DBNAME = 'senior-chef';
const PORT = 27017;
const { DBADMIN, DBPASSWORD } = require('../private-data.json');
const User = require('./model/User');
const LIMITCOUNT = 30;

connectDB().catch(err => {
  console.error('Database connection error:', err);
});

async function connectDB() {
  await mongoose.connect(`mongodb://localhost:${PORT}/${DBNAME}`, {
    user: DBADMIN,
    pass: DBPASSWORD,
    authSource: 'admin'
  });
  scheduleResetUserLimits();

  console.log(`Connected to mongodb://localhost:${PORT}/${DBNAME}`);
}


function scheduleResetUserLimits() {
  console.log('Daily reset task scheduled.');
  try {
    const now = new Date();
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 5, 0 // +5s 偏移，避免整点 race
    );
    const msUntilReset = nextReset - now; // 毫秒数
    console.log(`Next user limits reset scheduled in ${msUntilReset / 1000 / 60 / 60} hours.`);
    setTimeout(async () => {
      try {
        const result = await User.updateMany({}, { $set: { limit: LIMITCOUNT } });
        console.log(`User limits reset. Modified count: ${result.nModified}`);
      } catch (error) {
        console.error('Error resetting user limits:', error);
      }
      // 递归调用，设置下一个重置
      scheduleResetUserLimits();
    }, msUntilReset);
  } catch (error) {
    console.error('Error scheduling user limits reset:', error);
  } 
}