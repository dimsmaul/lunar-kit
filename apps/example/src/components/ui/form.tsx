// components/ui/form.tsx
import * as React from 'react';
import { View, Text } from 'react-native';
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

export const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
);

export const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

export const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
);

export const FormItem = React.forwardRef<
    View,
    React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <View ref={ref} className={cn('mb-4', className)} {...props} />
        </FormItemContext.Provider>
    );
});
FormItem.displayName = 'FormItem';

export const FormLabel = React.forwardRef<
    Text,
    React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Text
            ref={ref}
            className={cn(
                'text-sm font-medium text-slate-900 mb-2',
                error && 'text-red-600',
                className
            )}
            nativeID={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

export const FormDescription = React.forwardRef<
    Text,
    React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <Text
            ref={ref}
            nativeID={formDescriptionId}
            className={cn('text-sm text-slate-500 mt-2', className)}
            {...props}
        />
    );
});
FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<
    Text,
    React.ComponentPropsWithoutRef<typeof Text>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();

    // Debug: uncomment ini untuk cek error object
    // console.log('FormMessage error:', error);

    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <Text
            ref={ref}
            nativeID={formMessageId}
            className={cn('text-sm text-red-600 mt-1', className)}
            {...props}
        >
            {body}
        </Text>
    );
});
FormMessage.displayName = 'FormMessage';
