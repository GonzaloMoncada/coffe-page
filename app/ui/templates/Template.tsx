import React from 'react'

interface TemplateProps {
  data: any | null;
}
export function Template1({ data }: TemplateProps) {
  return <div className='flex flex-col items-center'>
    <span>Template 1</span>
    <h1 className='text-3xl'>{data?.title}</h1>
    {!data?.products ? '' : 
    (
      data.products.map((product:any, index:number) => (
        <div key={index} className='flex flex-row gap-6 items-center mt-2'>
          <div>
          <div className='text-xl'>{product.name}</div>
          <div className='text-sm'>{product.description}</div>
          </div>
          <div className='text-xl'>{product.price}</div>
          
        </div>
      ))
    )}
  </div>;
}

export function Template2({ data }: TemplateProps) {
  return <div>{data?.title}2</div>;
}

export function Template3({ data }: TemplateProps) {
  return <div>{data?.title}3</div>;
}

export function Template4({ data }: TemplateProps) {
  return <div>{data?.title}4</div>;
}