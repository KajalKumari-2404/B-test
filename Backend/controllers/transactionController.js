const transactionModel = require("../models/transactionModel")

const transactionCreateController = async (req, res) => {
    try{
        // const {title,amount,type,category,expense,date} = req.body
        // if(!title || !amount || !type || !category || !expense || !date){
        //     return res.status(500).send({
        //         success:false,
        //         message:"please provide all required fields"
        //     })
        // }

        const { title, amount, type, category, expense, date } = req.body;

         // Title validation
         if (!title || !title.trim()) {
             return res.status(400).send({
                 success: false,
                 message: "Title is required"
             });
         }
         
         // Amount validation
         if (!amount || Number(amount) <= 0) {
             return res.status(400).send({
                 success: false,
                 message: "Amount must be greater than 0"
             });
         }
         
         // Type validation
         if (!type) {
             return res.status(400).send({
                 success: false,
                 message: "Type is required"
             });
         }
         
         if (!["income", "expense"].includes(type)) {
             return res.status(400).send({
                 success: false,
                 message: "Type must be income or expense"
             });
         }
         
         // Category validation
         if (!category || !category.trim()) {
             return res.status(400).send({
                 success: false,
                 message: "Category is required"
             });
         }
         
         // Expense validation
         if (!expense || !expense.trim()) {
             return res.status(400).send({
                 success: false,
                 message: "Expense is required"
             });
         }
         
         // Date validation
         if (!date || isNaN(new Date(date).getTime())) {
             return res.status(400).send({
                 success: false,
                 message: "Valid date is required"
             });
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

        //SEARCH

         const { search, type, category } = req.query;

        let filter = {};

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        // FILTER

        if (type && type !== "all") {
            filter.type = type;
        }

        //CATEGORY

        if (category && category !== "all") {
           filter.category = category;
        }


        const transaction = await transactionModel.find(filter)
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


const transactionSummaryController = async (req, res) => {
    try {

        const transactions = await transactionModel.find({});

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach((transaction) => {

            const amount = Number(transaction.amount);

            if (transaction.type === "income") {
                totalIncome += amount;
            }

            if (transaction.type === "expense") {
                totalExpenses += amount;
            }
        }) 

        const balance = totalIncome - totalExpenses;

        res.status(200).send({
            success: true,
            totalIncome,
            totalExpenses,
            balance,
            totalTransactions: transactions.length
        });

    } catch (error) {

        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Error in summary API",
            error: error.message
        });
    }
};

module.exports = {transactionCreateController, getAllTransactionController, deleteTransactionController,transactionSummaryController }