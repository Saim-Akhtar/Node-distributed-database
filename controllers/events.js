const {Event_master,Event_slave1,Event_slave2}=require('../models/event');
const Event_temp=require('../models/temp_event');

const rowCheck=async()=>{
    try {
        const res= await Event_temp.destroy({
            where: {
                inUser1: true,
                inUser2: true
            }
        })
        // const checkRows=await Event_temp.findAll()
        // if(checkRows.length === 0){
        //     Event_temp.destroy({ truncate: true, restartIdentity: true })
        // }
    } catch (err) {
        console.log("error")
    }
}

module.exports={
    getEvents:async(req,res,next)=>{
        try{
            let eventsData= await Event_master.findAll({attributes: ['id','title','venue','date']})  
            eventsData=[...eventsData].map(data=> {
                return {id:data.id,title:data.title,venue:data.venue,date:data.date}
            })
            
            res.render('events',{
                pageTitle: "Events",
                path: "/events",
                eventsList: eventsData
            })
        }
        catch(err){
            console.log("Error occured: ",err)
            // eventsData=[]
        }
    },
    GET_addEvent_sync:async(req,res,next)=>{
        res.render('addEvent_sync',{
            pageTitle:"Add Event",
            path: "/events/add/sync"
        })
    },
    POST_addEvent_sync: async(req,res,next)=>{
        const {title,venue,date}=req.body
        try{
            await Event_master.create({
                title:title,
                venue:venue,
                date:date
            })
            await Event_slave1.create({
                title:title,
                venue:venue,
                date:date
            })
            await Event_slave2.create({
                title:title,
                venue:venue,
                date:date
            })
            
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/events')
    },
    GET_addEvent_async:async(req,res,next)=>{
        res.render('addEvent_async',{
            pageTitle:"Add Event",
            path: "/events/add/async"
        })
    },
    POST_addEvent_async: async(req,res,next)=>{
        const {title,venue,date}=req.body
        try{
            await Event_master.create({
                title:title,
                venue:venue,
                date:date
            })
            await Event_temp.create({
                title:title,
                venue:venue,
                date:date
            })
            
        }
        catch(err){
            console.log(err)
            console.log("Error")
        }
        res.redirect('/events')
    },
    GET_queuedEvents:async(req,res,next)=>{
        try {
            const user1Data=await Event_temp.findAll({where:{ inUser1: false}})
            const user2Data=await Event_temp.findAll({where:{ inUser2: false}})
            const tempData=await Event_temp.findAll({attributes: ['id','title','venue','date','inUser1','inUser2']})
            
            res.render('queued',{
                pageTitle: "Queued Events",
                path: '/queued',
                eventsList:tempData,
                user1Flag:user1Data.length,
                user2Flag:user2Data.length
            })
        } 
        catch (err) {
            console.log(err)
        }
        
    },
    addData_user1:async(req,res,next)=>{
        try {
            
            let user1Data=await Event_temp.findAll(
                {attributes: ['title','venue','date'],
                    where:{ inUser1: false}
                })
            user1Data=[...user1Data].map(data=> {
                return {title:data.title,venue:data.venue,date:data.date}
            })
            
            const myRes=await Event_slave1.bulkCreate(user1Data)
            if(myRes){
                console.log("transfer successfull")
            }
            await Event_temp.update({
                inUser1: true,
              },
              { where: { inUser1: false } });
              await rowCheck()
              res.redirect('/events/queued')
        } 
        catch (err) {
            console.log(err)
        }
        
    },
    addData_user2:async(req,res,next)=>{
        try {
            console.log("in function 2")
            let user2Data=await Event_temp.findAll(
                {attributes: ['title','venue','date'],
                    where:{ inUser2: false}
                })
            user2Data=[...user2Data].map(data=> {
                return {title:data.title,venue:data.venue,date:data.date}
            })
            console.log("user2 transfer successfull")
            const myRes=await Event_slave2.bulkCreate(user2Data)
            if(myRes){
                console.log("transfer successfull")
            }
            await Event_temp.update({
                inUser2: true,
              },
              { where: { inUser2: false } });
              await rowCheck()
              res.redirect('/events/queued')
        } 
        catch (err) {
            console.log(err)
        }
        
    }
}