import type React from "react";

export type Category = {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    logo: string;
    bgColor: string;
}

export type Subcategory = {
    id: number | string;
    name: string;
    slug?: string;
    logo?: string | null;
    bgColor?: string | null;
}

export type CategoryLite = {
    id: number | string;
    name: string;
    slug?: string;
    logo?: string | null;
    bgColor?: string | null;
}

export type CategoryDetailsResponse = {
    success: boolean;
    category: CategoryLite;
    subcategories: (CategoryLite | { id: 'all'; name: string })[];
}

export type SubcategoriesProps = {
    subcategories: Subcategory[];
    selectedSubSlug: string | null;
    setSelectedSubSlug: React.Dispatch<React.SetStateAction<string | null>>
}

