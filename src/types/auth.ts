export type RegistrationFromData = {
    name: string;
    email: string;
    password: string;
    cityId?: string;
    street?: string;
    houseNumber?: string;
    apartmentNumber?: string;
    phoneNumber?: string;
}

export type LoginProps = {
    formData: LoginFormData,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export type LoginFormData = {
    email: string;
    password: string;
}

export type City = {
    id: number;
    name: string;
}