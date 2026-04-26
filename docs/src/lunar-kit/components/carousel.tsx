import * as React from 'react';
import {
    View,
    FlatList,
    Dimensions,
    LayoutChangeEvent,
    ViewToken,
} from 'react-native';
import { cn } from '../lib/utils';

export interface CarouselProps<T> {
    data: T[];
    renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
    itemWidth?: number;
    gap?: number;
    showDots?: boolean;
    className?: string;
    containerClassName?: string;
}

export function Carousel<T>({
    data,
    renderItem,
    itemWidth,
    gap = 12,
    showDots = true,
    className,
    containerClassName,
}: CarouselProps<T>) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [containerWidth, setContainerWidth] = React.useState<number | null>(null);

    const resolvedItemWidth = containerWidth
        ? (itemWidth ?? containerWidth - 64)
        : 0;

    // Padding centers the first/last item
    const paddingHorizontal = containerWidth
        ? (containerWidth - resolvedItemWidth) / 2
        : 0;

    // snapInterval must equal itemWidth + gap
    const snapInterval = resolvedItemWidth + gap;

    const onLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        if (width > 0) setContainerWidth(width);
    };

    const onViewableItemsChanged = React.useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setActiveIndex(viewableItems[0].index);
            }
        }
    ).current;

    const viewabilityConfig = React.useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View className={cn('gap-4', containerClassName)} onLayout={onLayout}>
            {containerWidth !== null && (
                <FlatList
                    data={data}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={(info) => (
                        <View
                            style={{
                                width: resolvedItemWidth,
                                // Apply gap as marginRight on ALL items including last
                                // so snapInterval math stays consistent
                                marginRight: gap,
                            }}
                        >
                            {renderItem(info)}
                        </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={snapInterval}
                    // ✅ REMOVE snapToAlignment="center" — it conflicts with snapToInterval
                    // snapToAlignment="center"  <-- DELETE THIS
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={{
                        paddingHorizontal,
                    }}
                    onScroll={(e) => {
                        const index = Math.round(
                            e.nativeEvent.contentOffset.x / snapInterval
                        );
                        setActiveIndex(Math.max(0, Math.min(index, data.length - 1)));
                    }}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    initialNumToRender={3}
                    windowSize={5}
                    className={className}
                />
            )}
            {showDots && data.length > 1 && (
                <View className="flex-row justify-center gap-2">
                    {data.map((_, index) => (
                        <View
                            key={index}
                            className={cn(
                                'rounded-full bg-primary',
                                activeIndex === index
                                    ? 'w-4 h-2 opacity-100'
                                    : 'w-2 h-2 opacity-40'
                            )}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}