import { useAuth } from '../hooks/useAuth';

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
};

export const locais = (local) => {

    const { user } = useAuth()

    if (user) {
        const decodedJwt = parseJwt(user.accessToken);
        const locais = decodedJwt.locais
        if(locais.includes(parseInt(local))) return parseInt(local)
        else return 0
    }else return 0

}

export const firstLocal = () => {
    const { user } = useAuth()

    if (user) {
        const decodedJwt = parseJwt(user.accessToken);
        const locais = decodedJwt.locais
        if(locais.length != 0) return locais[0]
        else return 0
    }else return 0

}