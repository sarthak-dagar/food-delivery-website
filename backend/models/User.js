const db = require('../db');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const rowToUser = row => (row ? { id: row.id, name: row.name, email: row.email, password: row.password, createdAt: row.createdAt } : null);

const findById = async id => rowToUser(await db.get('SELECT * FROM users WHERE id = ?', id));

const findByEmail = async email => rowToUser(await db.get('SELECT * FROM users WHERE email = ?', email));

const createUser = async ({ name, email, password }) => {
    const id = randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    const createdAt = new Date().toISOString();
    await db.run('INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)', id, name, email, hash, createdAt);
    return findById(id);
};

const comparePassword = (user, candidatePassword) => bcrypt.compareSync(candidatePassword, user.password);

module.exports = { findById, findByEmail, createUser, comparePassword };
