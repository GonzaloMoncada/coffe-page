'use server';

import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';

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