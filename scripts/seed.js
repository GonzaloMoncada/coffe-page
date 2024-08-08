import dotenv from 'dotenv';
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

dotenv.config();

const users = [
  { name: 'Admin', email: 'admin@admin.com', password: 'password' }
];

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

    //Create table for products
    await client.sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL
      );
    `;

    // Create table for categories
    await client.sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    // Create table for posts
    await client.sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        idProduct UUID NOT NULL,
        FOREIGN KEY (idProduct) REFERENCES products(id),
        idCategory UUID NOT NULL,
        FOREIGN KEY (idCategory) REFERENCES categories(id)
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
