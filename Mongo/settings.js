// This will load our .env file and add the values to process.env,
require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
    url: process.env.URL || "",
    dbName: process.env.DBNAME,
    host: process.env.HOST || "localhost",
    user: process.env.USER || "",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE
};