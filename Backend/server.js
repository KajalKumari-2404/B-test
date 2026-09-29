require("dotenv").config();

const app = require("./app");

const connectDB = require('./config/db');

connectDB();

app.listen(8080, () => {
    console.log("server running on port 8080");
});