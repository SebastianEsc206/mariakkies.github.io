const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Servir archivos estáticos del frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'public')));

// DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           
    password: '',           
    // database: 'merakiies_db', 
    multipleStatements: true 

});

const JWT_SECRET = 'SECRETO_DEV_CAMBIAR_EN_PROD';

let serverStarted = false;

function startServerOnceReady() {
    if (serverStarted) return;
    serverStarted = true;
    app.listen(4000, () => {
        console.log('Servidor Backend corriendo en http://localhost:4000');
    });
}

db.connect(err => {
    if (err) {
        console.error('\n======================================================');
        console.error('❌ ERROR CRÍTICO: No se pudo conectar a la base de datos MySQL.');
        console.error('Por favor, asegúrate de que tu servidor MySQL (ej. XAMPP, WAMP o Docker) esté encendido y funcionando.');
        console.error(`Detalle técnico: ${err.message}`);
        console.error('======================================================\n');
        process.exit(1);
    }
    console.log('✅ Conectado al servidor MySQL localmente');
    
    // 1. Crear la base de datos si no existe
    db.query("CREATE DATABASE IF NOT EXISTS merakiies_db;", (err) => {
        if (err) {
            console.error('❌ Error al intentar crear la base de datos:', err.message);
            process.exit(1);
        }
        
        // 2. Seleccionar la base de datos para las futuras consultas
        db.query("USE merakiies_db;", (err) => {
            if (err) {
                console.error('❌ Error al seleccionar la base de datos:', err.message);
                process.exit(1);
            }
            
            // 3. Comprobar si existen las tablas (revisando si existe 'products')
            db.query("SHOW TABLES LIKE 'products';", (err, results) => {
                if (err) {
                    console.error('❌ Error al comprobar las tablas:', err.message);
                    process.exit(1);
                }
                
                if (results.length === 0) {
                    console.log('⚙️ Instalación limpia detectada. Autoconfigurando la base de datos...');
                    // Leer el archivo SQL e inyectarlo
                    const sqlFile = path.join(__dirname, '..', 'database', 'merakiies_db.sql');
                    
                    try {
                        const sqlQueries = fs.readFileSync(sqlFile, 'utf8');
                        console.log('📝 Inyectando estructura y datos predeterminados (tablas, productos y usuarios)...');
                        
                        db.query(sqlQueries, (err) => {
                            if (err) {
                                console.error('❌ Error al importar el archivo merakiies_db.sql:', err.message);
                                process.exit(1);
                            }
                            console.log('🚀 ¡Base de datos y tablas inicializadas exitosamente de forma automática!');
                            fixSeedUserPasswords();
                            startServerOnceReady();
                        });
                    } catch (fsErr) {
                        console.error('❌ Error al leer el archivo de base de datos local:', fsErr.message);
                        process.exit(1);
                    }
                } else {
                    console.log('✅ Base de datos verificada y lista para usarse.');
                    fixSeedUserPasswords();
                    startServerOnceReady();
                }
            });
        });
    });
});

// Cuentas de prueba: se insertan si faltan y se les genera hash bcrypt real al arrancar
const SEED_USERS = [
    {
        email: 'admin@gmail.com',
        password: 'admin',
        first_name: 'Admin',
        last_name: 'Prueba',
        phone: '+57 300 000 0001',
        cedula: null,
        address: null,
        card_type: null,
        card_last_four: null,
        card_holder: null,
        card_expiry: null,
        role: 'admin'
    },
    {
        email: 'cliente@gmail.com',
        password: 'cliente',
        first_name: 'Cliente',
        last_name: 'Prueba',
        phone: '+57 300 000 0002',
        cedula: '1234567890',
        address: 'Calle Ficticia 123, Caracas',
        card_type: 'debit',
        card_last_four: '4242',
        card_holder: 'Cliente Prueba',
        card_expiry: '12/28',
        role: 'customer'
    }
];

