import './pagination.css'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { MdOutlineArrowForwardIos } from 'react-icons/md'

export const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a className='flex justify-center items-center'><MdOutlineArrowBackIosNew /></a>;
    }
  
    if (type === 'next') {
      return <a className='flex justify-center items-center'><MdOutlineArrowForwardIos /></a>;
    }
  
    return originalElement;
};