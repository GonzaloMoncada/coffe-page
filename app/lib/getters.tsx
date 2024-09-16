'use server';

import { PostData } from "../interface/types";
import pkg from 'pg';
import { pool } from '../../scripts/seed';
const { Pool } = pkg;
// Configuración de la conexión a la base de datos

export async function posts(): Promise<PostData[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                posts.id AS Id,
                posts.title AS Title,
                posts.image AS Image,
                posts.position AS Position,
                posts.template AS Template,
                json_agg(
                    json_build_object(
                        'id', products.id,
                        'name', products.name,
                        'description', products.description,
                        'price', products.price
                    )
                    ORDER BY products.id
                ) AS products
            FROM 
                posts
            LEFT JOIN 
                products 
            ON 
                products.idPost = posts.id
            GROUP BY
                posts.id, posts.title, posts.image, posts.position, posts.template
            ORDER BY 
                posts.position
        `);
        return result.rows.map(row => ({
            id: row.id,
            title: row.title,
            image: row.image,
            position: row.position,
            template: row.template,
            products: row.products
        }));
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
    } finally {
        client.release();
    }
}

export async function products(id: number) {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT *
            FROM products
            WHERE id = $1
        `, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Failed to fetch product');
    } finally {
        client.release();
    }
}

export async function users(id: number) {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT *
            FROM users
        `);
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    } finally {
        client.release();
    }
}
