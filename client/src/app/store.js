import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api.js";
import ui from "./uiSlice.js";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, ui },
  middleware: getDefault => getDefault().concat(api.middleware)   // caching, refetching and polling live in this middleware
});
