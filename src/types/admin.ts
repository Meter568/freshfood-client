import type { RefObject } from "react";
import type React from "react";
import type { Category, CategoryLite } from "./category";
import type { ProductType } from "./product";

export type ModalState = {
    name: string;
    slug: string;
    bgColor: string;
    logo: File | null;
    parent_id: number | null;
    logoPreview: string;
};

export type ModalAdminCategoriesProps = {
    modalMode: 'create'|'edit';
    modalState: ModalState | null;
    modalLoading: boolean;
    modalErr: string;
    handleModalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleModalSubmit: (e: React.FormEvent) => void;
    handleModalClose: () => void;
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleModalFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type SelectedCategoryProps = {
    selectedCategoryData: Category | undefined;
    setSelectedCategorySlug: React.Dispatch<React.SetStateAction<string | null>>;
    selectedCategorySubcategories: CategoryLite[];
    openEditModal: (parentId: number, data: CategoryLite) => void;
    handleDeleteSubcategory: (subcategoryId: number | string) => void;
    openCreateModal: (parentId: number) => void;
};

export type DbImage = {
    id: number;
    link: string;
};

export type ProductForm = {
    images: (File|DbImage|null)[],
    previews: (string|null)[],
    name: string,
    description: string,
    categoryId: number|string, // This is subcategory id
    price: number,
    offert: number,
    inStock: boolean,
    servername: string,
    trademarkId: number|string,
    countryId: number|string,
};

export type ProductProps = {
    product: ProductType,
    onEdit: (p: ProductType) => void,
    onDelete: (p: ProductType) => void,
    onToggleStock: (p: ProductType, checked: boolean) => void,
};

export type ModalAdminProductsProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    modalMode: 'create'|'edit';
    handleSave: (e: React.FormEvent) => void;
    handlePickImage: (idx: number) => void;
    fileInputsRef: React.RefObject<HTMLInputElement | null>[];
    handleFileChange: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    form: ProductForm;
    setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
    parentCategoryId: number | '';
    handleParentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    categories: Category[];
    subcategories: CategoryLite[];
    saving: boolean;
    handleDeleteImage: (imageId: number, idx: number) => void;
};

export type AdminOrderItem = {
    id: number;
    name: string;
    category: string;
    quantity: number;
    amount: number;
    image?: string;
};

export type AdminOrder = {
    id: number;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    deliveryStatus?: "Очікує на розгляд" | "У дорозі" | "Доставлено" | string;
    createdAt: string;
    items: AdminOrderItem[];
    street?: string;
    houseNumber?: string | null;
    apartmentNumber?: string | null;
    cardNumber?: string | null;
    userName?: string;
};

export type AdminOrderListPorps = {
    orders: AdminOrder[];
    maskCard: (num?: string | null) => string;
    updateOrder: (id: number, patch: Partial<Pick<AdminOrder, "status" | "deliveryStatus">>) => void;
    deleteOrder: (id: number) => void;
}

export type CityType = {
    id: number;
    name: string;
}

export type AdminUsersType = {
    id: number;
    name: string;
    email: string;
    cityId: number;
    street: string;
    houseNumber: string;
    apartmentNumber: string | null;
    phoneNumber: string;
    role: 'user' | 'admin';
    inBlock: boolean;
}

export type ModalAdminUsersProps = {
    user: AdminUsersType;
    onClose: () => void;
    onSaved: () => void;
}

export type ModalAdminUserOrdersProps = {
    userId: number;
    onClose: () => void;
}