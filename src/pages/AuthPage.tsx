import { useState } from "react"
import Login from "../components/Auth/Login"
import Registration from "../components/Auth/Registration"
import ForgotPassword from "../components/Auth/ForgotPassword"
import EmailVerification from "../components/Auth/EmailVerification"
import type { RegistrationFromData } from "../types/auth"
import { XIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useUserContext } from "../context/useUserContext"

const AuthPage = () => {
    const [state, setState] = useState<"login" | "register" | "forgot-password" | "email-verification">("login")
    const { login, register } = useUserContext()
    const [formData, setFormData] = useState<RegistrationFromData>({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (state === "register") {
            try {
                const guestData = localStorage.getItem('guestData');
                const parsedGuestData = guestData ? JSON.parse(guestData) : {};
                const registrationData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    cityId: parsedGuestData.cityId,
                    street: parsedGuestData.street,
                    houseNumber: parsedGuestData.houseNumber,
                    apartmentNumber: parsedGuestData.apartmentNumber,
                    phoneNumber: parsedGuestData.phoneNumber,
                };
                await register(registrationData);
                localStorage.removeItem('guestData');
                toast.success('Реєстрація успішна');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                toast.error(errorMessage);
            }
        } else if (state === "login") {
            try {
                await login(formData.email, formData.password);
                toast.success('Вхід успішний');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                toast.error(errorMessage);
            }
        }
    }
    const handleSendVerificationCode = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/send-registration-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Код підтвердження відправлено на вашу пошту');
                setState('email-verification');
            } else {
                toast.error(data.message || 'Помилка відправки коду');
            }
        } catch {
            toast.error('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
        }
    };
    const handleEmailVerified = () => {
        setIsEmailVerified(true);
        setState('register');
        toast.success('Email успішно підтверджено');
    };
    const handleForgotPassword = () => {
        setState('forgot-password');
    };
    const handleBackToLogin = () => {
        setState('login');
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const renderContent = () => {
        switch (state) {
            case 'forgot-password':
                return <ForgotPassword onBack={handleBackToLogin} />;
            case 'email-verification':
                return (
                    <EmailVerification 
                        email={formData.email} 
                        onBack={() => setState('register')} 
                        onVerified={handleEmailVerified} 
                    />
                );
            default:
                return (
                    <form onSubmit={handleSubmit} className="sm:w-[350px] w-full relative text-center border border-black rounded-2xl px-8 bg-white">
                        <Link to="/" className="absolute top-2 right-4 cursor-pointer hover:text-primary transition-colors duration-300"><XIcon /></Link>
                        <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Вхід" : "Зареєструватися"}</h1>
                        <p className="text-gray-500 text-sm mt-2">Будь ласка, увійдіть, щоб продовжити</p>
                        
                        {state === "login" ? (
                            <Login formData={formData} handleChange={handleChange} />
                        ) : (
                            <Registration 
                                formData={formData} 
                                handleChange={handleChange} 
                                onSendVerificationCode={handleSendVerificationCode}
                                loading={loading}
                                isEmailVerified={isEmailVerified}
                            />
                        )}
                        
                        {state === "login" && (
                            <div className="mt-4 text-left text-primary">
                                <button 
                                    type="button" 
                                    className="text-sm cursor-pointer hover:underline"
                                    onClick={handleForgotPassword}
                                >
                                    Забули пароль?
                                </button>
                            </div>
                        )}
                        {state === "login" && (
                            <button 
                                type="submit" 
                                className="mt-2 w-full h-11 rounded-full text-white btn btn-primary hover:bg-primary-dull transition-colors cursor-pointer"
                            >
                                Вхід
                            </button>
                        )}
                        
                        <p 
                            onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
                            className="text-gray-500 text-sm mt-3 mb-11"
                        >
                            {state === "login" ? "Немає облікового запису?" : "Вже маєте обліковий запис?"} 
                            <span className="text-primary hover:underline cursor-pointer"> Натисніть тут</span>
                        </p>
                    </form>
                );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100">
            {renderContent()}
        </div>
    )
}

export default AuthPage
