const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:["expense","income"]
    },
    category:{
        type:String,
        required:true
    },
    expense:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
}, {timestamps:true})

module.exports = mongoose.model('transaction', transactionSchema)