async function fixSeedUserPasswords() {
    for (const seedUser of SEED_USERS) {
        db.query('SELECT password_hash FROM users WHERE email = ?', [seedUser.email], async (err, results) => {
            if (err) return;

            if (results.length === 0) {
                const placeholderHash = '$2a$10$placeholder_hash_change_in_production';
                const insertQuery = `
                    INSERT INTO users (first_name, last_name, email, password_hash, phone, cedula, address, card_type, card_last_four, card_holder, card_expiry, role)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.query(insertQuery, [
                    seedUser.first_name,
                    seedUser.last_name,
                    seedUser.email,
                    placeholderHash,
                    seedUser.phone,
                    seedUser.cedula,
                    seedUser.address,
                    seedUser.card_type,
                    seedUser.card_last_four,
                    seedUser.card_holder,
                    seedUser.card_expiry,
                    seedUser.role
                ], async (insertErr) => {
                    if (insertErr) {
                        console.error(`Error al crear cuenta seed ${seedUser.email}:`, insertErr);
                        return;
                    }
                    console.log(`Cuenta seed ${seedUser.email} creada.`);
                    await setSeedUserPassword(seedUser);
                });
                return;
            }

            if (results[0].password_hash.includes('placeholder')) {
                await setSeedUserPassword(seedUser);
            }
        });
    }
}

async function setSeedUserPassword(seedUser) {
    const realHash = await bcrypt.hash(seedUser.password, 10);
    db.query('UPDATE users SET password_hash = ? WHERE email = ?', [realHash, seedUser.email], (err) => {
        if (err) console.error(`Error al actualizar hash de ${seedUser.email}:`, err);
        else console.log(`Hash de ${seedUser.email} actualizado correctamente.`);
    });
}

// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json({ error: 'Token requerido' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};

// ============================================
// ENDPOINTS DE PRODUCTOS
// ============================================

app.get('/api/products', (req, res) => {
    const query = `
        SELECT p.id, p.name, p.description, p.price, p.image_url, p.sales_count, p.created_at, c.name as category_name 
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

app.get('/api/categories', (req, res) => {
    const query = "SELECT id, name, slug FROM categories";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener categorías');
        } else {
            res.json(results);
        }
    });
});

// ============================================
// ENDPOINTS DEL CARRITO
// ============================================

app.get('/api/cart/:session_id', (req, res) => {
    const { session_id } = req.params;
    const query = `
        SELECT c.product_id, c.quantity, p.name, p.price, p.image_url 
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.session_id = ? OR c.user_id = ?
    `;
    // We pass session_id twice, one for session_id, one for user_id (if it happens to be a user ID string in the future)
    db.query(query, [session_id, session_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener el carrito' });
        res.json(results);
    });
});

app.post('/api/cart', (req, res) => {
    const { session_id, product_id, quantity, user_id } = req.body;
    
    // Si tenemos user_id (autenticado) lo usamos, sino usamos el session_id anónimo
    const query = `
        INSERT INTO cart_items (session_id, user_id, product_id, quantity) 
        VALUES (?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;
    db.query(query, [session_id || null, user_id || null, product_id, quantity, quantity], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar al carrito' });
        res.status(200).json({ message: 'Agregado al carrito exitosamente' });
    });
});


app.put('/api/cart/:session_id/:product_id', (req, res) => {
    const { session_id, product_id } = req.params;
    const { quantity } = req.body;
    
    const query = "UPDATE cart_items SET quantity = ? WHERE (session_id = ? OR user_id = ?) AND product_id = ?";
    db.query(query, [quantity, session_id, session_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar cantidad' });
        res.status(200).json({ message: 'Cantidad actualizada' });
    });
});

app.delete('/api/cart/:session_id/:product_id', (req, res) => {
    const { session_id, product_id } = req.params;
    const query = "DELETE FROM cart_items WHERE (session_id = ? OR user_id = ?) AND product_id = ?";
    db.query(query, [session_id, session_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
        res.status(200).json({ message: 'Producto eliminado' });
    });
});

app.delete('/api/cart/:session_id', (req, res) => {
    const { session_id } = req.params;
    const query = "DELETE FROM cart_items WHERE session_id = ? OR user_id = ?";
    db.query(query, [session_id, session_id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al vaciar carrito' });
        res.status(200).json({ message: 'Carrito vaciado' });
    });
});

// ============================================
// ENDPOINT DE CONTACTO
// ============================================

app.post('/api/contact', (req, res) => {
    const { full_name, email, phone, message } = req.body;
    
    if (!full_name || !email || !message) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
    const query = `
        INSERT INTO contact_messages (full_name, email, phone, message)
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [full_name, email, phone || null, message], (err) => {
        if (err) return res.status(500).json({ error: 'Error al enviar el mensaje' });
        res.status(200).json({ message: 'Mensaje enviado exitosamente. ¡Nos contactaremos pronto!' });
    });
});

// ============================================
// ENDPOINTS DE USUARIOS (AUTH)
// ============================================

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, cedula, address, card_type, card_last_four, card_holder, card_expiry } = req.body;
    
    // Validaciones obligatorias
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, apellido, correo y contraseña son obligatorios' });
    }
    if (!phone) {
        return res.status(400).json({ error: 'El teléfono es obligatorio' });
    }
    if (!cedula) {
        return res.status(400).json({ error: 'La cédula es obligatoria' });
    }
    if (!address) {
        return res.status(400).json({ error: 'La dirección es obligatoria' });
    }
    if (!card_type || !card_last_four || !card_holder || !card_expiry) {
        return res.status(400).json({ error: 'Los datos de la tarjeta son obligatorios (tipo, últimos 4 dígitos, titular, vencimiento)' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (first_name, last_name, email, password_hash, phone, cedula, address, card_type, card_last_four, card_holder, card_expiry) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [first_name, last_name, email, hashedPassword, phone, cedula, address, card_type, card_last_four, card_holder, card_expiry], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'El correo ya está registrado' });
                }
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }
            
            // Auto-login: generar token
            const token = jwt.sign(
                { id: results.insertId, email: email, role: 'customer' }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );
            
            res.status(201).json({ 
                message: 'Usuario registrado exitosamente', 
                token,
                user: { 
                    id: results.insertId, 
                    first_name, 
                    last_name, 
                    email, 
                    phone, 
                    cedula, 
                    address,
                    card_type,
                    card_last_four,
                    card_holder,
                    card_expiry,
                    role: 'customer' 
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Login de usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    
    const query = "SELECT id, first_name, last_name, email, password_hash, phone, cedula, address, card_type, card_last_four, card_holder, card_expiry, role FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login exitoso',
            token,
            user: { 
                id: user.id, 
                first_name: user.first_name, 
                last_name: user.last_name, 
                email: user.email, 
                phone: user.phone,
                cedula: user.cedula,
                address: user.address,
                card_type: user.card_type,
                card_last_four: user.card_last_four,
                card_holder: user.card_holder,
                card_expiry: user.card_expiry,
                role: user.role 
            }
        });
    });
});

