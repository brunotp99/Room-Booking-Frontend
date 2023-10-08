import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import authHeader from '../auth/auth-header'
import { useEffect, useState } from "react";
import axios from 'axios'
import { isDebugging, urlBase } from "../../utils/Utils";
import Loading from '../actions/Loading'
import checkExpiration from "./checkExpiration";

const RequireAuth = ({ allowedRoles }) => {

    const navigate = useNavigate();

    const { user } = useAuth();

    checkExpiration()

    const [isLoading, setIsLoading] = useState(true);

    const [persist, setPersist] = useState(false)
    const [role, setRole] = useState(0)

    const getRole = async () => {
        try{
            const config = {
                headers: authHeader()
            };
            const response = await axios.get(urlBase() + 'users/role', config);
            setRole(response.data.role)
        }catch(error){
            if(isDebugging()) console.log(error)
        }
    }

    useEffect(() => {
        let isMounted = true;

        const findRole = async () => {
            try {
                await getRole();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        user?.accessToken ? findRole() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        if(isDebugging()) console.log('Token: ${JSON.stringify(user?.accessToken)}')
        if(isDebugging()) console.log("Role: " + role)
    }, [isLoading])

    const isThere = () => {
        return allowedRoles.includes(role[0])
    }

    return (
        isLoading ? <Loading /> :
        isThere()
            ? <Outlet />
            : user?.accessToken
                ? <Navigate to="/unauthorized" replace />
                : <Navigate to="/login" replace />
    );
}

export default RequireAuth;