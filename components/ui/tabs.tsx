// components/ui/tabs.tsx
import * as React from 'react';
import { View, Text, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { cn } from '@/lib/utils';

// Context untuk share state
interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
    variant?: 'pill' | 'underline';
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within Tabs');
    }
    return context;
};

// Props Types
export interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    variant?: 'pill' | 'underline';
    className?: string;
}

export interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export interface TabsTriggerProps {
    value: string;
    children: string;
    className?: string;
    disabled?: boolean;
}

export interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

interface TabLayout {
    x: number;
    width: number;
    height: number;
}

// Extended Context for pill animation
interface TabsListContextValue extends TabsContextValue {
    registerTab: (value: string, layout: TabLayout) => void;
    tabLayouts: Map<string, TabLayout>;
}

const TabsListContext = React.createContext<TabsListContextValue | null>(null);

const useTabsListContext = () => {
    const context = React.useContext(TabsListContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within TabsList');
    }
    return context;
};

// Tabs Root Component
export function Tabs({
    value,
    onValueChange,
    children,
    variant = 'underline',
    className,
}: TabsProps) {
    const contextValue: TabsContextValue = {
        value,
        onValueChange,
        variant,
    };

    return (
        <TabsContext.Provider value={contextValue}>
            <View className={cn('flex', className)}>{children}</View>
        </TabsContext.Provider>
    );
}

// TabsList Component
export function TabsList({ children, className }: TabsListProps) {
    const { value, onValueChange, variant } = useTabsContext();
    const [tabLayouts, setTabLayouts] = React.useState<Map<string, TabLayout>>(new Map());

    const indicatorPosition = React.useRef(new Animated.Value(0)).current;
    const indicatorWidth = React.useRef(new Animated.Value(0)).current;
    const indicatorHeight = React.useRef(new Animated.Value(0)).current;

    const registerTab = React.useCallback((tabValue: string, layout: TabLayout) => {
        setTabLayouts((prev) => {
            const newMap = new Map(prev);
            newMap.set(tabValue, layout);
            return newMap;
        });
    }, []);

    // Animate pill indicator when active tab changes
    React.useEffect(() => {
        const activeLayout = tabLayouts.get(value);
        if (activeLayout && variant === 'pill') {
            Animated.parallel([
                Animated.spring(indicatorPosition, {
                    toValue: activeLayout.x,
                    useNativeDriver: false,
                    tension: 100,
                    friction: 10,
                }),
                Animated.spring(indicatorWidth, {
                    toValue: activeLayout.width,
                    useNativeDriver: false,
                    tension: 100,
                    friction: 10,
                }),
                Animated.spring(indicatorHeight, {
                    toValue: activeLayout.height,
                    useNativeDriver: false,
                    tension: 100,
                    friction: 10,
                }),
            ]).start();
        }
    }, [value, tabLayouts, variant]);

    const contextValue: TabsListContextValue = {
        value,
        onValueChange,
        variant,
        registerTab,
        tabLayouts,
    };

    return (
        <TabsListContext.Provider value={contextValue}>
            <View
                className={cn(
                    'relative flex-row items-center',
                    variant === 'pill' && 'bg-slate-200 rounded-lg p-1',
                    variant === 'underline' && 'border-b border-slate-300',
                    className
                )}
            >
                {/* Animated Pill Background */}
                {variant === 'pill' && (
                    <Animated.View
                        className="absolute bg-white rounded-md shadow-sm"
                        style={{
                            left: indicatorPosition,
                            width: indicatorWidth,
                            height: indicatorHeight,
                        }}
                    />
                )}

                {children}
            </View>
        </TabsListContext.Provider>
    );
}

// TabsTrigger Component
export function TabsTrigger({ value: triggerValue, children, className, disabled = false }: TabsTriggerProps) {
    const { value, onValueChange, variant, registerTab } = useTabsListContext();
    const isActive = value === triggerValue;

    // Animation for underline
    const scaleAnim = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
    const opacityAnim = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { x, width, height } = event.nativeEvent.layout;
        registerTab(triggerValue, { x, width, height });
    };

    React.useEffect(() => {
        if (variant === 'underline') {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: isActive ? 1 : 0,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 10,
                }),
                Animated.timing(opacityAnim, {
                    toValue: isActive ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isActive, variant, scaleAnim, opacityAnim]);

    return (
        <Pressable
            onPress={() => onValueChange(triggerValue)}
            onLayout={handleLayout}
            disabled={disabled}
            className={cn(
                'flex-1 items-center justify-center',
                variant === 'pill' && 'px-4 rounded-md z-10',
                disabled && 'opacity-50',
                className
            )}
        >
            <View className="items-center w-full">
                <Text
                    className={cn(
                        'text-base font-medium',
                        isActive ? 'text-slate-900' : 'text-slate-400',
                        variant === 'pill' && 'text-sm py-1'
                    )}
                >
                    {children}
                </Text>

                {/* Animated Underline Indicator */}
                {variant === 'underline' && (
                    <Animated.View
                        className="h-0.5 mt-3 rounded-full bg-slate-900 border-b-2 border-slate-900"
                        style={{
                            width: '100%',
                            transform: [{ scaleX: scaleAnim }],
                            opacity: opacityAnim,
                        }}
                    />
                )}
            </View>
        </Pressable>
    );
}

// TabsContent Component
export function TabsContent({ value: contentValue, children, className }: TabsContentProps) {
    const { value } = useTabsContext();

    if (value !== contentValue) {
        return null;
    }

    return <View className={cn('pt-4', className)}>{children}</View>;
}
