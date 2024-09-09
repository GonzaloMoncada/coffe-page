'use server';

import { sql } from "@vercel/postgres";
import { PostData } from "../interface/types";

export async function posts(): Promise<PostData[]> {
  const result = await sql`
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
  `;
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    image: row.image,
    position: row.position,
    template: row.template,
    products: row.products
  }));
}
export async function products(id: number) {
  const result = await sql`
      SELECT *
      FROM products
      WHERE id = ${id}
    `;
  return result.rows;
}
export async function users(id: number) {
  const result = await sql`
      SELECT *
      FROM users
    `;
  return result.rows;
}