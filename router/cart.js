const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ripkiew02_",
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

// nambah pemanggilan id cart_item
router.get("/", (req, res) => {
  const sql = `SELECT ci.id, s.name, p.name AS product_name, p.price, p.discount, p.image, ci.quantity, ci.note, ci.is_checked, c.name AS category_name, o.total_price FROM products p JOIN cart_items ci ON p.id = ci.product_id JOIN categories c ON p.category_id = c.id JOIN orders o ON ci.cart_id = o.id JOIN stores s ON p.store_id = s.id;`;
  conn.query(sql, (err, result) => {
    if (err) {
      return res.json({ status: 200, error: true, result });
    } else {
      return res.json({ status: 200, error: false,result });
    }
  });
});

// update quantity cart
router.put("/:id", (req, res) => {
  const {quantity} = req.body;

  if (typeof quantity !== "number" || quantity < 0 ) {
    return res.json({ status: 400, error: true, message: "invalid quantity"});
  }
  const sql = `UPDATE cart_items SET quantity = ? WHERE id = ${req.params.id}`;
  conn.query(sql, [quantity], (err, result) =>  {
    if (err) {
      return res.json({ status: 400, error: true, result})
    } else {
      return res.json({ status: 200, error: false, result})
    }
  });
});


//  untuk setiap update quantity, dimna harga barang * quantity trus di update ke dalam total price pada tabel order
// router.put("/:id", (req, res) => {
//   const { quantity } = req.body;

//   if (typeof quantity !== "number" || quantity < 0) {
//     return res.json({ status: 400, error: true, message: "Invalid quantity" });
//   }

//   // ambil product_id dari cart_items
//   const getProductIdSql = `SELECT product_id FROM cart_items WHERE id = ${req.params.id}`;
//   conn.query(getProductIdSql
// , (err, result) => {
//     if (err || result.length === 0) {
//       return res.json({ status: 400, error: true, message: "Cart item not found"});
//     }
//     const productId = result[0].product_id;

//     // ambil price dri tabel products
//     const getPriceSql = `SELECT price FROM products WHERE id = ${req.params.id}`;
//     conn.query(getPriceSql, [productId], (err, result) => {
//       if (err || result.length === 0) {
//         return res.json({ status: 400, error: true, message: "Product not found"});
//       }

//       const price = result[0].price;
//       const totalPrice = price * quantity;

//       // ubah quantity
//       const updateCartItemSql = `UPDATE cart_items SET quantity = ? WHERE id = ${req.params.id}`;
//       conn.query(updateCartItemSql, [quantity], (err, result) =>  {
//         if (err) {
//           return res.json({ status: 400, error: true, result})
//         } 

//         // Update total_price di orders berdasarkan cart_id (tapi masih salah)
//         // const updateOrderTotalSql = `UPDATE orders SET total_price = ? WHERE id = (SELECT cart_id FROM cart_items WHERE id = ${req.params.id})`;
//         // conn.query(updateOrderTotalSql, [totalPrice], (err, result) => {
//         //   if (err) {
//         //     return res.json({ status: 400, error: true, result });
//         //   }

//         return res.json({ status: 200, error: false, result });
//       });
//     });
//   });
// });
// });




module.exports = router;


module.exports = router;