// ============================================
// ENDPOINTS DE PERFIL DE USUARIO
// ============================================

// Obtener perfil completo del usuario autenticado
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const query = "SELECT id, first_name, last_name, email, phone, cedula, address, card_type, card_last_four, card_holder, card_expiry, role, created_at FROM users WHERE id = ?";
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener perfil' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

// Actualizar datos personales
app.put('/api/user/profile', authenticateToken, (req, res) => {
    const { first_name, last_name, phone, cedula, address } = req.body;
    
    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
    }
    
    const query = "UPDATE users SET first_name = ?, last_name = ?, phone = ?, cedula = ?, address = ? WHERE id = ?";
    db.query(query, [first_name, last_name, phone || null, cedula || null, address || null, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
        res.json({ message: 'Perfil actualizado exitosamente' });
    });
});

// Actualizar método de pago
app.put('/api/user/payment', authenticateToken, (req, res) => {
    const { card_type, card_last_four, card_holder, card_expiry } = req.body;
    
    if (!card_type || !card_last_four || !card_holder || !card_expiry) {
        return res.status(400).json({ error: 'Todos los campos de la tarjeta son obligatorios' });
    }
    
    const query = "UPDATE users SET card_type = ?, card_last_four = ?, card_holder = ?, card_expiry = ? WHERE id = ?";
    db.query(query, [card_type, card_last_four, card_holder, card_expiry, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar método de pago' });
        res.json({ message: 'Método de pago actualizado exitosamente' });
    });
});

// Cambiar contraseña
app.put('/api/user/password', authenticateToken, async (req, res) => {
    const { current_password, new_password } = req.body;
    
    if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Contraseña actual y nueva son obligatorias' });
    }
    if (new_password.length < 4) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres' });
    }
    
    db.query("SELECT password_hash FROM users WHERE id = ?", [req.user.id], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        const isMatch = await bcrypt.compare(current_password, results[0].password_hash);
        if (!isMatch) return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        
        const newHash = await bcrypt.hash(new_password, 10);
        db.query("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: 'Error al cambiar contraseña' });
            res.json({ message: 'Contraseña cambiada exitosamente' });
        });
    });
});

// ============================================
// ENDPOINTS DE PEDIDOS
// ============================================

// Obtener pedidos del usuario autenticado
app.get('/api/user/orders', authenticateToken, (req, res) => {
    const query = `
        SELECT o.id, o.order_number, o.subtotal, o.delivery_fee, o.total, o.status, o.notes, o.created_at, o.updated_at
        FROM orders o 
        WHERE o.user_id = ? 
        ORDER BY o.created_at DESC
    `;
    db.query(query, [req.user.id], (err, orders) => {
        if (err) return res.status(500).json({ error: 'Error al obtener pedidos' });
        
        if (orders.length === 0) return res.json([]);
        
        // Obtener items de cada orden
        const orderIds = orders.map(o => o.id);
        const itemsQuery = `
            SELECT oi.order_id, oi.product_id, oi.quantity, oi.unit_price, p.name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id IN (?)
        `;
        db.query(itemsQuery, [orderIds], (err, items) => {
            if (err) return res.status(500).json({ error: 'Error al obtener items de pedidos' });
            
            // Agrupar items por order_id
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: items.filter(item => item.order_id === order.id)
            }));
            
            res.json(ordersWithItems);
        });
    });
});

