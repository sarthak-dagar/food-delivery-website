const db = require('../db');
const { randomUUID } = require('crypto');

const rowToOrder = row => (row ? { _id: row.id, id: row.id, userId: row.userId, total: row.total, status: row.status, createdAt: row.createdAt } : null);

const findById = async id => {
    const order = rowToOrder(await db.get('SELECT * FROM orders WHERE id = ?', id));
    if (!order) return null;
    const rows = await db.all('SELECT productId, name, price, image, quantity FROM order_items WHERE orderId = ?', id);
    const items = rows.map(i => ({
        product: { id: i.productId, name: i.name, price: i.price, image: i.image },
        quantity: i.quantity,
        price: i.price
    }));
    return { ...order, items };
};

const createOrder = async (userId, items, total) => {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    await db.transaction(async tx => {
        await tx.run('INSERT INTO orders (id, userId, total, status, createdAt) VALUES (?, ?, ?, ?, ?)', id, userId, total, 'pending', createdAt);
        for (const item of items) {
            await tx.run('INSERT INTO order_items (orderId, productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?, ?)',
                id, item.product.id, item.product.name, item.product.price, item.product.image, item.quantity);
        }
    });
    return findById(id);
};

const findByUser = async userId =>
    (await db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', userId)).map(rowToOrder);

const findAll = async () => {
    const rows = await db.all(`
        SELECT o.*, u.name AS userName, u.email AS userEmail
        FROM orders o JOIN users u ON u.id = o.userId
        ORDER BY o.createdAt DESC
    `);
    const out = [];
    for (const row of rows) {
        const items = (await db.all('SELECT productId, name, price, image, quantity FROM order_items WHERE orderId = ?', row.id))
            .map(i => ({
                product: { id: i.productId, name: i.name, price: i.price, image: i.image },
                quantity: i.quantity,
                price: i.price
            }));
        out.push({ ...rowToOrder(row), userName: row.userName, userEmail: row.userEmail, items });
    }
    return out;
};

const updateStatus = async (id, status) => {
    const r = await db.run('UPDATE orders SET status = ? WHERE id = ?', status, id);
    return r.changes > 0 ? findById(id) : null;
};

module.exports = { createOrder, findById, findByUser, findAll, updateStatus };
