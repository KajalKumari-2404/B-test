const transactionModel = require("../models/transactionModel")

const transactionCreateController = async (req, res) => {
    try{
        const {title,amount,type,category,expense,date} = req.body
        if(!title || !amount || !type || !category || !expense || !date){
            return res.status(500).send({
                success:false,
                message:"please provide all required fields"
            })
        }

        const newTransaction = new transactionModel({
            title,
            amount,
            category,
            type,
            expense,
            date
        })
        await newTransaction.save()
       return res.status(200).send({
            success:true,
            message:"New transaction created successfully",
            newTransaction
        })

    } catch(error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in create API",
            error
        })
    }
}

const getAllTransactionController = async (req, res) => {
    try {
        const transaction = await transactionModel.find({})
        if(!transaction){
            return res.status(404).send({
                success:false,
                message:"No transaction found"
            })
        }
        res.status(200).send({
            success:true,
            totaltransaction:transaction.length,
            transaction
        })

    } catch(error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in getAllTransaction API",
            error
        })
    }
}

const deleteTransactionController = async (req, res) => {
    try{
    const transactionId = req.params.id
    if(!transactionId) {
        return res.status(404).send({
            success:false,
            message:"Provide transaction ID"
        })
    }

    const transaction = await transactionModel.findById(transactionId)
    if(!transaction){
        return res.status(404).send({
            success:false,
            message:"No transaction id found"
        })
    }

    await transactionModel.findByIdAndDelete(transactionId)
    res.status(200).send({
        success:true,
        message:"transaction deleted successfully"
    })
} catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error in delete API",
        error
    })
}
}


module.exports = {transactionCreateController, getAllTransactionController, deleteTransactionController}