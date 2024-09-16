'use server';
import bcrypt from 'bcrypt';
import { Post } from "../interface/types";
import pkg from 'pg';
import { pool } from '../../scripts/seed';

const { Pool } = pkg;

// Función para crear un nuevo usuario
export async function createUser(formData: FormData) {
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    if (name === null || email === null || password === null) {
        throw new Error('Missing required form data');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const client = await pool.connect();
    try {
        await client.query(`
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3);
        `, [name, email, hashedPassword]);
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    } finally {
        client.release();
    }
}

// Función para iniciar sesión de un usuario
export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    if (email === null || password === null) {
        throw new Error('Missing required form data');
    }

    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);

        const user = result.rows[0];
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const combinedCredentials = `${email}:${password}`;
        const hashedCredentials = await bcrypt.hash(combinedCredentials, 10);

        await client.query(`
            UPDATE users
            SET hashedCookies = $1
            WHERE email = $2
        `, [hashedCredentials, email]);

        return { hashedCredentials };
    } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Login failed');
    } finally {
        client.release();
    }
}

// Función para autenticar al usuario
export async function auth(cookie: string) {
    if (!cookie) {
        return false;
    }

    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM users WHERE hashedCookies = $1
        `, [cookie]);

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return false;
    } finally {
        client.release();
    }
}

// Función para actualizar los posts
export async function putPosts(formData: FormData) {
    const jsonString = formData.get('data') as string;
    if (!jsonString) {
        throw new Error('No data provided');
    }
    
    const data = JSON.parse(jsonString);

    const client = await pool.connect();
    try {
        if (Array.isArray(data)) {
            for (const item of data) {
                const { id, title, template, image, position } = item;
                await client.query(`
                    UPDATE posts
                    SET title = $1, image = $2, position = $3, template = $4
                    WHERE id = $5
                `, [title, image, position, template, id]);
            }
        } else {
            const { id, title, template, image, position, products } = data;
            await client.query(`
                UPDATE posts
                SET title = $1, image = $2, position = $3, template = $4
                WHERE id = $5
            `, [title, image, position, template, id]);

            for (const product of products) {
                const { id: productId, name, description, price } = product;
                await client.query(`
                    UPDATE products
                    SET name = $1, description = $2, price = $3
                    WHERE id = $4
                `, [name, description, price, productId]);
            }
        }
    } catch (error) {
        console.error('Error updating posts:', error);
        throw new Error('Failed to update posts');
    } finally {
        client.release();
    }
}

// Función para eliminar un post
export async function deletePost(data: Post) {
    const client = await pool.connect();
    try {
        await client.query(`
            DELETE FROM products WHERE idPost = $1
        `, [data.id]);

        await client.query(`
            DELETE FROM posts WHERE id = $1
        `, [data.id]);
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    } finally {
        client.release();
    }
}

// Función para actualizar los productos
export async function putProducts(formData: FormData) {
    const numbersSet = new Set<number>();
    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value.toString();
    });

    for (const key in formDataObject) {
        const match = key.match(/\d+$/);
        if (match) {
            const number = parseInt(match[0], 10);
            numbersSet.add(number);
        }
    }

    const numbers = Array.from(numbersSet).sort((a, b) => a - b);

    const client = await pool.connect();
    try {
        for (const number of numbers) {
            const objectProduct = {
                id: number,
                name: formData.get(`name${number}`) as string,
                description: formData.get(`description${number}`) as string,
                price: formData.get(`price${number}`) as string,
            };

            await client.query(`
                UPDATE products
                SET name = $1, description = $2, price = $3
                WHERE id = $4
            `, [objectProduct.name, objectProduct.description, objectProduct.price, objectProduct.id]);
        }
    } catch (error) {
        console.error('Error updating products:', error);
        throw new Error('Failed to update products');
    } finally {
        client.release();
    }
}