'use server';

import { sql } from "@vercel/postgres";

export async function posts() {
    const result = await sql`
      SELECT 
      posts.id AS Id,
      posts.title AS Title,
      posts.image AS Image,
      categories.name AS categoryName,
      json_agg(
        json_build_object(
          'id', products.id,
          'name', products.name,
          'description', products.description,
          'price', products.price
        )
      ) AS products
    FROM 
      posts
    INNER JOIN 
      categories 
    ON 
      posts.idCategory = categories.id
    LEFT JOIN 
      products 
    ON 
      products.idPost = posts.id
    GROUP BY 
      posts.id, categories.name
  `;
    return result.rows;
  }
  export async function categories( id:number ) {
    const result = await sql`
      SELECT *
      FROM categories
      WHERE id = ${id}
    `;
    return result.rows;
  }
  export async function products( id:number ) {
    const result = await sql`
      SELECT *
      FROM products
      WHERE id = ${id}
    `;
    return result.rows;
  }
  export async function users( id:number ) {
    const result = await sql`
      SELECT *
      FROM users
    `;
    return result.rows;
  }