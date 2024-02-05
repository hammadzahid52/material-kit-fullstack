const express = require ("express");
const app = express();
const cors = require("cors");
const mockDataRoutes = require("./routes/mockData");

// Middleware
app.use(cors());
app.use(express.json());

app.listen(5000, ()=>{
    console.log("Server has statrted at 5000");
})

app.use('/api', mockDataRoutes);

module.exports = app;