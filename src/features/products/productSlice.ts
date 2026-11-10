import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { ProductType } from "../../types/product";

interface ProductsState {
    items: ProductType[];
    discountedItems: ProductType[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    productDetails: ProductType | null;
}

const initialState: ProductsState = {
    items: [],
    discountedItems: [],
    loading: false,
    error: null,
    searchQuery: "",
    productDetails: null,
}

export const fetchProductsByParent = createAsyncThunk<ProductType[], string, { rejectValue: string }>(
    'products/fetchByParent',
    async (slug, thunkAPI) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/category/${encodeURIComponent(slug)}/all`);
            return res.data.data as ProductType[];
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message ?? 'Failed to load products'
                : 'Failed to load products';
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchProductsByCategory = createAsyncThunk<ProductType[], string, { rejectValue: string }>(
    'products/fetchByCategory',
    async (slug, thunkAPI) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/category/${encodeURIComponent(slug)}`);
            return res.data.data as ProductType[];
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message ?? 'Failed to load products'
                : 'Failed to load products';
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchAllProducts = createAsyncThunk<ProductType[], void, { rejectValue: string }>(
    'products/fetchAll',
    async (_, thunkAPI) => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            return res.data.data as ProductType[];
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message ?? 'Failed to load products'
                : 'Failed to load products';
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchProductByServername = createAsyncThunk<ProductType, string, { rejectValue: string }>(
    'products/fetchByServername',
    async (servername, thunkAPI) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/${encodeURIComponent(servername)}`);
            return res.data.data as ProductType;
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message ?? 'Failed to load product'
                : 'Failed to load product';
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
                state.loading = false;
                state.items = action.payload;
                state.discountedItems = state.items.filter((p) => p.inStock && p.offert && p.offert > 0);
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to load products';
            })
            .addCase(fetchProductsByParent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByParent.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProductsByParent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to load products';
            })
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to load products';
            })
            .addCase(fetchProductByServername.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.productDetails = null;
            })
            .addCase(fetchProductByServername.fulfilled, (state, action: PayloadAction<ProductType>) => {
                state.loading = false;
                state.productDetails = action.payload;
            })
            .addCase(fetchProductByServername.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to load product';
                state.productDetails = null;
            })
    }
})

export const { setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer