'use client'
import React, { useEffect, useState } from 'react'
import useAuthCheck from '../utils/useAuthCheck';
import MainTemplate from '../ui/templates/MainTemplate';
import { posts } from '../lib/getters';
import SkeletonTemplate from '../ui/Skeletons/SkeletonTemplate';
import { putPosts } from '../lib/actions';
import SkeletonNavMenu from '../ui/Skeletons/SkeletonNavMenu';
import { Post, PostData } from '../interface/types';
import { QueryResultRow } from '@vercel/postgres';

export default function ManageMenu() {

    const [forms, setForms] = useState<number[]>([]);
    const [Data, setData] = useState<PostData[] | undefined>(undefined);
    const getData = async () => {
        const postData:PostData[] = await posts();
        setData(postData);
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
        <div className='flex flex-col items-center pt-6'>
            {/* Load posts from the database */}
            {Data === undefined ? (
                <SkeletonTemplate />
            ) : (
                Data.map((data, index) => (
                    <div key={index} className='flex flex-col items-center'>
                        <MainTemplate template={data.template} data={data} />
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
            <form action={putPosts} className='flex flex-col items-center'>
                {forms.map((form, index) => (
                    <div key={index}>
                        <MainTemplate template={form} data={null} />
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
                {Data ? Data[0].template : 0}
                <input type="hidden" name="data" value={JSON.stringify(Data)} />
                <button type='submit'>Guardar</button>
            </form>
        </div>
    )
}
