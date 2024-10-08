import { Post, Product } from '@/app/interface/types';
import { deletePost, putPosts } from '@/app/lib/actions';
import React, { useState, useRef, useEffect } from 'react';
import OptionsMenuModal from './OptionsMenuModal';
import ModalEditMenu from './ModalEdit';
import ModalMenu from './Modalmenu';

interface TemplateProps {
  data: Post | null;
  changeData: Function;
  handleButtonPlus: Function;
  index: number | null;
  oldData: Post | null;
  change?: boolean;
  setChange?: React.Dispatch<React.SetStateAction<boolean>>;
}
const rollBack = async (oldData: Post) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(oldData));
  //I want to use the putPosts function
  await putPosts(formData);
  window.location.reload();
}

export function Template1({ data, changeData, handleButtonPlus, index, oldData, change, setChange }: TemplateProps) {
  const [modalMenu, setModalMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [ModalEdit, setModalEdit] = useState(0);
  const [editActive, seteditActive] = useState(false);
  const modalRefEdit = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    if(setChange)
    {
      setChange(true);
      setModalMenu(false);
    }
  };
  const handleMenuModal = () => {
    setModalMenu(prev => !prev);
  };

  const handleDelete = async (data: Post | null) => {
    if (!data) return;
    changeData(data, true); //delete post
    await deletePost(data);
    setModalMenu(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node) && !change) {
      setModalMenu(false);
    }
    else{
      if (modalRefEdit.current && !modalRefEdit.current.contains(event.target as Node)) {
        seteditActive(false);
      }
    }
  };
  


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleTemplate = (increment: number) => {
    handleButtonPlus(index, increment, true);
  }

  return (
    <div className='flex flex-col relative w-full'>
      {/* without editing */}
      {change===false ? (
        <>
          <OptionsMenuModal
            modalRef={modalRef}
            handleMenuModal={handleMenuModal}
            handleDelete={handleDelete}
            data={data}
            modalMenu={modalMenu}
            handleEdit={handleEdit}
          />
          <h1 className='text-3xl mx-auto'>{data?.title}</h1>

          {!data?.products ? '' :
            (
              data.products.map((product: Product, index: number) => (
                <div key={index} className='flex flex-row gap-6 items-center mt-2'>
                  <div className='flex flex-col flex-1'>
                    <div className='text-xl'>{product.name}</div>
                    <div className='text-sm'>{product.description}</div>
                  </div>
                  <div className='text-xl flex justify-center w-1/6'>{product.price}</div>
                </div>
              ))
            )}
        </>
      ) : (
        
        <>
      {/* with editing */}
          <div className='w-full flex flex-row justify-between relative'>
            <ModalEditMenu showModals={ModalEdit} setModalEdit={setModalEdit} changeData={changeData} data={data} />
            <div className='flex flex-row gap-2'>
              <span>Planilla 1</span>
              <div className='flex flex-row z-10 gap-1'>
                <button className='text-2xl' onClick={() => handleTemplate(-1)}>⬅</button>
                <button className='text-2xl' onClick={() => handleTemplate(1)} >➡</button>
              </div>
            </div>
            <div className='absolute w-full h-full flex justify-end items-start'>
              <button onClick={() => seteditActive(true)}>
                {editActive ? '' : '❌'}
              </button>
            </div>
            {editActive && setChange!= undefined && <ModalMenu modalRef={modalRefEdit} handleMenuModal={() => seteditActive(false)} handleDelete={() => rollBack(oldData!)} data={null} handleEdit={() => {seteditActive(false); setChange(false)}} labelfirst='Guardar y publicar' labelsecond='Cancelar y restaurar' bgButtonfirts='bg-red-700' bgButtonsecond='bg-green-500' />}
          </div>
          <button onClick={() => setModalEdit(1)} className='border border-slate-500 relative flex items-center px-2'>
            <h1 className='text-3xl mx-auto'>{data?.title}</h1>
            <span>🗒</span>
          </button>
          <button onClick={() => setModalEdit(2)} className='w-full flex flex-col border-slate-500 border mt-2'>
            {!data?.products ? '' :
              (
                data.products.map((product: Product, index: number) => (
                  <div key={index} className='flex flex-row justify-between px-4 relative'>
                    <div className='flex flex-col relative flex-1'>
                      <div className='text-xl text-start'>{product.name}</div>
                      <div className='text-sm text-start'>{product.description}</div>
                      {index === 0 && <span className='absolute right-0'>🗒</span>}
                    </div>
                    <div className='text-xl flex w-14 justify-end items-center mt-3 '>{product.price}</div>
                    <div className='absolute border-l border-black w-14 right-4 h-full'></div>
                  </div>
                ))
              )}
          </button>
        </>
      )}
    </div>
  );

}
export function Template2({ data, changeData, handleButtonPlus, index, oldData, change, setChange }: TemplateProps) {
  const [modalMenu, setModalMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [ModalEdit, setModalEdit] = useState(0);
  const [editActive, seteditActive] = useState(false);
  const modalRefEdit = useRef<HTMLDivElement>(null);
  
  const handleEdit = () => {
    if(setChange)
    {
      setChange(true);
      setModalMenu(false);
    }
  };
  const handleMenuModal = () => {
    setModalMenu(prev => !prev);
  };

  const handleDelete = async (data: Post | null) => {
    if (!data) return;
    changeData(data, true); //delete post
    await deletePost(data);
    setModalMenu(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleTemplate = (increment: number) => {
    handleButtonPlus(index, increment, true);
  }

  return (
    <div className='flex flex-col relative w-full'>
      {/* without editing */}
      {change===false ? (
        <>
          <OptionsMenuModal
            modalRef={modalRef}
            handleMenuModal={handleMenuModal}
            handleDelete={handleDelete}
            data={data}
            modalMenu={modalMenu}
            handleEdit={handleEdit}
          />
          <h1 className='text-3xl mx-auto'>{data?.title}</h1>

          {!data?.products ? '' :
            (
              data.products.map((product: Product, index: number) => (
                <div key={index} className='flex flex-row gap-6 items-center mt-2'>
                  <div className='flex flex-col flex-1'>
                    <div className='text-xl'>{product.name}</div>
                    <div className='text-sm'>{product.description}</div>
                  </div>
                  <div className='text-xl flex justify-center w-1/6'>{product.price}</div>
                </div>
              ))
            )}
        </>
      ) : (
        
        <>
      {/* with editing */}
          <div className='w-full flex flex-row justify-between relative'>
            <ModalEditMenu showModals={ModalEdit} setModalEdit={setModalEdit} changeData={changeData} data={data} />
            <div className='flex flex-row gap-2'>
              <span>Planilla 2</span>
              <div className='flex flex-row z-10 gap-1'>
                <button className='text-2xl' onClick={() => handleTemplate(-1)}>⬅</button>
                <button className='text-2xl' onClick={() => handleTemplate(1)} >➡</button>
              </div>
            </div>
            <div className='absolute w-full h-full flex justify-end items-start'>
              <button onClick={() => seteditActive(true)}>
                {editActive ? '' : '❌'}
              </button>
            </div>
            {editActive && setChange!= undefined && <ModalMenu modalRef={modalRefEdit} handleMenuModal={() => seteditActive(false)} handleDelete={() => rollBack(oldData!)} data={null} handleEdit={() => {seteditActive(false); setChange(false)}} labelfirst='Guardar y publicar' labelsecond='Cancelar y restaurar' bgButtonfirts='bg-red-700' bgButtonsecond='bg-green-500' />}
          </div>
          <button onClick={() => setModalEdit(1)} className='border border-slate-500 relative flex items-center px-2'>
            <h1 className='text-3xl mx-auto'>{data?.title}</h1>
            <span>🗒</span>
          </button>
          <button onClick={() => setModalEdit(2)} className='w-full flex flex-col border-slate-500 border mt-2'>
            {!data?.products ? '' :
              (
                data.products.map((product: Product, index: number) => (
                  <div key={index} className='flex flex-row justify-between px-4 relative'>
                    <div className='flex flex-col relative flex-1'>
                      <div className='text-xl text-start'>{product.name}</div>
                      <div className='text-sm text-start'>{product.description}</div>
                      {index === 0 && <span className='absolute right-0'>🗒</span>}
                    </div>
                    <div className='text-xl flex w-14 justify-end items-center mt-3 '>{product.price}</div>
                    <div className='absolute border-l border-black w-14 right-4 h-full'></div>
                  </div>
                ))
              )}
          </button>
        </>
      )}
    </div>
  );

}
export function Template3({ data, changeData, handleButtonPlus, index, oldData, change, setChange }: TemplateProps) {
  const [modalMenu, setModalMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [ModalEdit, setModalEdit] = useState(0);
  const [editActive, seteditActive] = useState(false);
  const modalRefEdit = useRef<HTMLDivElement>(null);
  
  const handleEdit = () => {
    if(setChange)
    {
      setChange(true);
      setModalMenu(false);
    }
  };
  const handleMenuModal = () => {
    setModalMenu(prev => !prev);
  };

  const handleDelete = async (data: Post | null) => {
    if (!data) return;
    changeData(data, true); //delete post
    await deletePost(data);
    setModalMenu(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleTemplate = (increment: number) => {
    handleButtonPlus(index, increment, true);
  }

  return (
    <div className='flex flex-col relative w-full'>
      {/* without editing */}
      {change===false ? (
        <>
          <OptionsMenuModal
            modalRef={modalRef}
            handleMenuModal={handleMenuModal}
            handleDelete={handleDelete}
            data={data}
            modalMenu={modalMenu}
            handleEdit={handleEdit}
          />
          <h1 className='text-3xl mx-auto'>{data?.title}</h1>

          {!data?.products ? '' :
            (
              data.products.map((product: Product, index: number) => (
                <div key={index} className='flex flex-row gap-6 items-center mt-2'>
                  <div className='flex flex-col flex-1'>
                    <div className='text-xl'>{product.name}</div>
                    <div className='text-sm'>{product.description}</div>
                  </div>
                  <div className='text-xl flex justify-center w-1/6'>{product.price}</div>
                </div>
              ))
            )}
        </>
      ) : (
        
        <>
      {/* with editing */}
          <div className='w-full flex flex-row justify-between relative'>
            <ModalEditMenu showModals={ModalEdit} setModalEdit={setModalEdit} changeData={changeData} data={data} />
            <div className='flex flex-row gap-2'>
              <span>Planilla 3</span>
              <div className='flex flex-row z-10 gap-1'>
                <button className='text-2xl' onClick={() => handleTemplate(-1)}>⬅</button>
                <button className='text-2xl' onClick={() => handleTemplate(1)} >➡</button>
              </div>
            </div>
            <div className='absolute w-full h-full flex justify-end items-start'>
              <button onClick={() => seteditActive(true)}>
                {editActive ? '' : '❌'}
              </button>
            </div>
            {editActive && setChange!= undefined && <ModalMenu modalRef={modalRefEdit} handleMenuModal={() => seteditActive(false)} handleDelete={() => rollBack(oldData!)} data={null} handleEdit={() => {seteditActive(false); setChange(false)}} labelfirst='Guardar y publicar' labelsecond='Cancelar y restaurar' bgButtonfirts='bg-red-700' bgButtonsecond='bg-green-500' />}
          </div>
          <button onClick={() => setModalEdit(1)} className='border border-slate-500 relative flex items-center px-2'>
            <h1 className='text-3xl mx-auto'>{data?.title}</h1>
            <span>🗒</span>
          </button>
          <button onClick={() => setModalEdit(2)} className='w-full flex flex-col border-slate-500 border mt-2'>
            {!data?.products ? '' :
              (
                data.products.map((product: Product, index: number) => (
                  <div key={index} className='flex flex-row justify-between px-4 relative'>
                    <div className='flex flex-col relative flex-1'>
                      <div className='text-xl text-start'>{product.name}</div>
                      <div className='text-sm text-start'>{product.description}</div>
                      {index === 0 && <span className='absolute right-0'>🗒</span>}
                    </div>
                    <div className='text-xl flex w-14 justify-end items-center mt-3 '>{product.price}</div>
                    <div className='absolute border-l border-black w-14 right-4 h-full'></div>
                  </div>
                ))
              )}
          </button>
        </>
      )}
    </div>
  );

}
export function Template4({ data, changeData, handleButtonPlus, index, oldData, change, setChange }: TemplateProps) {
  const [modalMenu, setModalMenu] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [ModalEdit, setModalEdit] = useState(0);
  const [editActive, seteditActive] = useState(false);
  const modalRefEdit = useRef<HTMLDivElement>(null);
  
  const handleEdit = () => {
    if(setChange)
    {
      setChange(true);
      setModalMenu(false);
    }
  };
  const handleMenuModal = () => {
    setModalMenu(prev => !prev);
  };

  const handleDelete = async (data: Post | null) => {
    if (!data) return;
    changeData(data, true); //delete post
    await deletePost(data);
    setModalMenu(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleTemplate = (increment: number) => {
    handleButtonPlus(index, increment, true);
  }

  return (
    <div className='flex flex-col relative w-full'>
      {/* without editing */}
      {change===false ? (
        <>
          <OptionsMenuModal
            modalRef={modalRef}
            handleMenuModal={handleMenuModal}
            handleDelete={handleDelete}
            data={data}
            modalMenu={modalMenu}
            handleEdit={handleEdit}
          />
          <h1 className='text-3xl mx-auto'>{data?.title}</h1>

          {!data?.products ? '' :
            (
              data.products.map((product: Product, index: number) => (
                <div key={index} className='flex flex-row gap-6 items-center mt-2'>
                  <div className='flex flex-col flex-1'>
                    <div className='text-xl'>{product.name}</div>
                    <div className='text-sm'>{product.description}</div>
                  </div>
                  <div className='text-xl flex justify-center w-1/6'>{product.price}</div>
                </div>
              ))
            )}
        </>
      ) : (
        
        <>
      {/* with editing */}
          <div className='w-full flex flex-row justify-between relative'>
            <ModalEditMenu showModals={ModalEdit} setModalEdit={setModalEdit} changeData={changeData} data={data} />
            <div className='flex flex-row gap-2'>
              <span>Planilla 4</span>
              <div className='flex flex-row z-10 gap-1'>
                <button className='text-2xl' onClick={() => handleTemplate(-1)}>⬅</button>
                <button className='text-2xl' onClick={() => handleTemplate(1)} >➡</button>
              </div>
            </div>
            <div className='absolute w-full h-full flex justify-end items-start'>
              <button onClick={() => seteditActive(true)}>
                {editActive ? '' : '❌'}
              </button>
            </div>
            {editActive && setChange!= undefined && <ModalMenu modalRef={modalRefEdit} handleMenuModal={() => seteditActive(false)} handleDelete={() => rollBack(oldData!)} data={null} handleEdit={() => {seteditActive(false); setChange(false)}} labelfirst='Guardar y publicar' labelsecond='Cancelar y restaurar' bgButtonfirts='bg-red-700' bgButtonsecond='bg-green-500' />}
          </div>
          <button onClick={() => setModalEdit(1)} className='border border-slate-500 relative flex items-center px-2'>
            <h1 className='text-3xl mx-auto'>{data?.title}</h1>
            <span>🗒</span>
          </button>
          <button onClick={() => setModalEdit(2)} className='w-full flex flex-col border-slate-500 border mt-2'>
            {!data?.products ? '' :
              (
                data.products.map((product: Product, index: number) => (
                  <div key={index} className='flex flex-row justify-between px-4 relative'>
                    <div className='flex flex-col relative flex-1'>
                      <div className='text-xl text-start'>{product.name}</div>
                      <div className='text-sm text-start'>{product.description}</div>
                      {index === 0 && <span className='absolute right-0'>🗒</span>}
                    </div>
                    <div className='text-xl flex w-14 justify-end items-center mt-3 '>{product.price}</div>
                    <div className='absolute border-l border-black w-14 right-4 h-full'></div>
                  </div>
                ))
              )}
          </button>
        </>
      )}
    </div>
  );

}
