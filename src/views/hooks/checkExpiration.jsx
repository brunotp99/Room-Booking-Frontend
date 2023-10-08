import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
};

const checkExpiration = () => {

    const { user, logout } = useAuth()

    if (user) {
        const decodedJwt = parseJwt(user.accessToken);
        if (decodedJwt.exp * 1000 < Date.now()) {
            logout()
        }
    }

}

export default checkExpiration