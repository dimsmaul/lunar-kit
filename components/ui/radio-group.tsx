// components/ui/radio-group.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

function useRadioGroup() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup');
  }
  return context;
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <View className={cn('gap-3', className)}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, children, className }: RadioGroupItemProps) {
  const { value: selectedValue, onValueChange } = useRadioGroup();
  const isSelected = selectedValue === value;

  return (
    <Pressable
      onPress={() => onValueChange?.(value)}
      className={cn('flex-row items-center gap-3', className)}
    >
      {/* Radio Circle */}
      <View
        className={cn(
          'h-5 w-5 rounded-full border-2 items-center justify-center',
          isSelected ? 'border-blue-600' : 'border-slate-300'
        )}
      >
        {isSelected && (
          <View className="h-2.5 w-2.5 rounded-full bg-blue-600" />
        )}
      </View>

      {/* Label */}
      {children}
    </Pressable>
  );
}

export function RadioGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn('text-base text-slate-900', className)}>
      {children}
    </Text>
  );
}
