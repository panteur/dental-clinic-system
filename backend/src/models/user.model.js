const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await query(
      `INSERT INTO users (email, password, name, role, phone, specialty, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        userData.email,
        hashedPassword,
        userData.name,
        userData.role,
        userData.phone || null,
        userData.specialty || null
      ]
    );
    return result.insertId;
  }

  static async findById(id) {
    const users = await query('SELECT id, email, name, role, phone, specialty, created_at FROM users WHERE id = ?', [id]);
    return users[0] || null;
  }

  static async findByEmail(email) {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0] || null;
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT id, email, name, role, phone, specialty, created_at FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return query(sql, params);
  }

  static async update(id, userData) {
    const updates = [];
    const params = [];

    if (userData.name) {
      updates.push('name = ?');
      params.push(userData.name);
    }
    if (userData.phone) {
      updates.push('phone = ?');
      params.push(userData.phone);
    }
    if (userData.specialty) {
      updates.push('specialty = ?');
      params.push(userData.specialty);
    }
    if (userData.password) {
      updates.push('password = ?');
      params.push(await bcrypt.hash(userData.password, 10));
    }

    if (updates.length === 0) return false;

    params.push(id);
    const result = await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const result = await query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
