import React, { useState } from 'react'

interface InputTextProps {
    type: string;
    name: string;
    placeholder: string;
    value: string | number;
}
export default function InputText({ type, name, placeholder, value: initialValue }: InputTextProps) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(type === "number")
        {

        const { key } = event;
        const validKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
        const isNumber = /^[0-9]$/.test(key);
      
        // Convertimos el valor a string para verificar si incluye un punto
        const valueAsString = String(value);
      
        if (!isNumber && !validKeys.includes(key) && (key !== '.' || valueAsString.includes('.'))) {
          event.preventDefault();
        }
    }

      };
    return (
        <div className='w-full'>
            <input placeholder={placeholder} onChange={handleChange} type={type} name={name} step="0.01" min="0" onKeyDown={handleKeyDown} value={value} className='appearance-none bg-[#d9d9d9] border-b border-black focus:outline-none w-full'></input>
        </div>
    )
}
