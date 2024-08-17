'use client'
import React, { useEffect } from 'react'
import { products, posts } from '../lib/getters'
import { useState } from 'react'
import SkeletonNavMenu from '../ui/Skeletons/SkeletonNavMenu';
import { PostData, Product } from '../interface/types';
export default function menu() {
    const [postData, setPostData] = useState<PostData[] | undefined>(undefined);
    const getPosts = async () => {
        const post = await posts();
        setPostData(post);
    }
    useEffect(() => {
        if (postData)
            console.log(postData[0]);
    }, [postData]);
    useEffect(() => {
        getPosts();
    }, []);
    if (postData === undefined) {
        return <p>Loading...</p>; // Muestra un mensaje de carga mientras los datos se obtienen
    }
    return (
        <div>
            <nav className='w-full'>
                <ul className='flex justify-center gap-4'>
                    {postData===undefined ? (<SkeletonNavMenu/>): (
                        postData.map((data, index) => (
                            <li key={index}><a href='#'>{data.title}</a></li>
                        ))
                    )}
                </ul>
            </nav>
            {postData.length > 0 ? (
                postData.map((post, index) => (
                    <div key={index}>
                        <h2>{post.title}</h2>
                        {post.image ? (
                            <img src={post.image} alt={post.title} style={{ width: '100px', height: 'auto' }} />
                        ) : (
                            ''
                        )}
                        {post.products.map((product:Product, index:number) => (
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
