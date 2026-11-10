import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoryDetailsResponse } from "../../types/category";
import axios from "axios";

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
    'categories/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            return response.data.data;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message ?? 'Failed to fetch categories'
                : 'Failed to fetch categories';
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchCategoryBySlug = createAsyncThunk<
    CategoryDetailsResponse,
    string,
    { rejectValue: string }
>(
    'categories/fetchCategoryBySlug',
    async (slug, thunkAPI) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/categories/${encodeURIComponent(slug)}`);
            return response.data as CategoryDetailsResponse;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)?.message ?? 'Failed to load category'
                : 'Failed to load category';
            return thunkAPI.rejectWithValue(message)
        }
    }
)

interface CategoryState {
    items: Category[];
    loading: boolean;
    error: string | null;
    selected: {
        data: CategoryDetailsResponse | null;
        loading: boolean;
        error: string | null;
    }
};

const initialState: CategoryState = {
    items: [],
    loading: false,
    error: null,
    selected: {
        data: null,
        loading: false,
        error: null
    }
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? 'Failed to fetch categories';
        })
        .addCase(fetchCategoryBySlug.pending, (state) => {
            state.selected.loading = true;
            state.selected.error = null;
        })
        .addCase(fetchCategoryBySlug.fulfilled, (state, action: PayloadAction<CategoryDetailsResponse>) => {
            state.selected.loading = false;
            state.selected.data = action.payload;
        })
        .addCase(fetchCategoryBySlug.rejected, (state, action) => {
            state.selected.loading = false;
            state.selected.error = action.payload ?? 'Failed to load category';
        })
    }
})

export default categorySlice.reducer