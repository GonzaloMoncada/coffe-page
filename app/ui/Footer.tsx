import Image from 'next/image'

export default function Footer() {
    return (
        <footer className='bg-zinc-900 py-4 flex justify-center'>
            <a href="https://instagram.com/coffeonthe_go" target="_blank" rel="noopener noreferrer" className='flex flex-row gap-1'>
                <Image src="/ig.svg" alt="ig" width={24} height={24} />
                <span className='text-white text-lg'>@coffeonthe_go</span>
            </a>
        </footer>
    )
}
