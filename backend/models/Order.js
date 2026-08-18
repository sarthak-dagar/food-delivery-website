const db = require('../db');
const { randomUUID } = require('crypto');

const rowToOrder = row => (row ? { _id: row.id, id: row.id, userId: row.userId, total: row.total, status: row.status, createdAt: row.createdAt } : null);

const findById = id => {
    const order = rowToOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
    if (!order) return null;
    const items = db.prepare('SELECT productId, name, price, image, quantity FROM order_items WHERE orderId = ?').all(id)
        .map(i => ({
            product: { id: i.productId, name: i.name, price: i.price, image: i.image },
            quantity: i.quantity,
            price: i.price
        }));
    return { ...order, items };
};

const createOrder = (userId, items, total) => {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const tx = db.transaction(() => {
        db.prepare('INSERT INTO orders (id, userId, total, status, createdAt) VALUES (?, ?, ?, ?, ?)')
            .run(id, userId, total, 'pending', createdAt);
        const insertItem = db.prepare('INSERT INTO order_items (orderId, productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?, ?)');
        for (const item of items) {
            insertItem.run(id, item.product.id, item.product.name, item.product.price, item.product.image, item.quantity);
        }
    });
    tx();
    return findById(id);
};

const findByUser = userId =>
    db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(userId).map(rowToOrder);

const findAll = () => {
    const orders = db.prepare(`
        SELECT o.*, u.name AS userName, u.email AS userEmail
        FROM orders o JOIN users u ON u.id = o.userId
        ORDER BY o.createdAt DESC
    `).all();
    return orders.map(row => {
        const items = db.prepare('SELECT productId, name, price, image, quantity FROM order_items WHERE orderId = ?').all(row.id)
            .map(i => ({
                product: { id: i.productId, name: i.name, price: i.price, image: i.image },
                quantity: i.quantity,
                price: i.price
            }));
        return { ...rowToOrder(row), userName: row.userName, userEmail: row.userEmail, items };
    });
};

const updateStatus = (id, status) => {
    const res = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    return res.changes > 0 ? findById(id) : null;
};

module.exports = { createOrder, findById, findByUser, findAll, updateStatus };
