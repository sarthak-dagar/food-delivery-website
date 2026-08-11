const db = require('../db');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const rowToUser = row => (row ? { id: row.id, name: row.name, email: row.email, password: row.password, createdAt: row.createdAt } : null);

const findById = id => rowToUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));

const findByEmail = email => rowToUser(db.prepare('SELECT * FROM users WHERE email = ?').get(email));

const createUser = ({ name, email, password }) => {
    const id = randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    const createdAt = new Date().toISOString();
    db.prepare('INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)')
        .run(id, name, email, hash, createdAt);
    return findById(id);
};

const comparePassword = (user, candidatePassword) => bcrypt.compareSync(candidatePassword, user.password);

module.exports = { findById, findByEmail, createUser, comparePassword };
