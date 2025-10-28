import { configureStore } from '@reduxjs/toolkit';
import treeReducer from '../features/NodeTree/treeSlice';
import { mqttMiddleware, selNodeMiddleware, fetchReadingsMiddleware } from './middleware';
import { enableMapSet } from 'immer';
enableMapSet();

export const store = configureStore({
  reducer: {
    tree: treeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mqttMiddleware).concat(selNodeMiddleware).concat(fetchReadingsMiddleware),
})

export type RootState = ReturnType<typeof store.getState>