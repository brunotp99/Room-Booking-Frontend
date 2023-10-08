import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';
import axios from 'axios'
import Loading from '../actions/Loading'
import { isDebugging, urlBase } from "../../utils/Utils";

const PersistLogin = () => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const [persist, setPersist] = useState(false)

    const isValid = async (token) => {
        try{
            const response = await axios.post(urlBase() + 'users/gestor/verify', {token: token});
            setPersist(response.data.success)
        }catch(error){
            if(isDebugging()) console.log(error)
        }
    }

    useEffect(() => {
        let isMounted = true;

        const verifyToken = async () => {
            try {
                await isValid(user.accessToken);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        user?.accessToken ? verifyToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        if(isDebugging()) console.log('Token: ${JSON.stringify(user?.accessToken)}')
    }, [isLoading])

    return (
        <>
            {  user ?
                    isLoading ? <Loading />
                    : persist ? <Outlet /> : navigate('/login', { replace: true })
               : navigate('/login', { replace: true })
            }
        </>
    )
}

export default PersistLogin