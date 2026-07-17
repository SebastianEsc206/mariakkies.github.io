const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           
    password: '',           
    database: 'merakiies_db' 
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado exitosamente a la base de datos MySQL');
});

app.get('/api/products', (req, res) => {
    const query = `
        SELECT p.id, p.name, p.description, p.price, p.image_url, c.name as category_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener productos');
        } else {
            res.json(results);
        }
    });
});

app.get('/api/cart/:session_id', (req, res) => {
    const { session_id } = req.params;
    const query = `
        SELECT c.product_id, c.quantity, p.name, p.price, p.image_url 
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.session_id = ?
    `;
    db.query(query, [session_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener el carrito' });
        res.json(results);
    });
});

app.post('/api/cart', (req, res) => {
    const { session_id, product_id, quantity } = req.body;
    
    const query = `
        INSERT INTO cart (session_id, product_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;
    db.query(query, [session_id, product_id, quantity, quantity], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar al carrito' });
        res.status(200).json({ message: 'Agregado al carrito exitosamente' });
    });
});


app.put('/api/cart/:session_id/:product_id', (req, res) => {
    const { session_id, product_id } = req.params;
    const { quantity } = req.body;
    
    const query = "UPDATE cart SET quantity = ? WHERE session_id = ? AND product_id = ?";
    db.query(query, [quantity, session_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar cantidad' });
        res.status(200).json({ message: 'Cantidad actualizada' });
    });
});

app.delete('/api/cart/:session_id/:product_id', (req, res) => {
    const { session_id, product_id } = req.params;
    const query = "DELETE FROM cart WHERE session_id = ? AND product_id = ?";
    db.query(query, [session_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
        res.status(200).json({ message: 'Producto eliminado' });
    });
});

app.delete('/api/cart/:session_id', (req, res) => {
    const { session_id } = req.params;
    const query = "DELETE FROM cart WHERE session_id = ?";
    db.query(query, [session_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al vaciar carrito' });
        res.status(200).json({ message: 'Carrito vaciado' });
    });
});

app.listen(3000, () => {
    console.log('Servidor Backend corriendo en http://localhost:3000');
});