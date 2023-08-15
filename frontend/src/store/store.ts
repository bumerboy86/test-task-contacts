import { combineReducers, configureStore, Middleware, isRejectedWithValue} from "@reduxjs/toolkit";
import { api } from "./api";
import { toast } from "react-toastify";

type ICustomError = {
    error: string,
    status: number | string,
    data?: {
        message: string
    }
}
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const customError = action.payload as ICustomError;
        if (customError.status === "FETCH_ERROR") {
            return toast.error("Ошибка подключения к серверу");
        } else if (customError.status === 400 && customError.data) {
            return toast.error(customError.data.message);
        } else if (customError.status === 429 && customError.data) {
            return toast.error(customError.data.message);
        } else {
            return toast.error(customError.error);
        }
    }
    return next(action);
}

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(rtkQueryErrorLogger)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>

export default store;