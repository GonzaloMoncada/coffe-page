'use client'
import React, { useEffect, useState } from 'react'
import MainTemplate from '../ui/templates/MainTemplate';
import { posts } from '../lib/getters';
import SkeletonTemplate from '../ui/Skeletons/SkeletonTemplate';
import { Post, PostData } from '../interface/types';
import { putPosts } from '../lib/actions';

export default function ManageMenu() {
    const [forms, setForms] = useState<number[]>([]);
    const [Data, setData] = useState<PostData[] | undefined>(undefined);
    const [oldData, setOldData] = useState<PostData[] | undefined>(undefined);
    const [change, setchange] = useState(false); //allow edit template 
    //update Data (Post) or delete Post
    const changeData = (updatedPost: Post, deletePosts: boolean) => {
        const index = Data?.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
            if (deletePosts) {
                const newData = Data?.filter((post, i) => i !== index);
                setData(newData);
            }
            else {
                const newData = Data?.map((post, i) => i === index ? updatedPost : post);
                setData(newData);
            }
        }

    }
    //function to get data
    const getData = async () => {
        const postData: PostData[] = await posts();
        if (postData) {
            setData(postData);
            setOldData(postData.map(post => ({ ...post })));
        }
    }
    //get data on load
    useEffect(() => {
        if (Data === undefined) {
            getData();
        }
    }, []);
    //function to add new form
    const handleButtonClick = () => {
        setForms([...forms, 1]); // Add new form
    };
    //increment or decrement template
    const handleButtonPlus = (index: number, increment: number, isEdit: boolean) => {
        //isEdit is true if the form is being edited
        const templateMax = 4; // maximum number of templates
        if (isEdit && Data) {
            setchange(true);
            if(Data[index].template+increment<=0 || Data[index].template+increment>=templateMax+1)
            return;
            //Create a copy of the object to modify
            const updatedItem = {
                ...Data[index],
                template: Data[index].template + increment, //increment or decrement 'template'
            };

            // Create a new copy of the Data array with the updated object
            const updatedData = [
                ...Data.slice(0, index),
                updatedItem,
                ...Data.slice(index + 1)
            ];
            setData(updatedData);
            const formData = new FormData();
            formData.append('data', JSON.stringify(updatedData));
            putPosts(formData);
        }
    }
    //function to remove form
    const handleRemoveForm = (index: number, isEdit: boolean) => {
        // Create a new copy of the Data array without the element at the given index
        if (isEdit && Data) {
            const updatedData = [
                ...Data.slice(0, index),
                ...Data.slice(index + 1)
            ];
            // Update the state
            setData(updatedData);
        }
        else {
            const updatedForms = forms.filter((_, i) => i !== index);
            // Update new posts template
            setForms(updatedForms);
        }
    };

    return (
        <div className='flex flex-col items-center pt-6 w-3/4 mx-auto'>
            {Data === undefined ? (
                <SkeletonTemplate />
            ) : (
                Data.map((data, index) => (
                    <div key={index} className='flex flex-col w-full'>
                        {/* Load posts from the database */}
                        <MainTemplate template={data.template} oldData={oldData && oldData[index] !== undefined ? oldData[index] : null} data={data} changeData={changeData} handleButtonPlus={handleButtonPlus} index={index} change={change} setChange={setchange} />
                    </div>
                ))
            )}
            {/* Add new posts */}
            {forms.map((form, index) => (
                <div key={index}>
                    <MainTemplate template={form} data={null} oldData={oldData && oldData[index] !== undefined ? oldData[index] : null} changeData={changeData} handleButtonPlus={handleButtonPlus} index={null} change={true} setChange={setchange} />
                    <button onClick={() => handleRemoveForm(index, false)}>Remove</button>
                </div>
            ))}
            <button type='button' onClick={handleButtonClick} className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'>
                ➕
            </button>
        </div>
    )
}
