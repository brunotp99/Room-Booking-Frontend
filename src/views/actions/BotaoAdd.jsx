import { MdOutlineAdd } from 'react-icons/md'
import { MdPersonAdd } from 'react-icons/md';
import { MdGroupAdd } from 'react-icons/md';

export const BotaoAdd = () => {
    return(
        <button type="button" className="relative rounded-md px-5 py-2.5 overflow-hidden group bg-blue-500 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <MdOutlineAdd className='relative' />
        </button>
    )
}

export const BotaoAddUser = () => {
    return(
        <button type="button" className="relative rounded-md px-5 py-2.5 overflow-hidden group bg-blue-500 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <MdPersonAdd className='relative' />
        </button>
    )
}

export const BotaoAddBulk = () => {
    return(
        <button type="button" className="relative rounded-md px-5 py-2.5 overflow-hidden group bg-blue-500 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <MdGroupAdd className='relative' />
        </button>
    )
}
