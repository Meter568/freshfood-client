import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../store/store";
import type { OrderDTO, OrderPayload } from "../../types/order";

export const createOrder = createAsyncThunk<OrderDTO, OrderPayload, { state: RootState }>(
    "order/createOrder",
    async ({ cityId, street, houseNumber, apartmentNumber, paymentMethod, cardNumber, phoneNumber, guestEmail, basketItems }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            let config = {};
            if (token) {
                config = { headers: { Authorization: `Bearer ${token}` } };
            }
            let finalBasketItems = basketItems;
            if (!token && !basketItems) {
                const guestBasket = JSON.parse(localStorage.getItem('basket') || '[]');
                finalBasketItems = guestBasket;
            } else if (token && !basketItems) {
                const state = thunkAPI.getState();
                finalBasketItems = state.basket.items;
            }
            
            const payload = {
                cityId,
                street,
                houseNumber: houseNumber ?? null,
                apartmentNumber: apartmentNumber ?? null,
                paymentMethod,
                cardNumber: paymentMethod === "Online" ? cardNumber : null,
                phoneNumber: phoneNumber ?? undefined,
                guestEmail: guestEmail ?? undefined,
                basketItems: finalBasketItems
            };
            
            const { data } = await axios.post(
                "http://localhost:5000/api/orders",
                payload,
                config
            );
            localStorage.removeItem('basket');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create order";
            const responseData = (error as { response?: { data?: { message?: string } } })?.response?.data;
            return thunkAPI.rejectWithValue(responseData || { message: errorMessage });
        }
    }
);

export const fetchOrders = createAsyncThunk<OrderDTO[]>(
    "order/fetchOrders",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(
                "http://localhost:5000/api/orders",
                config
            );
            return data as OrderDTO[];
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
            const responseData = (error as { response?: { data?: { message?: string } } })?.response?.data;
            return thunkAPI.rejectWithValue(responseData || { message: errorMessage });
        }
    }
)

const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: null as OrderDTO | null,
        orders: [] as OrderDTO[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as { message?: string })?.message || "Failed to create order";
            })
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as { message?: string })?.message || "Failed to fetch orders";
            });
    }
})

export default orderSlice.reducer;