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
  const sql = `SELECT ci.id, s.name, s.avatar, p.name AS product_name, p.price, 
  p.discount, p.image, ci.quantity, ci.note, ci.is_checked, c.description, c.name AS category_name, 
  o.total_price FROM products p JOIN cart_items ci ON p.id = ci.product_id 
  JOIN categories c ON p.category_id = c.id JOIN orders o ON ci.cart_id = o.id 
  JOIN stores s ON p.store_id = s.id;`;
  conn.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: 500, error: true, result});
    } else {
      return res.json({ status: 200, error: false, result });
    }
  });
});

router.put("/quantity/:id", (req, res) => {
  const quantity = req.body.quantity;
  const sql = `UPDATE cart_items SET quantity = ${quantity} WHERE cart_items.id = ${req.params.id}`;

  conn.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: 500, error: true, result });
    } else {
      return res.json({ status: 200, error: false, result });
    }
  });
});

router.put("/checked/:id", (req, res) => {
  const is_checked = req.body.is_checked;
  const sql = `UPDATE cart_items SET is_checked = ${is_checked} WHERE cart_items.id = ${req.params.id};`;

  conn.query(sql, (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json({ status: 200, result });
    }
  });
});

router.delete("/item/:id", (req, res) => {
  const sql = `DELETE FROM cart_items WHERE id = ${req.params.id}`;
  conn.query(sql, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        status: 200,
        error: false,
        data: result,
      });
    }
  });
});

router.delete("/store/:storeName", (req, res) => {
  const sql = `DELETE ci
                FROM cart_tokopaedi.cart_items ci
                JOIN cart_tokopaedi.products p ON ci.product_id = p.id
                JOIN cart_tokopaedi.stores s ON p.store_id = s.id
                WHERE s.name = '${req.params.storeName}'`;
  conn.query(sql, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        status: 200,
        error: false,
        data: result,
      });
    }
  });
});

router.post("/reset_cart", (req, res) => {
  const cartId = 1;
  const quantity = 1;
  const isChecked = 0;

  const deleteSql = `DELETE FROM cart_items;`;
  const resetAiSql = `ALTER TABLE cart_items AUTO_INCREMENT = 1;`;
  const disableCek = `SET foreign_key_checks = 0`;

  const insertSql = `INSERT INTO cart_items (id, cart_id, product_id, quantity, note, is_checked) VALUES ?`;

  const values = [];
  for (let productId = 1; productId <= 41; productId++) {
    values.push([null, cartId, productId, quantity, null, isChecked]);
  }

  conn.query(deleteSql, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    conn.query(resetAiSql, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      conn.query(disableCek, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        conn.query(insertSql, [values], (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send("Error saat menambahkan data: " + err.message);
          }

          res.status(200).send(result);
        });
      });
    });
  });
});

router.delete("/delete_checkout_items", (req, res) => {
  const sql = `DELETE FROM cart_items WHERE is_checked = 1;`;
  conn.query(sql, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json({
        status: 200,
        error: false,
        data: result,
      });
    }
  });
});

router.put("/note/:id",(req,res)=>{
    const sql = `UPDATE cart_items SET note = '${req.body.note}' WHERE id = ${req.params.id}`;
    console.log(req.body.note);
    conn.query(sql,(err,result)=>{
        if(err){
            return res.json({status:500,error:true,result});
        }else{
            return res.json({status:200,error:false,result});
        }
    })
})

module.exports = router;
