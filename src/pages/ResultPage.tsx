import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { success, message } = location.state || { success: false, message: "" };
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                {success ? (
                    <>
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Замовлення успішно оформлено!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Ваше замовлення успішно прийняте. Ми надішлемо чек замовлення на вашу електронну пошту.
                        </p>
                    </>
                ) : (
                    <>
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Помилка оплати
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {message || "Не вдалося оформити замовлення. Спробуйте ще раз."}
                        </p>
                    </>
                )}
                <button onClick={() => {navigate("/")}} className="w-full btn btn-primary text-white">
                    Повернутися на головну
                </button>
            </div>
        </div>
    );
}

export default ResultPage
