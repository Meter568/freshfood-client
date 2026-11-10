import { LockIcon, MailIcon, UserRoundIcon } from "lucide-react"
import type { RegistrationFromData } from "../../types/auth"

type RegistrationProps = {
    formData: RegistrationFromData
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSendVerificationCode: () => void
    loading?: boolean
    isEmailVerified?: boolean
}

const Registration = ({ formData, handleChange, onSendVerificationCode, loading, isEmailVerified }: RegistrationProps) => {
    return (
        <>
            <div className={`flex items-center mt-6 w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors duration-300 text-black`}>
                <UserRoundIcon className={`w-[16px] h-[16px] transition-colors duration-300 text-black`} />
                <input
                    type="text"
                    name="name"
                    placeholder="Ім'я"
                    className="border-none outline-none ring-0 text-black"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
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
            { !isEmailVerified && (
                <button 
                    type="button"
                    onClick={onSendVerificationCode}
                    disabled={loading || !formData.email || !formData.name || !formData.password}
                    className="mt-4 w-full h-11 rounded-full text-primary border border-primary hover:bg-primary hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Відправка коду...' : 'Відправити код підтвердження'}
                </button>
            )}
            <button 
                type="submit"
                disabled={!isEmailVerified}
                className="mt-2 w-full h-11 rounded-full text-white btn btn-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Зареєструватися
            </button>
        </>
    )
}

export default Registration
