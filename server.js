const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // เพิ่ม cors หากต้องการทำ API
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // เพิ่ม cors หากต้องการทำ API

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',  // เปลี่ยนเป็น localhost
  user: 'root',
  password: '',
  database: 'myproduct-mo'
});

db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

// ฟังก์ชันเพิ่มสินค้า
app.post('/add-product', (req, res) => {
  const { product_name, product_price, product_cost, product_image } = req.body;
  const query = 'INSERT INTO `product-mo` (product_name, product_price, product_cost, product_image) VALUES (?, ?, ?, ?)';
  db.query(query, [product_name, product_price, product_cost, product_image], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).send(err);
    }
    res.status(200).send('Product added successfully');
  });
});

// ฟังก์ชันแก้ไขสินค้า
app.put('/update-product/:id', (req, res) => {
  const { product_name, product_price, product_cost, product_image } = req.body;
  const { id } = req.params;
  const query = 'UPDATE `product-mo` SET product_name = ?, product_price = ?, product_cost = ?, product_image = ? WHERE id = ?';
  db.query(query, [product_name, product_price, product_cost, product_image, id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send(err);
    }
    res.status(200).send('Product updated successfully');
  });
});

// ฟังก์ชันลบสินค้า
app.delete('/delete-product/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM `product-mo` WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).send(err);
    }
    res.status(200).send('Product deleted successfully');
  });
});

// ฟังก์ชันดูรายการสินค้า
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM `product-mo`';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error getting products:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});