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

router.put("/quantity/:id", (req,res)=>{
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

router.put("/checked/:id",(req,res)=>{
  const is_checked = req.body.is_checked
  const sql = `UPDATE cart_items SET is_checked = ${is_checked} WHERE cart_items.id = ${req.params.id};`

  conn.query(sql, (err, result)=>{
    if (err){
      return res.json(err)
    }else{
      return res.json({status:200, result})
    }
  })
})

router.delete("/item/:id", (req, res) => {
  const sql = `DELETE FROM cart_items WHERE id = ${req.params.id}`;
  conn.query(sql, (err, result) => {
      if (err) {
          res.json(err)
      } else {
          res.json({
              status: 200,
              error: false,
              data: result
          })
      }
  })
})

router.delete("/store/:storeName", (req, res) => {
  const sql = `DELETE ci
                FROM cart_tokopaedi.cart_items ci
                JOIN cart_tokopaedi.products p ON ci.product_id = p.id
                JOIN cart_tokopaedi.stores s ON p.store_id = s.id
                WHERE s.name = '${req.params.storeName}'`;
  conn.query(sql, (err, result) => {
      if (err) {
          res.json(err)
      } else {
          res.json({
              status: 200,
              error: false,
              data: result
          })
      }
  })
})


module.exports = router;
