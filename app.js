const express=require('express')
const app=express();
const path=require('path');
const dotenv=require('dotenv')

dotenv.config()

const bodyParser=require('body-parser');

// Importing database sequelize
const sequelize_master=require('./db/master connection')
const {sequelize_slave1,sequelize_slave2}=require('./db/slave connection')

// Importing Models
const {Event_master,Event_slave1,Event_slave2}=require('./models/event');
const Event_temp=require('./models/temp_event');

// Importing routes
const mainRoute=require('./routes/main');
const eventsRoute=require('./routes/events')

// configure ejs template
app.set('view engine','ejs')
app.set('views','views')

app.use(bodyParser.urlencoded({extended:true}))


// settings routes
app.use('/',mainRoute)
app.use('/events',eventsRoute)


sequelize_master
// .sync({force:true})
.sync()
.then(res=>{
    // console.log(res)
    console.log("tables created")
})
.catch(err=>{
    // console.log(err)
    console.log("error found")
})

sequelize_slave1
// .sync({force:true})
.sync()
.then(res=>{
    // console.log(res)
    console.log("tables created")
})
.catch(err=>{
    // console.log(err)
    console.log("error found")
})

sequelize_slave2
// .sync({force:true})
.sync()
.then(res=>{
    // console.log(res)
    console.log("tables created")
})
.catch(err=>{
    // console.log(err)
    console.log("error found")
})

app.listen(3000,()=>{
    console.log("server has started")
})