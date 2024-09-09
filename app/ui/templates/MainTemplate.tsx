import React from 'react'
import { Template1, Template2, Template3, Template4 } from './Template'
import { Post } from '@/app/interface/types';

interface MainTemplateProps {
    template: number;
    data: Post | null;
    changeData: Function;
    handleButtonPlus : Function;
    index: number | null;
    oldData: Post | null;
    change? : boolean;
    setChange?: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MainTemplate( {template, data, changeData, handleButtonPlus, index, oldData, change, setChange}: MainTemplateProps ) {
    
    switch (template) {
        case 1:
            return <Template1 data={data} changeData={changeData} handleButtonPlus={handleButtonPlus} index={index} oldData={oldData} change={change} setChange={setChange}/>
        case 2:
            return <Template2 data={data} changeData={changeData} handleButtonPlus={handleButtonPlus} index={index} oldData={oldData} change={change} setChange={setChange}/>
            case 3:
            return <Template3 data={data} changeData={changeData} handleButtonPlus={handleButtonPlus} index={index} oldData={oldData} change={change} setChange={setChange}/>
        case 4:
            return <Template4 data={data} changeData={changeData} handleButtonPlus={handleButtonPlus} index={index} oldData={oldData} change={change} setChange={setChange}/>
    }
}
