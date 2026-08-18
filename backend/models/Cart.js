const db = require('../db');
const { randomUUID } = require('crypto');

const findCart = async userId => await db.get('SELECT * FROM carts WHERE userId = ?', userId);

const getOrCreate = async userId => {
    let cart = await findCart(userId);
    if (!cart) {
        const id = randomUUID();
        await db.run('INSERT INTO carts (id, userId) VALUES (?, ?)', id, userId);
        cart = { id, userId };
    }
    return cart;
};

const getItems = async userId => {
    const cart = await findCart(userId);
    if (!cart) return [];
    const rows = await db.all(`
        SELECT ci.id AS itemId, ci.productId, ci.quantity, p.name, p.price, p.image
        FROM cart_items ci
        JOIN products p ON p.id = ci.productId
        WHERE ci.cartId = ?
        ORDER BY ci.rowid DESC
    `, cart.id);
    return rows.map(row => ({
        _id: row.itemId,
        product: { _id: String(row.productId), id: row.productId, name: row.name, price: row.price, image: row.image },
        quantity: row.quantity
    }));
};

const addItem = async (userId, productId, qty) => {
    const cart = await getOrCreate(userId);
    const existing = await db.get('SELECT * FROM cart_items WHERE cartId = ? AND productId = ?', cart.id, productId);
    if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty <= 0) {
            await db.run('DELETE FROM cart_items WHERE id = ?', existing.id);
        } else {
            await db.run('UPDATE cart_items SET quantity = ? WHERE id = ?', newQty, existing.id);
        }
    } else {
        if (qty < 0) return { error: 'Invalid quantity' };
        await db.run('INSERT INTO cart_items (id, cartId, productId, quantity) VALUES (?, ?, ?, ?)', randomUUID(), cart.id, productId, qty);
    }
    return { ok: true };
};

const removeItem = async (userId, itemId) => {
    const cart = await findCart(userId);
    if (!cart) return false;
    const r = await db.run('DELETE FROM cart_items WHERE id = ? AND cartId = ?', itemId, cart.id);
    return r.changes > 0;
};

const clear = async userId => {
    const cart = await findCart(userId);
    if (!cart) return;
    await db.run('DELETE FROM cart_items WHERE cartId = ?', cart.id);
};

module.exports = { findCart, getItems, addItem, removeItem, clear };
