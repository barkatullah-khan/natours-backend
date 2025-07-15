const fs=require('fs')
const Tour=require('./../../models/tourModel')
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const { json } = require('stream/consumers');


dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex:true,
  useFindAndModify: true,
   useUnifiedTopology: true
}).then(() =>  console.log('DB connection successful!'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

 const importData=async ()=>{
    try{
        await Tour.create(tours)
        console.log('Data successsfully loaded!')
        

    }catch(err){
        console.log(err)
    }
    process.exit()
 }

 //Delte the data form the database
 const DeleteData=async ()=>{
    try{
        await Tour.deleteMany();
        console.log("Data delted successfully!")
        
}catch(err){
    console.log(err)
}
process.exit()
}



 if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  DeleteData();
} else {
  console.log('❓ Use "--import" to import or "--delete" to delete data.');
}
