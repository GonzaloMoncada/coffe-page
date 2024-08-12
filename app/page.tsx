import React from 'react'
import styles from './ui/homeCliente.module.css'
import Image from 'next/image'
export default function page() {
  return (
    <div className={`grid min-h-full grid-rows-[1fr_auto] ${styles.container}`}>
      <main className='w-screen flex justify-center'>
        <div className='w-screen sm:w-1/3 bg-zinc-200'>
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
      </main>
      <footer className='bg-zinc-900 py-4 flex justify-center'>
        <a href="https://instagram.com/coffeonthe_go" target="_blank" rel="noopener noreferrer" className='flex flex-row gap-1'>
          <Image src="/ig.svg" alt="ig" width={24} height={24} />
          <span className='text-white text-lg'>@coffeonthe_go</span>
        </a>
      </footer>
    </div>
  )
}
