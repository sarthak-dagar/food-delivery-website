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

module.exports = { createOrder, findById, findByUser };
