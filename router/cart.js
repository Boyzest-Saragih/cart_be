const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cart_tokopaedi",
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

conn.connect((err) => {
  if (err) {
    console.log("Discconect");
    console.log(err);
  } else {
    console.log("Connected");
  }
});

router.get("/", (req, res) => {
  const sql = `SELECT ci.id, s.name, p.name AS product_name, p.price, 
  p.discount, p.image, ci.quantity, ci.note, ci.is_checked, c.name AS category_name, 
  o.total_price FROM products p JOIN cart_items ci ON p.id = ci.product_id 
  JOIN categories c ON p.category_id = c.id JOIN orders o ON ci.cart_id = o.id 
  JOIN stores s ON p.store_id = s.id;`;
  conn.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: 500, error: true, result });
    } else {
      return res.json({ status: 200, error: false,result });
    }
  });
});

router.put("/:id", (req,res)=>{
  const quantity = req.body.quantity
  const sql = `UPDATE cart_items SET quantity = ${quantity} WHERE cart_items.id = ${req.params.id}`

  conn.query(sql, (err, result)=>{
    if(err){
      return res.json({status:500, error:true, result})
    }else{
      return res.json({status:200, error:false, result})
    }
  })
})

module.exports = router;
