import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import categoryReducer from "../features/categories/categorySlice"
import basketReducer from "../features/basket/basketSlice";
import orderReducer from "../features/orders/orderSlice";

export const store = configureStore({
    reducer: {
        product: productReducer,
        category: categoryReducer,
        basket: basketReducer,
        order: orderReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch