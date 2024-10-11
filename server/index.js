const express = require('express');
const { 
  createTables, 
  createUser, 
  fetchUsers, 
  createProduct, 
  fetchProducts, 
  createFavorite, 
  fetchFavorites, 
  destroyFavorite 
} = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

// Create Tables on Init
createTables();

// Routes

// GET /api/users - Returns an array of users
app.get('/api/users', async (req, res) => {
  const users = await fetchUsers();
  res.json(users);
});

// GET /api/products - Returns an array of products
app.get('/api/products', async (req, res) => {
  const products = await fetchProducts();
  res.json(products);
});

// GET /api/users/:id/favorites - Returns an array of favorites for a user
app.get('/api/users/:id/favorites', async (req, res) => {
  const favorites = await fetchFavorites(req.params.id);
  res.json(favorites);
});

// POST /api/users/:id/favorites - Create a favorite
app.post('/api/users/:id/favorites', async (req, res) => {
  const { product_id } = req.body;
  const favorite = await createFavorite(req.params.id, product_id);
  res.status(201).json(favorite);
});

// DELETE /api/users/:userId/favorites/:id - Delete a favorite
app.delete('/api/users/:userId/favorites/:id', async (req, res) => {
  await destroyFavorite(req.params.id);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
