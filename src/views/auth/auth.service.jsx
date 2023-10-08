import axios from "axios";
import { isDebugging, urlBase } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";

class AuthService {

    login(email, password) {
        return axios
            .post(urlBase() + "users/gestor/login", {
                email,
                password
            })
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    if (localStorage.getItem("local") === null) localStorage.setItem("local", 1)
                }
                return res.data;
            }, reason => {
                throw new Error('Utilizador Inválido');
            });
    }
    logout() {
        localStorage.removeItem("auth");
        localStorage.removeItem("local");
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('auth'));
    }
}
export default new AuthService();