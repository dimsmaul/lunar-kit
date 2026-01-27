// components/ui/form.tsx
import * as React from 'react';
import { View } from 'react-native';
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Text } from './text';

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

export const FormLabel = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof Text>) => {
    const { error, formItemId } = useFormField();

    return (
        <Text
            size="sm"
            variant="label"
            className={cn(
                'mb-2',
                error && 'text-destructive',
                className
            )}
            nativeID={formItemId}
            {...props}
        />
    );
};
FormLabel.displayName = 'FormLabel';

export const FormDescription = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof Text>) => {
    const { formDescriptionId } = useFormField();

    return (
        <Text
            size="sm"
            nativeID={formDescriptionId}
            className={cn('text-muted-foreground mt-2', className)}
            {...props}
        />
    );
};
FormDescription.displayName = 'FormDescription';

export const FormMessage = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof Text>) => {
    const { error, formMessageId } = useFormField();

    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <Text
            size="sm"
            nativeID={formMessageId}
            className={cn('text-destructive mt-1', className)}
            {...props}
        >
            {body}
        </Text>
    );
};
FormMessage.displayName = 'FormMessage';
