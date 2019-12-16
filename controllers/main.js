const masterDB=require('../db/master connection')

module.exports={
    displayMain: (req,res,next)=>{
        res.render('home',{
            pageTitle: "Node Organizers",
            path: '/'
        })
     
    }
}