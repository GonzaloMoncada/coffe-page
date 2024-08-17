import React from 'react'
import { Template1, Template2, Template3, Template4 } from './Template'
import { Post } from '@/app/interface/types';

interface MainTemplateProps {
    template: number;
    data: Post | null;
}
export default function MainTemplate( {template, data}: MainTemplateProps ) {
    
    switch (template) {
        case 1:
            return <Template1 data={data} />
        case 2:
            return <Template2 data={data} />
        case 3:
            return <Template3 data={data} />
        case 4:
            return <Template4 data={data} />
    }
}
