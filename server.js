const dotenv=require('dotenv')
const express=require('express')
dotenv.config({path:'./config.env'})
const app=require('./app')

// console.log({
//   PORT: process.env.PORT,
//   NODE_ENV: process.env.NODE_ENV,
//   DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
//   API_KEY: process.env.API_KEY
// });


const port = process.env.PORT||3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});