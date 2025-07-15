const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException',err=>{
console.log("UNCHAUGHTEXCEPTION 💥 Shutting down....")
  console.log(err.name,err.message)
  process.exit(1)
  
})


// Load environment variables from config.env
dotenv.config({ path: './config.env' });

// ✅ Log current environment mode
console.log(`🚀 Running in ${process.env.NODE_ENV} mode`);

const express = require('express');

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ DB connection successful!'))

const app = require('./app');

const port = process.env.PORT || 3000;
const server=app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});
process.on('unhandledRejection',err=>{
  console.log("UNHANDLER THE RECJECTION 💥 Shutting down....")
  console.log(err.name,err.message)
  server.close(()=>{

    process.exit(1)
  })
})



