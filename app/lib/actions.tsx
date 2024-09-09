'use server';

import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';
import { Post } from "../interface/types";

export async function createUser(formData: FormData) {
    // Obtener los valores del formulario y asegurar que no sean nulos
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    // Verificar que todos los campos están presentes
    if (name === null || email === null || password === null) {
        throw new Error('Missing required form data');
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el usuario en la base de datos
    await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword});
    `;
}
//login

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;
    if (email === null || password === null) {
        throw new Error('Missing required form data');
    }
    // Obtener el usuario desde la base de datos
    const result = await sql`
        SELECT *
        FROM users
        WHERE email = ${email}
    `;
    // Verificar si el usuario existe
    const user = result.rows[0]; // Obtener la primera fila del resultado

    if (!user) {
        throw new Error('User not found');
    }

    // Comparar la contraseña ingresada con la contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Create a string combining email and password
    const combinedCredentials = `${email}:${password}`;

    // Hash the combined credentials
    const hashedCredentials = await bcrypt.hash(combinedCredentials, 10);

    // Save the hashed credentials in the database
    await sql`
        UPDATE users
        SET hashedCookies = ${hashedCredentials}
        WHERE email = ${email}
    `;

    return { hashedCredentials };
    //redirect('/dashboard');
}
export async function auth(cookie: string) {

    const cookieValue = cookie;
    if (!cookieValue) {
        return false;
    }
    try {
        const result = await sql`
        SELECT *
        FROM users
        WHERE hashedcookies = ${cookieValue}
        `;

        const user = result.rows[0];

        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function putPosts(formData: FormData) {
    const jsonString = formData.get('data') as string;
    if (!jsonString) {
        throw new Error('No data provided');
    }
    const data = JSON.parse(jsonString); 
    
    if(data.length == undefined){
        try {
            const id = data.id;
            const title = data.title;
            const template = data.template;
            const image = data.image;
            const position = data.position;
            await sql`
                UPDATE posts
                SET title = ${title}, image = ${image}, position = ${position}, template = ${template}
                WHERE id = ${id};
            `;
            data.products.forEach(async (product: any) => {
                const id = product.id;
                const name = product.name;
                const description = product.description;
                const price = product.price;
                await sql`
                    UPDATE products
                    SET name = ${name}, price = ${price}, description = ${description}
                    WHERE id = ${id};
                `;
            })
            console.log('Data updated successfully.');
        } catch (error) {
            console.error('Error updating data:', error);
            throw new Error('Failed to update data');
        }
    }
    else{
    try {
        for (const item of data) {
            const id = item.id;
            const title = item.title;
            const template = item.template;
            const image = item.image;
            const position = item.position;
            
            // Ejecutar la consulta de actualización
            await sql`
                UPDATE posts
                SET title = ${title}, image = ${image}, position = ${position}, template = ${template}
                WHERE id = ${id};
            `;
        }
        console.log('Data updated successfully.');
    } catch (error) {
        console.error('Error updating data:', error);
        throw new Error('Failed to update data');
    }
    }
}
export async function deletePost(data: Post) {
    //delete products 
    await sql`
        DELETE FROM products
        WHERE idPost = ${data.id};
    `;
    //delete posts
    await sql`
        DELETE FROM posts
        WHERE id = ${data.id};
    `;
}
export async function putProducts(formData: FormData) {
    const numbersSet = new Set<number>();
    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value.toString();
    });
    for (const key in formDataObject) {
        const match = key.match(/\d+$/);
        if (match) {
            const number = parseInt(match[0], 10); // Convertir el número de cadena a entero
            numbersSet.add(number); // Agregar al Set, eliminando duplicados automáticamente
        }
    }

    // Convertir el Set a un array y ordenar en orden ascendente
    const numbers = Array.from(numbersSet).sort((a, b) => a - b);
    for (let i = 0; i < numbers.length; i++) {
        const objectProduct = {
            id: numbers[i],
            name: formData.get(`name${numbers[i]}`) as string,
            description: formData.get(`description${numbers[i]}`) as string,
            price: formData.get(`price${numbers[i]}`) as string,
        }
        await sql`
                UPDATE products
                SET name = ${objectProduct.name}, description = ${objectProduct.description}, price = ${objectProduct.price}
                WHERE id = ${objectProduct.id};
            `;
    }
}