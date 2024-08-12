import dotenv from 'dotenv';
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { title } from 'process';

dotenv.config();

const users = [
  { name: 'Admin', email: 'admin@admin.com', password: 'password' }
];

const products = [
  { name: 'Negro', description: 'Cafe negro de Africa', price: 10, idPost: '1' },
];
const categories = [
  { name: 'Cafe' },
]
const posts = [
  { title: 'Cafes Go', image: 'https://cdn.discordapp.com/attachments/1062425698200985670/1271221264194998393/coffeIcon.jpeg?ex=66ba810f&is=66b92f8f&hm=5370c42c8586bc81291f358dd800328fb1a90ddfaee29abe53eacffd86256853&', idCategory: '1' },
]
async function seedUsers() {
  const client = await db.connect();
  try {
    await client.sql`BEGIN`;
    // Create table for users
    await client.sql`
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  hashedCookies TEXT
);
`;

    // Create table for categories
    await client.sql`
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE 
);
`;

    // Create table for posts
    await client.sql`
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  image TEXT NULL,
  idCategory INTEGER NOT NULL,
  FOREIGN KEY (idCategory) REFERENCES categories(id)
);
`;
    // Create table for products
    await client.sql`
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,  
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  idPost INTEGER NOT NULL,
  FOREIGN KEY (idPost) REFERENCES posts(id)
);
`;



    // Insert users
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users (name, email, password)
          VALUES (${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (email) DO NOTHING;
        `;
      })
    );
    // Insert categories
    const insertedCategories = await Promise.all(
      categories.map(async (category) => {
        return client.sql`
          INSERT INTO categories (name)
          VALUES (${category.name})
          ON CONFLICT (name) DO NOTHING;
        `;
      })
    );

    // Insert posts
    const insertedPosts = await Promise.all(
      posts.map(async (post) => {
        return client.sql`
          INSERT INTO posts (title, image, idCategory)
          VALUES (${post.title}, ${post.image}, ${post.idCategory})
          ON CONFLICT (title) DO NOTHING;
        `;
      })
    );
    // Insert products
    const insertedProducts = await Promise.all(
      products.map(async (product) => {
        return client.sql`
      INSERT INTO products (name, description, price, idPost)
      VALUES (${product.name}, ${product.description}, ${product.price}, ${product.idPost})
      ON CONFLICT (name) DO NOTHING;
    `;
      })
    );
    await client.sql`COMMIT`;

    console.log('Tables seeded successfully');
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error('Error seeding Tables:', error);
  } finally {
    client.release();
  }
}

(async () => {
  await seedUsers();
})();
