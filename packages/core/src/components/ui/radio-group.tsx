// components/ui/radio-group.tsx
import * as React from 'react';
import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Radio } from './radio';

// Radio Group Variants
const radioGroupVariants = cva(
  '',
  {
    variants: {
      orientation: {
        vertical: 'gap-3',
        horizontal: 'flex-row gap-4',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);

interface RadioGroupProps extends VariantProps<typeof radioGroupVariants> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface RadioGroupLabelProps {
  children: React.ReactNode;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
} | null>(null);

function useRadioGroup() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup');
  }
  return context;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
  className,
  orientation,
  disabled = false,
  size = 'md',
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled, size }}>
      <View className={cn(radioGroupVariants({ orientation }), className)}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  value,
  id,
  children,
  className,
  disabled: itemDisabled,
}: RadioGroupItemProps) {
  const { value: selectedValue, onValueChange, disabled: groupDisabled, size } = useRadioGroup();
  const isSelected = selectedValue === value;
  const isDisabled = groupDisabled || itemDisabled;

  return (
    <Radio
      checked={isSelected}
      onCheckedChange={() => !isDisabled && onValueChange?.(value)}
      disabled={isDisabled}
      size={size}
      value={value}
      className={className}
    >
      {children}
    </Radio>
  );
}

export function RadioGroupLabel({ children, className }: RadioGroupLabelProps) {
  const { size } = useRadioGroup();

  const textSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm';

  return (
    <Text variant="body" size={textSize} className={className}>
      {children}
    </Text>
  );
}

export function RadioGroupDescription({ children, className }: RadioGroupLabelProps) {
  return (
    <Text variant="muted" size="sm" className={cn('mt-0.5', className)}>
      {children}
    </Text>
  );
}
