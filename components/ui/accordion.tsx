// components/ui/accordion.tsx
import * as React from 'react';
import { View, Text, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { cn } from '@/lib/utils';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionType = 'single' | 'multiple';

interface AccordionProps {
    type?: AccordionType;
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    children: React.ReactNode;
    className?: string;
    collapsible?: boolean; // Allow closing open item in single mode
}

interface AccordionItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

interface AccordionTriggerProps {
    children: React.ReactNode;
    className?: string;
}

interface AccordionContentProps {
    children: React.ReactNode;
    className?: string;
}

const AccordionContext = React.createContext<{
    type: AccordionType;
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible: boolean;
} | null>(null);

const AccordionItemContext = React.createContext<{
    value: string;
    isOpen: boolean;
    toggle: () => void;
    disabled: boolean;
} | null>(null);

function useAccordion() {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within Accordion');
    }
    return context;
}

function useAccordionItem() {
    const context = React.useContext(AccordionItemContext);
    if (!context) {
        throw new Error('AccordionTrigger and AccordionContent must be used within AccordionItem');
    }
    return context;
}

export function Accordion({
    type = 'single',
    value,
    onValueChange,
    children,
    className,
    collapsible = false,
}: AccordionProps) {
    return (
        <AccordionContext.Provider value={{ type, value, onValueChange, collapsible }}>
            <View className={cn('border border-slate-200 rounded-lg overflow-hidden', className)}>
                {children}
            </View>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({ value, children, className, disabled = false }: AccordionItemProps) {
    const { type, value: accordionValue, onValueChange, collapsible } = useAccordion();

    const isOpen = React.useMemo(() => {
        if (type === 'single') {
            return accordionValue === value;
        } else {
            return Array.isArray(accordionValue) && accordionValue.includes(value);
        }
    }, [type, accordionValue, value]);

    const toggle = () => {
        if (disabled) return;

        LayoutAnimation.configureNext(
            LayoutAnimation.create(250, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        if (type === 'single') {
            // Single mode: only one item can be open
            if (isOpen && collapsible) {
                onValueChange?.('');
            } else {
                onValueChange?.(value);
            }
        } else {
            // Multiple mode: multiple items can be open
            const currentValues = (accordionValue as string[]) || [];
            if (isOpen) {
                onValueChange?.(currentValues.filter((v) => v !== value));
            } else {
                onValueChange?.([...currentValues, value]);
            }
        }
    };

    return (
        <AccordionItemContext.Provider value={{ value, isOpen, toggle, disabled }}>
            <View className={cn('border-b border-slate-200 last:border-b-0', className)}>
                {children}
            </View>
        </AccordionItemContext.Provider>
    );
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
    const { isOpen, toggle, disabled } = useAccordionItem();

    return (
        <Pressable
            onPress={toggle}
            disabled={disabled}
            className={cn(
                'flex-row items-center justify-between px-4 py-4 bg-white',
                disabled && 'opacity-50',
                className
            )}
        >
            <View className="flex-1 pr-2">{children}</View>

            {/* Chevron Icon */}
            <Animated.View
                style={{
                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                }}
            >
                <Text className="text-slate-500 text-sm">▼</Text>
            </Animated.View>
        </Pressable>
    );
}

export function AccordionContent({ children, className }: AccordionContentProps) {
    const { isOpen } = useAccordionItem();

    if (!isOpen) return null;

    return (
        <View className={cn('px-4 pb-4 bg-slate-50', className)}>
            {children}
        </View>
    );
}

// Helper components for common patterns
export function AccordionTriggerText({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Text className={cn('text-base font-medium text-slate-900', className)}>
            {children}
        </Text>
    );
}

export function AccordionContentText({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Text className={cn('text-sm text-slate-600 leading-6', className)}>
            {children}
        </Text>
    );
}
