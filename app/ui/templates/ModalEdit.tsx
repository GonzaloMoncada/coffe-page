import React, { useState } from 'react'
import InputText from '../InputText';
import { Post, Product } from '@/app/interface/types';
import { putProducts } from '@/app/lib/actions';

interface ModalEditProps {
  showModals: number;
  setModalEdit: React.Dispatch<React.SetStateAction<number>>;
  data: Post | null;
  changeData: Function;
}
export default function ModalEditMenu({ showModals, setModalEdit, data, changeData}: ModalEditProps) {
  
  const  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    try {
      await putProducts(formData);
    } catch (error) {
      console.error('Error al enviar los productos:', error);
    }
    if (data) {
      // Crear una nueva instancia del objeto data
      const updatedData: Post = {
        ...data,
        products: data.products.map(product => ({
          ...product,
          name: formData.get(`name${product.id}`) as string,
          description: formData.get(`description${product.id}`) as string,
          price: Number(formData.get(`price${product.id}`)) as number
        }))
      };
      changeData(updatedData, false);
    }
    

    setModalEdit(0);
  }
  
  switch (showModals) {
    case 0:
      return '';
    case 1:
      return (
        <div className='fixed left-0 top-0 w-full h-full flex items-center justify-center'>
          <h1>Modal 1</h1>
        </div>
      )
    case 2:
      return (
        <div className='fixed left-0 top-0 z-10 w-full h-full flex items-center justify-center'>
          <form onSubmit={handleSubmit} className='flex flex-col justify-evenly w-2/4 h-4/6 px-4 mb-[10%]'>
            <div className='flex flex-row items-center w-full h-3/4 bg-[#AAAAAA]/80 justify-around'>
              <div className='w-4/6 bg-[#D9D9D9] h-5/6 ml-[8.2%] p-6'>
                {
                  data?.products.map((product: Product, index: number) => (
                    <div key={index}>
                      <div className='w-3/5'>
                        <InputText type="text" name={`name${product.id}`} placeholder="Producto" value={product.name} />
                      </div>
                      <div className='w-full'>
                        <InputText type="text" name={`description${product.id}`} placeholder="Descripción producto" value={product.description} />
                      </div>
                      </div>
                  ))
                }
              </div>
              <input type="hidden" name="index" value={data?.products.length} />
              <div className='w-1/6 bg-[#D9D9D9] h-5/6 p-6'>
                {data?.products.map((product: Product, index: number) => (
                  <div key={index}>
                  <div className="w-full">
                  <InputText type="number" name={`price${product.id}`} placeholder="Precio" value={product.price} />
                  </div>
                </div>
                ))}
                
              </div>
            </div>
            <div className='w-full flex justify-end gap-4'>
              <button type='submit' className='py-2 bg-white px-6'>Guardar</button>
              <button onClick={() => setModalEdit(0)} className='py-2 bg-white px-6'>Cancelar</button>
            </div>
              
          </form>
        </div>
      )
    case 3:
      return (
        <div className='absolute w-full h-full bg-red-500'>
          <h1>Modal 3</h1>
        </div>
      )
    default:
      return "nada";
  }
}
