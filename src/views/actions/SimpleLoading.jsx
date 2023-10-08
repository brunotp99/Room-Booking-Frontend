import logo from '../../images/loadingv6.gif'

export default function Loading() {

    return(
        <div className='flex justify-center items-center'>
           <img src={logo} className="w-14 m-3 p-2" />
        </div>
    )
}