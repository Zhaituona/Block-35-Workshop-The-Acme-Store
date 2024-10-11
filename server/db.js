const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: 'postgres://localhost:5432/acme_store_db' 
});

// Data layer methods

const createTables = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS favorites, products, users;
    
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE products (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE favorites (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      product_id UUID REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );
  `;
  await pool.query(createTableQuery);
  console.log("Tables created successfully");
};

const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  const result = await pool.query(
    `INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *`,
    [userId, username, hashedPassword]
  );
  return result.rows[0];
};

const fetchUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
};

const createProduct = async (name) => {
  const productId = uuidv4();
  const result = await pool.query(
    `INSERT INTO products (id, name) VALUES ($1, $2) RETURNING *`,
    [productId, name]
  );
  return result.rows[0];
};

const fetchProducts = async () => {
  const result = await pool.query(`SELECT * FROM products`);
  return result.rows;
};

const createFavorite = async (userId, productId) => {
  const favoriteId = uuidv4();
  const result = await pool.query(
    `INSERT INTO favorites (id, user_id, product_id) VALUES ($1, $2, $3) RETURNING *`,
    [favoriteId, userId, productId]
  );
  return result.rows[0];
};

const fetchFavorites = async (userId) => {
  const result = await pool.query(`SELECT * FROM favorites WHERE user_id = $1`, [userId]);
  return result.rows;
};

const destroyFavorite = async (favoriteId) => {
  await pool.query(`DELETE FROM favorites WHERE id = $1`, [favoriteId]);
};

module.exports = {
  createTables,
  createUser,
  fetchUsers,
  createProduct,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
