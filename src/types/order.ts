import type { BasketItem } from "./basket";

export type OrderPayload = {
    cityId: number;
    street: string;
    houseNumber?: string | null;
    apartmentNumber?: string | null;
    paymentMethod: string;
    cardNumber?: string | null;
    phoneNumber?: string;
    guestEmail?: string;
    basketItems?: BasketItem[];
}

export type OrderItemDTO = {
    id: number;
    name: string;
    category: string;
    quantity: number;
    amount: number;
    image?: string;
}

export type OrderDTO = {
    id: number;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    deliveryStatus: string;
    createdAt: string;
    street?: string;
    houseNumber?: string;
    apartmentNumber?: string;
    phoneNumber?: string;
    cardNumber?: string;
    items: OrderItemDTO[];
}