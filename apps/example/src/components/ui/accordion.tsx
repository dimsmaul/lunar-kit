// components/ui/accordion.tsx
import * as React from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react-native';
import { Text } from './text';
import { useThemeColors } from '@/hooks/useThemeColors';

type AccordionType = 'single' | 'multiple';

// Accordion Variants
const accordionVariants = cva(
    'rounded-lg overflow-hidden',
    {
        variants: {
            variant: {
                default: 'border border-border',
                bordered: 'border-2 border-border',
                separated: 'gap-2',
                filled: 'bg-muted',
                ghost: '',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

// Accordion Item Variants
const accordionItemVariants = cva(
    '',
    {
        variants: {
            variant: {
                default: 'border-b border-border last:border-b-0',
                bordered: 'border-b-2 border-border last:border-b-0',
                separated: 'border border-border rounded-lg mb-2 last:mb-0',
                filled: 'border-b border-border last:border-b-0',
                ghost: 'mb-1',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

// Accordion Trigger Variants
const accordionTriggerVariants = cva(
    'flex-row items-center justify-between px-4 py-4',
    {
        variants: {
            variant: {
                default: 'bg-card',
                bordered: 'bg-card',
                separated: 'bg-card',
                filled: 'bg-muted',
                ghost: 'bg-transparent',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

// Accordion Content Variants
const accordionContentVariants = cva(
    'px-4 pb-4',
    {
        variants: {
            variant: {
                default: 'bg-card',
                bordered: 'bg-card',
                separated: 'bg-card',
                filled: 'bg-muted',
                ghost: 'bg-transparent',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface AccordionProps extends VariantProps<typeof accordionVariants> {
    type?: AccordionType;
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    children: React.ReactNode;
    className?: string;
    collapsible?: boolean;
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
    variant: 'default' | 'bordered' | 'separated' | 'filled' | 'ghost';
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
    variant = 'default',
}: AccordionProps) {
    return (
        <AccordionContext.Provider value={{
            type,
            value,
            onValueChange,
            collapsible,
            variant: variant ?? 'default'
        }}>
            <View className={cn(accordionVariants({ variant }), className)}>
                {children}
            </View>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({ value, children, className, disabled = false }: AccordionItemProps) {
    const { type, value: accordionValue, onValueChange, collapsible, variant } = useAccordion();

    const isOpen = React.useMemo(() => {
        if (type === 'single') {
            return accordionValue === value;
        } else {
            return Array.isArray(accordionValue) && accordionValue.includes(value);
        }
    }, [type, accordionValue, value]);

    const toggle = () => {
        if (disabled) return;

        if (type === 'single') {
            if (isOpen && collapsible) {
                onValueChange?.('');
            } else {
                onValueChange?.(value);
            }
        } else {
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
            <View className={cn(accordionItemVariants({ variant }), className)}>
                {children}
            </View>
        </AccordionItemContext.Provider>
    );
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
    const { isOpen, toggle, disabled } = useAccordionItem();
    const { variant } = useAccordion();
    const rotation = useSharedValue(0);
    const { colors } = useThemeColors();

    React.useEffect(() => {
        rotation.value = withTiming(isOpen ? 180 : 0, {
            duration: 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [isOpen]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <Pressable
            onPress={toggle}
            disabled={disabled}
            className={cn(
                accordionTriggerVariants({ variant }),
                disabled && 'opacity-50',
                className
            )}
        >
            <View className="flex-1 pr-2">{children}</View>

            <Animated.View style={animatedStyle}>
                <ChevronDown size={20} className="text-muted-foreground" color={colors.mutedForeground} />
            </Animated.View>
        </Pressable>
    );
}

export function AccordionContent({ children, className }: AccordionContentProps) {
    const { isOpen } = useAccordionItem();
    const { variant } = useAccordion();
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const [measured, setMeasured] = React.useState(false);
    const [contentHeight, setContentHeight] = React.useState(0);

    React.useEffect(() => {
        if (measured) {
            height.value = withTiming(isOpen ? contentHeight : 0, {
                duration: 250,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
            opacity.value = withTiming(isOpen ? 1 : 0, {
                duration: 200,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
        }
    }, [isOpen, measured, contentHeight]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: measured ? height.value : undefined,
        opacity: measured ? opacity.value : 1,
        overflow: 'hidden',
    }));

    const contentWrapperStyle = useAnimatedStyle(() => ({
        position: measured && height.value > 0 && height.value < contentHeight ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        right: 0,
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Animated.View
                style={contentWrapperStyle}
                onLayout={(event) => {
                    const h = event.nativeEvent.layout.height;
                    if (h > 0 && !measured) {
                        setContentHeight(h);
                        setMeasured(true);
                        height.value = isOpen ? h : 0;
                        opacity.value = isOpen ? 1 : 0;
                    }
                }}
            >
                <View className={cn(accordionContentVariants({ variant }), className)}>
                    {children}
                </View>
            </Animated.View>
        </Animated.View>
    );
}

// Preset Text Components with theme colors
export function AccordionTriggerText({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Text variant="title" size="sm" className={className}>
            {children}
        </Text>
    );
}

export function AccordionContentText({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Text variant="body" size="sm" className={cn('leading-6', className)}>
            {children}
        </Text>
    );
}

