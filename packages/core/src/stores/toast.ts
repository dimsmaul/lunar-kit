import { create } from 'zustand';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'bottom';
    direction?: 'top' | 'bottom' | 'left' | 'right';
}

interface ToastState {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));
        return id;
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
    dismissToast: (id) => {
        // Just remove for now, could add 'dismissing' state for animations
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    }
}));

export const toast = (props: Omit<Toast, 'id'>) => {
    return useToastStore.getState().addToast(props);
};

toast.success = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'success', ...options });
toast.error = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'error', ...options });
toast.warning = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'warning', ...options });
toast.info = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'info', ...options });
