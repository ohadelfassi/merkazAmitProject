const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create db Schema
const dbSchema = new Schema({
    fullName:{
        type: String,
        require: true
    },

    memberInGroups:{
        type:[],
        
    },
    memberInGroupsByName:{
        type:[],
    }

}, { timestamps: true});

module.exports = mongoose.model('Person', dbSchema);