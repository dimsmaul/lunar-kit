import { useToastStore, type Toast } from '../stores/toast';

export function useToast() {
    const toasts = useToastStore((state) => state.toasts);
    const addToast = useToastStore((state) => state.addToast);
    const dismissToast = useToastStore((state) => state.dismissToast);

    return {
        toasts,
        toast: addToast,
        dismiss: dismissToast,
    };
}
