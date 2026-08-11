const db = require('../db');
const { randomUUID } = require('crypto');

const findCart = userId => db.prepare('SELECT * FROM carts WHERE userId = ?').get(userId) || null;

const getOrCreate = userId => {
    let cart = findCart(userId);
    if (!cart) {
        const id = randomUUID();
        db.prepare('INSERT INTO carts (id, userId) VALUES (?, ?)').run(id, userId);
        cart = { id, userId };
    }
    return cart;
};

const getItems = userId => {
    const cart = findCart(userId);
    if (!cart) return [];
    return db.prepare(`
        SELECT ci.id AS itemId, ci.productId, ci.quantity, p.name, p.price, p.image
        FROM cart_items ci
        JOIN products p ON p.id = ci.productId
        WHERE ci.cartId = ?
        ORDER BY ci.rowid DESC
    `).all(cart.id).map(row => ({
        _id: row.itemId,
        product: { _id: String(row.productId), id: row.productId, name: row.name, price: row.price, image: row.image },
        quantity: row.quantity
    }));
};

const addItem = (userId, productId, qty) => {
    const cart = getOrCreate(userId);
    const existing = db.prepare('SELECT * FROM cart_items WHERE cartId = ? AND productId = ?').get(cart.id, productId);
    if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty <= 0) {
            db.prepare('DELETE FROM cart_items WHERE id = ?').run(existing.id);
        } else {
            db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
        }
    } else {
        if (qty < 0) return { error: 'Invalid quantity' };
        db.prepare('INSERT INTO cart_items (id, cartId, productId, quantity) VALUES (?, ?, ?, ?)')
            .run(randomUUID(), cart.id, productId, qty);
    }
    return { ok: true };
};

const removeItem = (userId, itemId) => {
    const cart = findCart(userId);
    if (!cart) return false;
    return db.prepare('DELETE FROM cart_items WHERE id = ? AND cartId = ?').run(itemId, cart.id).changes > 0;
};

const clear = userId => {
    const cart = findCart(userId);
    if (!cart) return;
    db.prepare('DELETE FROM cart_items WHERE cartId = ?').run(cart.id);
};

module.exports = { findCart, getItems, addItem, removeItem, clear };
