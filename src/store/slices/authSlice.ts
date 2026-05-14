// src/store/store.ts (Update your store configuration)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    client: clientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ✅ Redux actions for multi-role management
addRole(AccountRole)        // Add new role to user
removeRole(AccountRole)     // Remove role from user
setPrimaryRole(AccountRole) // Set primary role
addUpgrade(ProfileUpgrade)  // Add upgrade to profile

// ✅ Single user with multiple roles
user.roles = ['normal_user', 'blood_donor']  // Multiple roles
user.upgrades = ['client_patient']            // Profile upgrades