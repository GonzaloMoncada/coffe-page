'use client'
import React, { useEffect } from 'react'
import { categories, products, posts } from '../lib/getters'
import { useState } from 'react'
export default function menu() {
    const [postData, setPostData] = useState<any[] | undefined>(undefined);
    const getCategory = async () => {
        const post = await posts();
        setPostData(post);
    }
    useEffect(() => {
        if (postData)
            console.log(postData[0]);
    }, [postData]);
    useEffect(() => {
        getCategory();
    }, []);
    if (postData === undefined) {
        return <p>Loading...</p>; // Muestra un mensaje de carga mientras los datos se obtienen
    }
    return (
        <div>
            {postData.length > 0 ? (
                postData.map((post, index) => (
                    <div key={index}>
                        <h2>{post.title}</h2>
                        {post.image ? (
                            <img src={post.image} alt={post.title} style={{ width: '100px', height: 'auto' }} />
                        ) : (
                            ''
                        )}
                        {post.products.map((product:any, index:number) => (
                            <div key={index}>
                                <p>{product.name}</p>
                                <p>{product.description}</p>
                                <p>{product.price}</p>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No posts available.</p> // Mensaje si no hay posts
            )}
        </div>
    )
}