// Crear nueva orden
app.post('/api/orders', authenticateToken, (req, res) => {
    const { subtotal, delivery_fee, total, notes, items } = req.body;
    const user_id = req.user.id;
    
    // Generar número de orden simple
    const order_number = 'MRK-' + Date.now().toString().slice(-6);
    
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: 'Error al iniciar la transacción' });
        
        // 1. Crear la orden
        const orderQuery = `
            INSERT INTO orders (user_id, order_number, subtotal, delivery_fee, total, notes) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(orderQuery, [user_id, order_number, subtotal, delivery_fee || 0, total, notes || null], (err, orderResult) => {
            if (err) {
                return db.rollback(() => res.status(500).json({ error: 'Error al crear la orden' }));
            }
            
            const order_id = orderResult.insertId;
            
            // 2. Insertar items
            if (!items || items.length === 0) {
                return db.rollback(() => res.status(400).json({ error: 'La orden debe tener productos' }));
            }
            
            const orderItemsData = items.map(item => [order_id, item.product_id, item.quantity, item.price]);
            const itemsQuery = "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?";
            
            db.query(itemsQuery, [orderItemsData], (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ error: 'Error al agregar productos a la orden' }));
                }
                
                // 3. Vaciar carrito
                const clearCartQuery = "DELETE FROM cart_items WHERE user_id = ?";
                db.query(clearCartQuery, [user_id], (err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: 'Error al limpiar carrito' }));
                    }
                    
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => res.status(500).json({ error: 'Error al finalizar orden' }));
                        }
                        res.status(201).json({ 
                            message: 'Orden creada exitosamente', 
                            order_id, 
                            order_number 
                        });
                    });
                });
            });
        });
    });
});

// ============================================
// ENDPOINTS DE DELIVERY CONFIG (público)
// ============================================

app.get('/api/delivery-config', (req, res) => {
    db.query("SELECT whatsapp_number, delivery_person_name FROM delivery_config WHERE id = 1", (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener config de delivery' });
        if (results.length === 0) return res.json({ whatsapp_number: '', delivery_person_name: '' });
        res.json(results[0]);
    });
});

// ============================================
// ENDPOINTS DE ADMIN
// ============================================

// Obtener todos los pedidos (admin)
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
    const query = `
        SELECT o.id, o.order_number, o.subtotal, o.delivery_fee, o.total, o.status, o.notes, o.created_at, o.updated_at,
               u.first_name, u.last_name, u.email, u.phone, u.address
        FROM orders o 
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `;
    db.query(query, (err, orders) => {
        if (err) return res.status(500).json({ error: 'Error al obtener pedidos' });
        
        if (orders.length === 0) return res.json([]);
        
        const orderIds = orders.map(o => o.id);
        const itemsQuery = `
            SELECT oi.order_id, oi.product_id, oi.quantity, oi.unit_price, p.name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id IN (?)
        `;
        db.query(itemsQuery, [orderIds], (err, items) => {
            if (err) return res.status(500).json({ error: 'Error al obtener items' });
            
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: items.filter(item => item.order_id === order.id)
            }));
            
            res.json(ordersWithItems);
        });
    });
});

// Actualizar estado de un pedido (admin)
app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }
    
    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar estado' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Orden no encontrada' });
        res.json({ message: 'Estado actualizado exitosamente' });
    });
});

// Obtener mensajes de contacto (admin)
app.get('/api/admin/messages', authenticateToken, requireAdmin, (req, res) => {
    db.query("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener mensajes' });
        res.json(results);
    });
});

// Marcar mensaje como leído (admin)
app.put('/api/admin/messages/:id/read', authenticateToken, requireAdmin, (req, res) => {
    db.query("UPDATE contact_messages SET is_read = 1 WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al marcar como leído' });
        res.json({ message: 'Mensaje marcado como leído' });
    });
});

// Actualizar config delivery (admin)
app.put('/api/admin/delivery-config', authenticateToken, requireAdmin, (req, res) => {
    const { whatsapp_number, delivery_person_name } = req.body;
    
    if (!whatsapp_number) {
        return res.status(400).json({ error: 'El número de WhatsApp es obligatorio' });
    }
    
    db.query(
        "INSERT INTO delivery_config (id, whatsapp_number, delivery_person_name) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE whatsapp_number = ?, delivery_person_name = ?",
        [whatsapp_number, delivery_person_name || 'Delivery Merakiies', whatsapp_number, delivery_person_name || 'Delivery Merakiies'],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar config de delivery' });
            res.json({ message: 'Configuración de delivery actualizada' });
        }
    );
});
