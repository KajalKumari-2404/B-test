const express = require("express");

const userRoutes = require('./routes/userRoutes')
const transactionRoutes = require("./routes/transactionRoutes")


const app = express();

app.use(express.json());
app.use("/auth/api/v1", userRoutes)
app.use('/transaction/api/v1', transactionRoutes)

module.exports = app;