// components/ui/accordion.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

type AccordionType = 'single' | 'multiple';

interface AccordionProps {
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
            <View className={cn('border-b border-slate-200 last:border-b-0', className)}>
                {children}
            </View>
        </AccordionItemContext.Provider>
    );
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
    const { isOpen, toggle, disabled } = useAccordionItem();
    const rotation = useSharedValue(0);

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
                'flex-row items-center justify-between px-4 py-4 bg-white',
                disabled && 'opacity-50',
                className
            )}
        >
            <View className="flex-1 pr-2">{children}</View>

            <Animated.View style={animatedStyle}>
                <Text className="text-slate-500 text-sm">▼</Text>
            </Animated.View>
        </Pressable>
    );
}

export function AccordionContent({ children, className }: AccordionContentProps) {
    const { isOpen } = useAccordionItem();
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
        // Fix text rewrap: use absolute positioning during animation
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
                className={cn('px-4 pb-4 bg-slate-50', className)}
            >
                {children}
            </Animated.View>
        </Animated.View>
    );
}

export function AccordionTriggerText({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <Text className={cn('text-base font-medium text-slate-900', className)}>{children}</Text>;
}

export function AccordionContentText({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <Text className={cn('text-sm text-slate-600 leading-6', className)}>{children}</Text>;
}

