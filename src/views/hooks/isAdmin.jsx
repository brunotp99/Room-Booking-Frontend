import { useAuth } from "../hooks/useAuth";

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
};

const isAdmin = () => {

    const { user } = useAuth()

    if (user) {
        const decodedJwt = parseJwt(user.accessToken);
        if(decodedJwt.roles[0] === 1) return true
        else return false
    }else return false

}

export default isAdmin;