export type BasketItem = {
    id: number;
    productId: number;
    name: string;
    servername: string;
    price: number;
    image: string;
    quantity: number;
}

export type BasketListProps = {
    items: BasketItem[];
    handleChangeQuantity: (productId: number, newQuantity: number) => void;
}