'use client'
import React, { useEffect, useState } from 'react'
import MainTemplate from '../ui/templates/MainTemplate';
import { posts } from '../lib/getters';
import SkeletonTemplate from '../ui/Skeletons/SkeletonTemplate';
import { Post, PostData } from '../interface/types';

export default function ManageMenu() {

    const [forms, setForms] = useState<number[]>([]);
    const [Data, setData] = useState<PostData[] | undefined>(undefined);
    const [oldData, setOldData] = useState<PostData[] | undefined>(undefined);
    const [change, setchange] = useState(false);
    const changeData = (updatedPost: Post, deletePosts: boolean) => {
        console.log(oldData);
        console.log(Data);
        
        
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
    const getData = async () => {
        const postData: PostData[] = await posts();
        
        setData(postData);
        setOldData(postData.map(post => ({ ...post })));
    }
    useEffect(() => {
        if (Data === undefined) {
            getData();
        }
    }, [Data]);
    const handleButtonClick = () => {
        setForms([...forms, 1]); // Add new form
    };
    const handleButtonPlus = (index: number, increment: number, isEdit: boolean) => {
        if (isEdit && Data) {
            setchange(true);
            // Crear una copia del objeto a modificar
            const updatedItem = {
                ...Data[index],
                template: Data[index].template + increment, // actualizar 'template'
            };

            // Crear una nueva copia del array de Data con el objeto actualizado
            const updatedData = [
                ...Data.slice(0, index),
                updatedItem,
                ...Data.slice(index + 1)
            ];

            // Actualizar el estado con el nuevo array
            setData(updatedData);
        }
        else {
            setForms([...forms.slice(0, index), forms[index] + increment, ...forms.slice(index + 1, forms.length)]);
        }
    }
    const handleRemoveForm = (index: number, isEdit: boolean) => {
        // Crear una nueva copia del array excluyendo el elemento en el índice dado
        // Actualizar el estado con el nuevo array
        if (isEdit && Data) {
            const updatedData = [
                ...Data.slice(0, index),
                ...Data.slice(index + 1)
            ];
            setData(updatedData);
        }
        else {
            const updatedForms = forms.filter((_, i) => i !== index);
            setForms(updatedForms);
        }
    };

    return (
        <div className='flex flex-col items-center pt-6 w-3/4 mx-auto'>
            {/* Load posts from the database */}
            {Data === undefined ? (
                <SkeletonTemplate />
            ) : (
                Data.map((data, index) => (
                    <div key={index} className='flex flex-col w-full'>
                        <MainTemplate template={data.template} oldData={oldData && oldData[index] !== undefined ? oldData[index] : null} data={data} changeData={changeData} handleButtonPlus={handleButtonPlus} index={index} change={change} setChange={setchange}/>
                        <button onClick={() => handleRemoveForm(index, true)}>Remove</button>
                        <div className="inline-flex">
                            <button className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${data.template <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => data.template > 1 && handleButtonPlus(index, -1, true)}
                                disabled={data.template <= 1}
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => data.template < 4 && handleButtonPlus(index, 1, true)}
                                disabled={data.template >= 4}
                                className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${data.template >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Next
                            </button>
                        </div>
                    </div>
                ))
            )}
            {/* Add new posts */}
            {forms.map((form, index) => (
                <div key={index}>
                    <MainTemplate template={form} data={null} oldData={oldData && oldData[index] !== undefined ? oldData[index] : null} changeData={changeData} handleButtonPlus={handleButtonPlus} index={null} change={change} setChange={setchange}/>
                    <button onClick={() => handleRemoveForm(index, false)}>Remove</button>
                    <div className="inline-flex">
                        <button className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${form <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => form > 1 && handleButtonPlus(index, -1, false)}
                            disabled={form <= 1}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => form < 4 && handleButtonPlus(index, 1, false)}
                            disabled={form >= 4}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${form >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Next
                        </button>
                    </div>
                </div>
            ))}
            <button type='button' onClick={handleButtonClick} className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'>
                ➕
            </button>
        </div>
    )
}
