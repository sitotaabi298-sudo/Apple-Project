
// Import the mysql2 module
const mysql = require("mysql2");


const express = require("express");

const bodyparser = require("body-parser");

var cors = require("cors");

var app = express();

app.use(cors());

app.use(bodyparser.urlencoded({ extended: true }));




// 1. question 
// create connection to database
const connection = mysql.createConnection({
  host: "localhost", // 127.0.0.1
  user: "myDBuser",
  password: ".MMTrZ8a/aM@i/1v",
  database: "mydb",
});




 // Attempt to connect to the database

connection.connect((err) => {
  if (err) {
    // Display error message if connection fails
    console.error("Error connecting to database:", err.message);
    return;
  }
  // Display success message if connection is successful
  console.log("Connected to database successfully!");
});

// 2 question

app.get("/install", (req, res) => {
  let done = "table created";
  let sql1 = `CREATE TABLE IF NOT EXISTS Products(
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        product_url VARCHAR(255),
        product_name VARCHAR(255)
    );`;

  let sql2 = `CREATE TABLE IF NOT EXISTS ProductDescription(
        description_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        product_brief_description TEXT,
        product_description TEXT,
        product_img VARCHAR(255) ,
        product_link VARCHAR(255),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
    );`;

  let sql3 = `CREATE TABLE IF NOT EXISTS ProductPrice(
        price_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        starting_price VARCHAR(50),
        price_range VARCHAR(50),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
        );`;
  let sql4 = `CREATE TABLE IF NOT EXISTS User(
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        User_name VARCHAR(255),
        User_password VARCHAR(255)
    );`;
  let sql5 = `CREATE TABLE IF NOT EXISTS Orders(
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        user_id INT,
        FOREIGN KEY (product_id) REFERENCES Products(product_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id)
    );`;
  connection.query(sql1, function (err, result) {
   
    console.log("Table created 1");
  });
  connection.query(sql2, function (err, result) {
    
    console.log("Table created 2");
  });
  connection.query(sql3, function (err, result) {
   
    console.log("Table created 3");
  });
  connection.query(sql4, function (err, result) {
   
    console.log("Table created 4");
  });
  connection.query(sql5, function (err, result) {
   
    console.log("Table created 5");
  });
  res.end(done);
});

//question 3

app.post("/addiphones", (req, res) => {
  // console.log(bodyparser.json);
  let url = req.body.product_url;
  let img = req.body.img;
  let link = req.body.link;
  let name = req.body.product_name;
  let Brief = req.body.brief;
  let StartPrice = req.body.StartPrice;
  let PriceRange = req.body.priceRange;
  let Description = req.body.desc;

  console.log(req.body);
  //   var url = req.body.product_url;
  //   var product = req.body.product_name;
  let prd = `INSERT INTO Products (product_url, product_name)
VALUES (?,?);`;

  connection.query(prd, [url, name], function (err, result) {
   
    console.log("inserted");
    var id = result.insertId;

    // if(Brief!=0 && Description!=0 && link!=0){
    let description = `INSERT INTO ProductDescription (product_id, product_brief_description,
        product_description , product_img , product_link)
VALUES (?,?,?,?,?);`;

    connection.query(
      description,
      [id, Brief, Description, img, link],
      function (err, result) {
        
        console.log("inserted desc table");
      },
    );
    // }
    let price_table = `INSERT INTO ProductPrice(product_id,starting_price,price_range)
  VALUES(?,?,?)`; 
    connection.query(price_table, [id, StartPrice, PriceRange], (err, res) => {
     
      console.log("inserted price table");
    });
    res.send("insert");
  });
});


app.get("/products", (req, res) => {
  const query = `
        SELECT 
            p.product_id,
            p.product_name,
            p.product_url,
            d.product_brief_description,
            d.product_description,
            d.product_img,
            d.product_link,
            pr.starting_price,
            pr.price_range
        FROM Products p
        LEFT JOIN ProductDescription d ON p.product_id = d.product_id
        LEFT JOIN ProductPrice pr ON p.product_id = pr.product_id
    `;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching products");
    }
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log("listening port 3001");
});



