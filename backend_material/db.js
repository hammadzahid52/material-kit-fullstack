const { Pool } = require("pg");


const pool = new Pool({
    user: "postgres",      
    password: "Root@12345",
    host: "localhost",         
    port: 5432,                
    database: "MOCK_DATA"     
});

pool.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


module.exports = pool;
