'use client'
import React, { useEffect, useState } from 'react'
import useAuthCheck from '../utils/useAuthCheck';
import MainTemplate from '../ui/templates/MainTemplate';
import { posts } from '../lib/getters';
import SkeletonTemplate from '../ui/Skeletons/SkeletonTemplate';

export default function ManageMenu() {

    const [forms, setForms] = useState<number[]>([]);
    const [Data, setData] = useState<any[] | undefined>(undefined);
    const getData = async () => {
        const postData = await posts();
        setData(postData);
    }
    useEffect(() => {
        if (Data===undefined)
        {
            getData();
        }
    }, [Data]);
    useEffect(() => {
        if (Data)
        console.log(Data[0].template);
    }, [Data]);
    const handleButtonClick = () => {
        setForms([...forms, 1]); // Add new form
    };
    const handleButtonPlus = (index: number, increment: number) => {
        setForms([...forms.slice(0, index), forms[index] + increment, ...forms.slice(index + 1, forms.length)]);
    }

    return (
        <div className='flex flex-col items-center pt-6'>
            {/* Load posts from the database */}
            {Data === undefined ? (
                <SkeletonTemplate />
            ) : (
                Data.map((data, index) => (
                    <div key={index} className='flex flex-col items-center'>
                        <MainTemplate template={data.template} data={data} />
                    </div>
                ))
            )}
            {/* Add new posts */}
            {forms.map((form, index) => (
                <div key={index}>
                    <MainTemplate template={form} data={null} />
                    <div className="inline-flex">
                        <button className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${form <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => form > 1 && handleButtonPlus(index, -1)}
                            disabled={form <= 1}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => form < 4 && handleButtonPlus(index, 1)}
                            disabled={form >= 4}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${form >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Next
                        </button>
                    </div>
                </div>
            ))}
            <button onClick={handleButtonClick} className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'>
                ➕
            </button>
        </div>
    )
}
