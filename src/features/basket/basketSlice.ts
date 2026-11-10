import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BasketItem } from "../../types/basket";
import axios from "axios";
import type { RootState } from "../../store/store";
import type { ProductType } from "../../types/product";

interface BasketState {
    items: BasketItem[];
    loading: boolean;
    error: string | null;
}

function getInitialBasketItems(): BasketItem[] {
    if (typeof window !== "undefined") {
        const local = localStorage.getItem('basket');
        if (local) {
            try {
                const parsed = JSON.parse(local);
                if(Array.isArray(parsed)) return parsed;
            } catch {/* do nothing */}
        }
    }
    return [];
}

const initialState: BasketState = {
    items: getInitialBasketItems(),
    loading: false,
    error: null,
};

export const addToBasket = createAsyncThunk<BasketItem, { productId: number; quantity: number }, { state: RootState }>(
    "basket/addToBasket",
    async ({ productId, quantity = 1 }, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) {
            const state = thunkAPI.getState();
            const product: ProductType | undefined = state.product.items?.find((p: ProductType) => p.id === productId);
            let image = '';
            if (product?.productImages?.[0]?.link) {
                const link = product.productImages[0].link;
                image = link.startsWith('http') ? link : `http://localhost:5000/static/${link}`;
            }
            return {
                id: Math.random(),
                productId,
                name: product?.name || '',
                servername: product?.servername || '',
                price: product?.offert && product?.offert > 0 ? product?.offert : product?.price || 0,
                image,
                quantity,
            };
        }
        try {
            const response = await axios.post(
                "http://localhost:5000/api/basket", 
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add to basket");
            }
            return thunkAPI.rejectWithValue("Failed to add to basket");
        }
    }
)

export const fetchBasket = createAsyncThunk<BasketItem[]>(
    "basket/fetchBasket",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:5000/api/basket", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch basket");
            }
            return thunkAPI.rejectWithValue("Failed to fetch basket");
        }
    }
)

export const updateQuantity = createAsyncThunk<{ productId: number; quantity: number }, { productId: number; quantity: number }, { state: RootState }>(
    "basket/updateQuantity",
    async ({ productId, quantity }, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return { productId, quantity };
        }
        try {
            await axios.put(
                `http://localhost:5000/api/basket/${productId}`, 
                { quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return { productId, quantity };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update quantity");
            }
            return thunkAPI.rejectWithValue("Failed to update quantity");
        }
    }
);

export const removeFromBasket = createAsyncThunk<number, number, { state: RootState }>(
    "basket/removeFromBasket",
    async (productId, thunkAPI) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return productId;
        }
        try {
            await axios.delete(`http://localhost:5000/api/basket/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return productId;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to remove from basket");
            }
            return thunkAPI.rejectWithValue("Failed to remove from basket");
        }
    }
);

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBasket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBasket.fulfilled, (state, action: PayloadAction<BasketItem[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBasket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addToBasket.fulfilled, (state, action: PayloadAction<BasketItem>) => {
                const existing = state.items.find(i => i.productId === action.payload.productId);
                if (existing) {
                    existing.quantity += action.payload.quantity;
                    existing.price = action.payload.price;
                } else {
                    state.items.push(action.payload);
                }
                localStorage.setItem('basket', JSON.stringify(state.items));
            })
            .addCase(updateQuantity.fulfilled, (state, action: PayloadAction<{ productId: number; quantity: number; price?: number }>) => {
                const item = state.items.find(i => i.productId === action.payload.productId);
                if (item) {
                    item.quantity = action.payload.quantity;
                    if(action.payload.price !== undefined) {
                        item.price = action.payload.price;
                    }
                }
                localStorage.setItem('basket', JSON.stringify(state.items));
            })
            .addCase(removeFromBasket.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(i => i.productId !== action.payload);
                localStorage.setItem('basket', JSON.stringify(state.items));
            })
    }
})

export default basketSlice.reducer;