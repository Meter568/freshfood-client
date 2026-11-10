import { useState } from 'react';
import { MailIcon, LockIcon, ArrowLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type ForgotPasswordProps = {
    onBack: () => void;
};

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
    const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Код відправлено на вашу пошту');
                setStep('code');
            } else {
                toast.error(data.message || 'Помилка відправки коду');
            }
        } catch {
            toast.error('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
        }
    };
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Код підтверджено');
                setStep('password');
            } else {
                toast.error(data.message || 'Невірний код');
            }
        } catch {
            toast.error('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
        }
    };
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (newPassword !== confirmPassword) {
            toast.error('Паролі не співпадають');
            setLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Пароль повинен містити мінімум 6 символів');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    newPassword, 
                    confirmPassword 
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Пароль успішно змінено');
                setTimeout(() => {
                    onBack();
                }, 2000);
            } else {
                toast.error(data.message || 'Помилка зміни пароля');
            }
        } catch {
            toast.error('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
        }
    };
    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <form onSubmit={handleSendCode}>
                        <h2 className="text-gray-900 text-2xl font-medium mb-6">Відновлення пароля</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Введіть вашу електронну пошту для відправки коду підтвердження
                        </p>
                        
                        <div className="flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                            <MailIcon className="w-[16px] h-[16px] text-black" />
                            <input
                                type="email"
                                placeholder="Електронна пошта"
                                className="border-none outline-none ring-0 text-black flex-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Відправка...' : 'Відправити код'}
                        </button>
                    </form>
                );
            case 'code':
                return (
                    <form onSubmit={handleVerifyCode}>
                        <h2 className="text-gray-900 text-2xl font-medium mb-6">Введіть код</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Введіть 5-значний код, який було відправлено на {email}
                        </p>
                        
                        <div className="flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Введіть код"
                                className="border-none outline-none ring-0 text-black flex-1 text-lg font-mono"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                maxLength={5}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || code.length !== 5}
                            className="w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Перевірка...' : 'Підтвердити код'}
                        </button>

                        <button 
                            type="button"
                            onClick={() => setStep('email')}
                            className="w-full h-11 rounded-full text-primary border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer mt-2"
                        >
                            Назад
                        </button>
                    </form>
                );
            case 'password':
                return (
                    <form onSubmit={handleResetPassword}>
                        <h2 className="text-gray-900 text-2xl font-medium mb-6">Новий пароль</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Введіть новий пароль для вашого облікового запису
                        </p>
                        
                        <div className="flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                            <LockIcon className="w-[16px] h-[16px] text-black" />
                            <input
                                type="password"
                                placeholder="Новий пароль"
                                className="border-none outline-none ring-0 text-black flex-1"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                            <LockIcon className="w-[16px] h-[16px] text-black" />
                            <input
                                type="password"
                                placeholder="Повторіть новий пароль"
                                className="border-none outline-none ring-0 text-black flex-1"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 rounded-full text-white bg-primary hover:bg-primary-dull transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Зміна пароля...' : 'Змінити пароль'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setStep('code')}
                            className="w-full h-11 rounded-full text-primary border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer mt-2"
                        >
                            Назад
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };
    return (
        <div className="sm:w-[350px] w-full relative text-center border border-black rounded-2xl px-8 py-8 bg-white">
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 cursor-pointer hover:text-primary transition-colors duration-300"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            {renderStep()}
        </div>
    );
};

export default ForgotPassword;
