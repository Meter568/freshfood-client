import { useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type EmailVerificationProps = {
    email: string;
    onBack: () => void;
    onVerified: () => void;
};

const EmailVerification = ({ email, onBack, onVerified }: EmailVerificationProps) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-registration-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Email успішно підтверджено');
                setTimeout(() => {
                    onVerified();
                }, 1500);
            } else {
                toast.error(data.message || 'Невірний код');
            }
        } catch {
            toast.error('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
        }
    };
    const handleResendCode = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/send-registration-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Код відправлено повторно');
            } else {
                toast.error(data.message || 'Помилка відправки коду');
            }
        } catch {
            toast.error('Помилка з\'єднання з сервером');
        } finally {
            setLoading(false);
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
            <form onSubmit={handleVerifyCode}>
                <h2 className="text-gray-900 text-2xl font-medium mb-6">Підтвердження email</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Введіть 5-значний код, який було відправлено на {email}
                </p>
                
                <div className="flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Введіть код"
                        className="border-none outline-none ring-0 text-black text-center text-lg font-mono"
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
                    {loading ? 'Перевірка...' : 'Підтвердити'}
                </button>
                <button 
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="w-full h-11 rounded-full text-primary border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer mt-2 disabled:opacity-50"
                >
                    {loading ? 'Відправка...' : 'Відправити код повторно'}
                </button>
            </form>
        </div>
    );
};

export default EmailVerification;