import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.POSTGRES_USER,           
  host: process.env.DB_HOST,           
  database: process.env.POSTGRES_DATABASE,       
  password: process.env.POSTGRES_PASSWORD,   
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

const users = [
  { name: 'Admin', email: 'admin@admin.com', password: 'password' }
];

const products = [
  { name: 'Negro', description: 'Cafe negro de Africa', price: 10, idPost: '1' },
];

const posts = [
  { title: 'Cafes Go', image: 'https://cdn.discordapp.com/attachments/1062425698200985670/1271221264194998393/coffeIcon.jpeg?ex=66ba810f&is=66b92f8f&hm=5370c42c8586bc81291f358dd800328fb1a90ddfaee29abe53eacffd86256853&', position: 1, template: 1 },
];

async function seedUsers() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query(`
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
    `);
    // Create table for users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        hashedCookies TEXT
      );
    `);
    // Create table for posts
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        image TEXT NULL,
        position INTEGER NOT NULL,
        template INTEGER NOT NULL
      );
    `);
    // Create table for products
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        idPost INTEGER NOT NULL,
        FOREIGN KEY (idPost) REFERENCES posts(id)
      );
    `);

    // Insert users
    await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(`
          INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          ON CONFLICT (email) DO NOTHING;
        `, [user.name, user.email, hashedPassword]);
      })
    );

    // Insert posts
    await Promise.all(
      posts.map(async (post) => {
        return client.query(`
          INSERT INTO posts (title, image, position, template)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (title) DO NOTHING;
        `, [post.title, post.image, post.position, post.template]);
      })
    );

    // Insert products
    await Promise.all(
      products.map(async (product) => {
        return client.query(`
          INSERT INTO products (name, description, price, idPost)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) DO NOTHING;
        `, [product.name, product.description, product.price, product.idPost]);
      })
    );
    await client.query('COMMIT');
    console.log('Tables seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding Tables:', error);
  } finally {
    client.release();
  }
}

(async () => {
  await seedUsers();
})();
