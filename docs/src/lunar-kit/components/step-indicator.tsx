// components/ui/step-indicator.tsx
import * as React from 'react';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from './text';
import { cn } from '../lib/utils';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface Step {
    title: string;
    description?: string;
}

export interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export function StepIndicator({
    steps,
    currentStep,
    orientation = 'horizontal',
    className,
}: StepIndicatorProps) {
    const { colors } = useThemeColors();
    const isVertical = orientation === 'vertical';

    return (
        <View className={cn(
            isVertical ? "flex-col" : "flex-row items-start px-4",
            className
        )}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <View 
                        key={index} 
                        className={cn(
                            isVertical ? "flex-row mb-2" : "flex-1 items-center"
                        )}
                    >
                        {/* Indicator part (Circle + Line) */}
                        <View className={cn(
                            isVertical ? "items-center mr-4" : "flex-row items-center w-full"
                        )}>
                            {/* Horizontal Line before */}
                            {!isVertical && (
                                <View 
                                    className={cn(
                                        "h-0.5 flex-1",
                                        index === 0 ? "bg-transparent" :
                                        isCompleted || isActive ? "bg-primary" : "bg-muted"
                                    )} 
                                />
                            )}
                            
                            {/* Circle */}
                            <View 
                                className={cn(
                                    "w-8 h-8 rounded-full items-center justify-center border-2 z-10",
                                    isCompleted ? "bg-primary border-primary" : 
                                    isActive ? "border-primary bg-background" : 
                                    "border-muted bg-background"
                                )}
                            >
                                {isCompleted ? (
                                    <Check size={16} color={colors.primaryForeground} />
                                ) : (
                                    <Text 
                                        className={cn(
                                            "font-bold",
                                            isActive ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </View>

                            {/* Horizontal Line after */}
                            {!isVertical && (
                                <View 
                                    className={cn(
                                        "h-0.5 flex-1",
                                        isLast ? "bg-transparent" :
                                        isCompleted ? "bg-primary" : "bg-muted"
                                    )} 
                                />
                            )}

                            {/* Vertical Line down (only for vertical) */}
                            {isVertical && !isLast && (
                                <View 
                                    className={cn(
                                        "w-0.5 h-10 -mb-2",
                                        isCompleted ? "bg-primary" : "bg-muted"
                                    )} 
                                />
                            )}
                        </View>

                        {/* Labels */}
                        <View className={cn(
                            isVertical ? "flex-1 pt-1" : "mt-2 items-center px-1"
                        )}>
                            <Text 
                                size="sm" 
                                className={cn(
                                    "font-medium",
                                    isVertical ? "text-left" : "text-center",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                )}
                                numberOfLines={1}
                            >
                                {step.title}
                            </Text>
                            {step.description && (
                                <Text 
                                    size="sm" 
                                    className={cn(
                                        "text-muted-foreground",
                                        isVertical ? "text-left" : "text-center"
                                    )}
                                    numberOfLines={1}
                                >
                                    {step.description}
                                </Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
}
