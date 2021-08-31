const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create db Schema
const dbSchema = new Schema({
    groupName:{
        type: String,
        require: true
    },
    parentGroup:{
        type:String
    },
    members:{
        type: [],
    },
    subsetGroups:{
        type: [],
    }
}, { timestamps: true});

module.exports = mongoose.model('Group', dbSchema);