export type ProductImage = {
    id: number;
    link: string;
}

export type ProductImageLite = { 
    id?: number; 
    link: string 
}

export type ProductType = {
    id: number;
    name: string;
    price: number;
    description: string;
    category?: string;
    productImages?: ProductImage[];
    servername?: string;
    trademarkId: number;
    trademark?: { id: number; name: string };
    countryId: number;
    country?: { id: number; name: string };
    categoryId?: number;
    offert: number;
    offerPrice?: number;
    inStock: boolean;
    createdAt?: string;
}

export type GalleryImagesProductProps = {
    images: string[];
    thumbnail: string | null;
    setThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
    count: number;
}

export type DetailsProductProps = {
    product: ProductType;
    count: number;
    handleChangeQuantity: (newCount: number) => void;
    setCount: React.Dispatch<React.SetStateAction<number>>;
}