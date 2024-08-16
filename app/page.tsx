import React from 'react'
import styles from './ui/homeCliente.module.css'
import Image from 'next/image'
export default function page() {
  return (
    <div>
      <div className='relative'>
                <div className='w-full h-[22vh] relative  overflow-hidden'>
                  <Image
                    src='https://cdn.discordapp.com/attachments/1062425698200985670/1271234979099312149/coffeImage.jpg?ex=66b69955&is=66b547d5&hm=65465a16b26ca33b9538e9c9396443ff9fc21260ac6a09b0cd85c2757651f181&'
                    alt='coffeLocal'
                    layout='responsive'
                    width={100}
                    height={300}
                    objectFit='cover'
                    className='absolute inset-0'
                  />
                </div>
              </div>
              <div>
                <div className='w-full h-[25vh] flex justify-center items-center'>
                  <Image
                    src='https://cdn.discordapp.com/attachments/1062425698200985670/1271221264194998393/coffeIcon.jpeg?ex=66b68c8f&is=66b53b0f&hm=40533ac7eeaccbb4df11cf1d831856c3945f9e8a622c36add12861b39e3520eb&'
                    alt='coffeIcon'
                    width={100}
                    height={300}
                    className='border rounded-full border-transparent shadow-xl'
                  />
                </div>

              </div>
    </div>
  )
}
