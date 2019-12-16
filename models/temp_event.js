const Sequelize=require('sequelize');

const sequelize_master=require('../db/master connection');

const Event_temp=sequelize_master.define('events_temp',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    venue:{
        type: Sequelize.STRING,
        allowNull: false
    },
    date:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    inUser1:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    inUser2:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    
})


module.exports=Event_temp;