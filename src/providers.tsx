'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { fetchWorkspaces } from '@/features/workspaceSlice';

function DataLoader({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(fetchWorkspaces());
    }, []);

    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <DataLoader>
                {children}
            </DataLoader>
            <Toaster />
        </Provider>
    );
}
