import { LockIcon, MailIcon } from "lucide-react"
import type { LoginProps } from "../../types/auth"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const Login = ({ formData, handleChange }: LoginProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminPath = location.pathname === "/admin";
    const handleSuccess = async (creadentialResponse: any) => {
        try {
            const decoded: any = jwtDecode(creadentialResponse.credential)
            const result = await axios.post('http://localhost:5000/api/user/google-login', {
                credential: creadentialResponse.credential
            });
            localStorage.setItem('token', result.data.token);
            console.log("Google user info:", decoded)
            navigate("/");
        } catch(error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error.response?.status === 403) {
                    toast.error('Ваш акаунт заблоковано. Будь ласка, зверніться до підтримки.');
                    return;
                }
                toast.error(error.response?.data.message || 'Помилка при вході через Google');
            } else {
                toast.error('Невідома помилка');
            }
        }
    }

    return (
        <>
            <div className={`flex items-center w-full mt-4 bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors duration-300 text-black`}>
                <MailIcon className={`w-[16px] h-[16px] transition-colors duration-300 text-black`} />
                <input
                    type="email"
                    name="email"
                    placeholder="Електронна пошта"
                    className="border-none outline-none ring-0 text-black"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={`flex items-center mt-4 w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors duration-300 text-black`}>
                <LockIcon className={`w-[16px] h-[16px] transition-colors duration-300 text-black`} />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    className="border-none outline-none ring-0 text-black"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex justify-center items-center mt-4">
                {!isAdminPath && (
                    <GoogleLogin 
                        onSuccess={handleSuccess} 
                        onError={() => {
                            console.log('Login Failed')
                        }}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="pill"
                        logo_alignment="left"
                        width="280px"
                    />
                )}
            </div>
        </>
    )
}

export default Login
