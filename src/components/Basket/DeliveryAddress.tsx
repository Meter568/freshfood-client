import { useState, useEffect } from 'react';
import { useUserContext } from '../../context/useUserContext';

const DeliveryAddress = ({ onChange }: { onChange: (address: string) => void }) => {
    const { user } = useUserContext();
    const [deliveryAddress, setDeliveryAddress] = useState(() => {
        if (!user) return '';
        const baseAddress = [
            user.street ? `вул. ${user.street}` : '',
            user.houseNumber ? `буд. ${user.houseNumber}` : '',
            user.apartmentNumber ? `кв. ${user.apartmentNumber}` : '',
        ]
            .filter(Boolean)
            .join(', ');
        return baseAddress;
    });
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        if (user) {
            const baseAddress = [
                user.street ? `вул. ${user.street}` : '',
                user.houseNumber ? `буд. ${user.houseNumber}` : '',
                user.apartmentNumber ? `кв. ${user.apartmentNumber}` : '',
            ]
                .filter(Boolean)
                .join(', ');

            setDeliveryAddress(baseAddress);
            onChange(baseAddress);
        }
    }, [user, onChange]);
    const handleSave = () => {
        setIsEditing(false);
        onChange(deliveryAddress);
    };
    return (
        <div className="mt-4">
            <p className="text-sm font-medium uppercase">Адреса доставки</p>
            <div className="relative flex flex-col gap-2 mt-2">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="input input-bordered w-full pr-16"
                        />
                        <button
                            className="btn btn-primary btn-sm mt-1 text-white"
                            onClick={handleSave}
                        >
                            Зберегти
                        </button>
                    </>
                ) : deliveryAddress ? (
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700">{deliveryAddress}</p>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setIsEditing(true)}
                        >
                            Змінити
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-primary btn-sm text-white"
                        onClick={() => setIsEditing(true)}
                    >
                        Додати адресу
                    </button>
                )}
            </div>
        </div>
    );
};

export default DeliveryAddress;
