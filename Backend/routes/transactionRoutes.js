const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { transactionCreateController, getAllTransactionController, deleteTransactionController, transactionSummaryController } = require("../controllers/transactionController");

const router = express.Router();

router.post("/create", authMiddleware, transactionCreateController);

router.get('/getAll',authMiddleware, getAllTransactionController)

router.delete('/delete/:id',authMiddleware, deleteTransactionController)

router.get('/summary',authMiddleware, transactionSummaryController)

module.exports = router;
