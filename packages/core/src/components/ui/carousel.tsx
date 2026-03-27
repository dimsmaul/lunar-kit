// components/ui/carousel.tsx
import * as React from 'react';
import { View, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    interpolate,
    Extrapolate,
    SharedValue
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface CarouselProps<T> {
    data: T[];
    renderItem: ({ item, index }: { item: T, index: number }) => React.ReactElement;
    itemWidth?: number;
    gap?: number;
    showDots?: boolean;
    className?: string;
    containerClassName?: string;
}

export function Carousel<T>({
    data,
    renderItem,
    itemWidth = SCREEN_WIDTH - 64,
    gap = 12,
    showDots = true,
    className,
    containerClassName,
}: CarouselProps<T>) {
    const scrollX = useSharedValue(0);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
        const index = Math.round(event.nativeEvent.contentOffset.x / (itemWidth + gap));
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <View className={cn("gap-4", containerClassName)}>
            <FlatList
                data={data}
                renderItem={(info) => (
                    <View style={{ width: itemWidth }}>
                        {renderItem(info)}
                    </View>
                )}

                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={itemWidth + gap}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={{ 
                    paddingHorizontal: (SCREEN_WIDTH - itemWidth) / 2,
                    gap 
                }}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
                className={className}
            />
            {showDots && data.length > 1 && (
                <View className="flex-row justify-center gap-2">
                    {data.map((_, index) => (
                        <PaginationDot 
                            key={index} 
                            index={index} 
                            scrollX={scrollX} 
                            itemWidth={itemWidth + gap} 
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

function PaginationDot({ 
    index, 
    scrollX, 
    itemWidth 
}: { 
    index: number, 
    scrollX: SharedValue<number>, 
    itemWidth: number 
}) {
    const dotStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollX.value,
            [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            scrollX.value,
            [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
            [0.8, 1.2, 0.8],
            Extrapolate.CLAMP
        );
        return {
            opacity,
            transform: [{ scale }],
        };
    });

    return (
        <Animated.View 
            style={dotStyle}
            className="w-2 h-2 rounded-full bg-primary"
        />
    );
}
