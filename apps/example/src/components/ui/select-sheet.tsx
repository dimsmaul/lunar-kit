// components/ui/select-sheet.tsx
import * as React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from './text';
import { Input } from './input';
import { ChevronDown } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
    BottomSheet,
    BottomSheetContent,
    BottomSheetHeader,
    BottomSheetTitle,
    BottomSheetList,
    BottomSheetFooter,
    BottomSheetClose,
} from './bottom-sheet';
import { Button } from './button';

export interface SelectOption {
    label: string;
    value: string | number;
    [key: string]: any;
}

interface BaseSelectProps {
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    variant?: 'outline' | 'underline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    title?: string;
    description?: string;
    snapPoints?: string[];
    searchable?: boolean;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    emptyMessage?: string;
    name?: string;
}

interface SelectSheetProps extends BaseSelectProps {
    options: SelectOption[];
    value?: string | number;
    onValueChange?: (value: string | number) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
}

interface MultiSelectSheetProps extends BaseSelectProps {
    options: SelectOption[];
    value?: (string | number)[];
    onValueChange?: (value: (string | number)[]) => void;
    maxSelection?: number;
    showCount?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
}

// Single Select
export function SelectSheet({
    options,
    value,
    onValueChange,
    placeholder = 'Select...',
    label,
    error,
    disabled = false,
    variant = 'outline',
    size = 'md',
    className,
    title = 'Select an option',
    description,
    snapPoints = ['70%'],
    searchable = false,
    searchPlaceholder = 'Search...',
    onSearch,
    emptyMessage = 'No options found',
    onLoadMore,
    hasMore = false,
    isLoading = false,
    name,
}: SelectSheetProps) {
    const { colors } = useThemeColors();
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const flatListRef = React.useRef<any>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const displayValue = selectedOption?.label || '';

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleSelect = (selected: SelectOption | SelectOption[] | null) => {
        if (!selected || Array.isArray(selected)) return;
        onValueChange?.(selected.value);
        setOpen(false);
        setSearchQuery('');
    };

    const handleEndReached = () => {
        if (hasMore && !isLoading && onLoadMore) {
            onLoadMore();
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    return (
        <View className={cn('w-full', className)}>
            {label && (
                <Text size="sm" variant="label" className="mb-2">
                    {label}
                </Text>
            )}

            <BottomSheet open={open} onOpenChange={setOpen} snapPoints={snapPoints}>
                <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled}>
                    <Input
                        value={displayValue}
                        placeholder={placeholder}
                        editable={false}
                        pointerEvents="none"
                        variant={variant}
                        size={size}
                        error={!!error}
                        suffix={
                            <ChevronDown
                                size={20}
                                color={disabled ? colors.mutedForeground : colors.foreground}
                            />
                        }
                        containerClassName={cn(disabled && 'opacity-50')}
                    />
                </Pressable>

                <BottomSheetContent>
                    <BottomSheetHeader>
                        <BottomSheetTitle>{title}</BottomSheetTitle>
                        {description && (
                            <Text variant="muted" size="sm" className="mt-1">
                                {description}
                            </Text>
                        )}
                    </BottomSheetHeader>

                    {searchable && (
                        <View className="px-4 pb-3">
                            <Input
                                value={searchQuery}
                                onChangeText={handleSearch}
                                placeholder={searchPlaceholder}
                                autoFocus
                            />
                        </View>
                    )}

                    {filteredOptions.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text variant="muted">{emptyMessage}</Text>
                        </View>
                    ) : (
                        <BottomSheetList
                            data={filteredOptions}
                            variant="select"
                            selectedValue={value}
                            onSelect={handleSelect}
                            getItemValue={(item) => item.value}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                        />
                    )}
                </BottomSheetContent>
            </BottomSheet>

            {error && (
                <Text size="sm" className="text-destructive mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
}

// Multi Select
export function MultiSelectSheet({
    options,
    value = [],
    onValueChange,
    placeholder = 'Select...',
    label,
    error,
    disabled = false,
    variant = 'outline',
    size = 'md',
    className,
    title = 'Select options',
    description,
    snapPoints = ['70%'],
    searchable = false,
    searchPlaceholder = 'Search...',
    onSearch,
    emptyMessage = 'No options found',
    maxSelection,
    showCount = true,
    onLoadMore,
    hasMore = false,
    isLoading = false,
    name,
}: MultiSelectSheetProps) {
    const { colors } = useThemeColors();
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [tempSelected, setTempSelected] = React.useState<(string | number)[]>(value);
    const flatListRef = React.useRef<any>(null);

    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    const displayValue =
        value.length > 2
            ? `${value.length} items selected`
            : selectedOptions.map((opt) => opt.label).join(', ');

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Sync tempSelected with value when opening
    React.useEffect(() => {
        if (open) {
            setTempSelected(value);
        }
    }, [open]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleSelect = (selected: SelectOption | SelectOption[] | null) => {
        if (!selected || !Array.isArray(selected)) return;

        const selectedValues = selected.map((item) => item.value);

        // Enforce max selection
        if (maxSelection && selectedValues.length > maxSelection) {
            // Take only first N items
            setTempSelected(selectedValues.slice(0, maxSelection));
            return;
        }

        setTempSelected(selectedValues);
    };

    const handleConfirm = () => {
        onValueChange?.(tempSelected);
        setOpen(false);
        setSearchQuery('');
    };

    const handleCancel = () => {
        setTempSelected(value);
        setOpen(false);
        setSearchQuery('');
    };

    const handleEndReached = () => {
        if (hasMore && !isLoading && onLoadMore) {
            onLoadMore();
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    return (
        <View className={cn('w-full', className)}>
            {label && (
                <Text size="sm" variant='label' className="mb-2">
                    {label}
                </Text>
            )}

            <BottomSheet open={open} onOpenChange={setOpen} snapPoints={snapPoints}>
                <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled}>
                    <Input
                        value={displayValue}
                        placeholder={placeholder}
                        editable={false}
                        pointerEvents="none"
                        variant={variant}
                        size={size}
                        error={!!error}
                        suffix={
                            <ChevronDown
                                size={20}
                                color={disabled ? colors.mutedForeground : colors.foreground}
                            />
                        }
                        containerClassName={cn(disabled && 'opacity-50')}
                    />
                </Pressable>

                <BottomSheetContent>
                    <BottomSheetHeader>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <BottomSheetTitle>{title}</BottomSheetTitle>
                                {description && (
                                    <Text variant="muted" size="sm" className="mt-1">
                                        {description}
                                    </Text>
                                )}
                            </View>
                            {showCount && (
                                <Text variant="muted" size="sm">
                                    {tempSelected.length}
                                    {maxSelection ? `/${maxSelection}` : ''} selected
                                </Text>
                            )}
                        </View>
                    </BottomSheetHeader>

                    {searchable && (
                        <View className="px-4 pb-3">
                            <Input
                                value={searchQuery}
                                onChangeText={handleSearch}
                                placeholder={searchPlaceholder}
                                autoFocus
                            />
                        </View>
                    )}

                    {filteredOptions.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text variant="muted">{emptyMessage}</Text>
                        </View>
                    ) : (
                        <BottomSheetList
                            data={filteredOptions}
                            variant="multiple"
                            selectedValues={tempSelected}
                            onSelect={handleSelect}
                            getItemValue={(item) => item.value}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                        />
                    )}

                    <BottomSheetFooter>
                        <View className="flex-row gap-2">
                            <BottomSheetClose>
                                <Button
                                    variant="outline"
                                    onPress={handleCancel}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </BottomSheetClose>
                            <Button onPress={handleConfirm} className="flex-1">
                                Confirm
                            </Button>
                        </View>
                    </BottomSheetFooter>
                </BottomSheetContent>
            </BottomSheet>

            {error && (
                <Text size="sm" className="text-destructive mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
}

// // components/ui/select-sheet.tsx
// import * as React from 'react';
// import { View, Pressable, ActivityIndicator } from 'react-native';
// import { cn } from '@/lib/utils';
// import { Text } from './text';
// import { Input } from './input';
// import { ChevronDown } from 'lucide-react-native';
// import { useThemeColors } from '@/hooks/useThemeColors';
// import {
//     BottomSheet,
//     BottomSheetContent,
//     BottomSheetHeader,
//     BottomSheetTitle,
//     BottomSheetList,
//     BottomSheetFooter,
//     BottomSheetClose,
// } from './bottom-sheet';
// import { Button } from './button';

// export interface SelectOption {
//     label: string;
//     value: string | number;
//     [key: string]: any;
// }

// interface BaseSelectProps {
//     placeholder?: string;
//     label?: string;
//     error?: string;
//     disabled?: boolean;
//     variant?: 'outline' | 'underline';
//     size?: 'sm' | 'md' | 'lg';
//     className?: string;
//     title?: string;
//     description?: string;
//     snapPoints?: string[];
//     searchable?: boolean;
//     searchPlaceholder?: string;
//     onSearch?: (query: string) => void;
//     emptyMessage?: string;
//     name?: string;
// }

// interface SelectSheetProps extends BaseSelectProps {
//     options: SelectOption[];
//     value?: string | number;
//     onValueChange?: (value: string | number) => void;
//     onLoadMore?: () => void;
//     hasMore?: boolean;
//     isLoading?: boolean;
// }

// interface MultiSelectSheetProps extends BaseSelectProps {
//     options: SelectOption[];
//     value?: (string | number)[];
//     onValueChange?: (value: (string | number)[]) => void;
//     maxSelection?: number;
//     showCount?: boolean;
//     onLoadMore?: () => void;
//     hasMore?: boolean;
//     isLoading?: boolean;
// }

// // Single Select
// export function SelectSheet({
//     options,
//     value,
//     onValueChange,
//     placeholder = 'Select...',
//     label,
//     error,
//     disabled = false,
//     variant = 'outline',
//     size = 'md',
//     className,
//     title = 'Select an option',
//     description,
//     snapPoints = ['70%'],
//     searchable = false,
//     searchPlaceholder = 'Search...',
//     onSearch,
//     emptyMessage = 'No options found',
//     onLoadMore,
//     hasMore = false,
//     isLoading = false,
//     name,
// }: SelectSheetProps) {
//     const { colors } = useThemeColors();
//     const [open, setOpen] = React.useState(false);
//     const [searchQuery, setSearchQuery] = React.useState('');

//     const selectedOption = options.find((opt) => opt.value === value);
//     const displayValue = selectedOption?.label || '';

//     const filteredOptions = React.useMemo(() => {
//         if (!searchQuery) return options;
//         return options.filter((opt) =>
//             opt.label.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     }, [options, searchQuery]);

//     const handleSearch = (query: string) => {
//         setSearchQuery(query);
//         onSearch?.(query);
//     };

//     const handleSelect = (selected: SelectOption | SelectOption[] | null) => {
//         if (!selected || Array.isArray(selected)) return;
//         onValueChange?.(selected.value);
//         setOpen(false);
//         setSearchQuery('');
//     };

//     const handleEndReached = () => {
//         if (hasMore && !isLoading && onLoadMore) {
//             onLoadMore();
//         }
//     };

//     const renderFooter = () => {
//         if (!isLoading) return null;
//         return (
//             <View className="py-4 items-center">
//                 <ActivityIndicator size="small" color={colors.primary} />
//             </View>
//         );
//     };

//     return (
//         <View className={cn('w-full', className)}>
//             {label && (
//                 <Text size="sm" variant="label" className="mb-2">
//                     {label}
//                 </Text>
//             )}

//             <BottomSheet open={open} onOpenChange={setOpen} snapPoints={snapPoints}>
//                 <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled}>
//                     <Input
//                         value={displayValue}
//                         placeholder={placeholder}
//                         editable={false}
//                         pointerEvents="none"
//                         variant={variant}
//                         size={size}
//                         error={!!error}
//                         suffix={
//                             <ChevronDown
//                                 size={20}
//                                 color={disabled ? colors.mutedForeground : colors.foreground}
//                             />
//                         }
//                         containerClassName={cn(disabled && 'opacity-50')}
//                     />
//                 </Pressable>

//                 <BottomSheetContent>
//                     <BottomSheetHeader>
//                         <BottomSheetTitle>{title}</BottomSheetTitle>
//                         {description && (
//                             <Text variant="muted" size="sm" className="mt-1">
//                                 {description}
//                             </Text>
//                         )}
//                     </BottomSheetHeader>

//                     {searchable && (
//                         <View className="px-4 pb-3">
//                             <Input
//                                 value={searchQuery}
//                                 onChangeText={handleSearch}
//                                 placeholder={searchPlaceholder}
//                                 autoFocus
//                             />
//                         </View>
//                     )}

//                     {filteredOptions.length === 0 ? (
//                         <View className="flex-1 items-center justify-center py-8">
//                             <Text variant="muted">{emptyMessage}</Text>
//                         </View>
//                     ) : (
//                         <BottomSheetList
//                             data={filteredOptions}
//                             variant="select"
//                             selectedValue={value}
//                             onSelect={handleSelect}
//                             getItemValue={(item) => item.value}
//                             onEndReached={handleEndReached}
//                             onEndReachedThreshold={0.5}
//                             ListFooterComponent={renderFooter}
//                         />
//                     )}
//                     {/* <BottomSheetFooter>
//                         {renderFooter()}
//                     </BottomSheetFooter> */}
//                 </BottomSheetContent>
//             </BottomSheet>

//             {error && (
//                 <Text size="sm" className="text-destructive mt-1">
//                     {error}
//                 </Text>
//             )}
//         </View>
//     );
// }

// // Multi Select
// export function MultiSelectSheet({
//     options,
//     value = [],
//     onValueChange,
//     placeholder = 'Select...',
//     label,
//     error,
//     disabled = false,
//     variant = 'outline',
//     size = 'md',
//     className,
//     title = 'Select options',
//     description,
//     snapPoints = ['70%'],
//     searchable = false,
//     searchPlaceholder = 'Search...',
//     onSearch,
//     emptyMessage = 'No options found',
//     maxSelection,
//     showCount = true,
//     onLoadMore,
//     hasMore = false,
//     isLoading = false,
//     name,
// }: MultiSelectSheetProps) {
//     const { colors } = useThemeColors();
//     const [open, setOpen] = React.useState(false);
//     const [searchQuery, setSearchQuery] = React.useState('');
//     const [tempSelected, setTempSelected] = React.useState<(string | number)[]>(value);

//     const selectedOptions = options.filter((opt) => tempSelected.includes(opt.value));
//     const displayValue =
//         tempSelected.length > 2
//             ? `${tempSelected.length} items selected`
//             : selectedOptions.map((opt) => opt.label).join(', ');

//     const filteredOptions = React.useMemo(() => {
//         if (!searchQuery) return options;
//         return options.filter((opt) =>
//             opt.label.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     }, [options, searchQuery]);

//     React.useEffect(() => {
//         if (open) {
//             setTempSelected(value);
//         }
//     }, [open, value]);

//     const handleSearch = (query: string) => {
//         setSearchQuery(query);
//         onSearch?.(query);
//     };

//     const handleSelect = (selected: SelectOption | SelectOption[] | null) => {
//         if (!selected || !Array.isArray(selected)) return;

//         const selectedValues = selected.map((item) => item.value);

//         if (maxSelection && selectedValues.length > maxSelection) {
//             return;
//         }

//         setTempSelected(selectedValues);
//     };

//     const handleConfirm = () => {
//         onValueChange?.(tempSelected);
//         setOpen(false);
//         setSearchQuery('');
//     };

//     const handleCancel = () => {
//         setTempSelected(value);
//         setOpen(false);
//         setSearchQuery('');
//     };

//     const handleEndReached = () => {
//         if (hasMore && !isLoading && onLoadMore) {
//             onLoadMore();
//         }
//     };

//     const renderFooter = () => {
//         if (!isLoading) return null;
//         return (
//             <View className="py-4 items-center">
//                 <ActivityIndicator size="small" color={colors.primary} />
//             </View>
//         );
//     };

//     return (
//         <View className={cn('w-full', className)}>
//             {label && (
//                 <Text size="sm" variant="label" className="mb-2">
//                     {label}
//                 </Text>
//             )}

//             <BottomSheet open={open} onOpenChange={setOpen} snapPoints={snapPoints}>
//                 <Pressable onPress={() => !disabled && setOpen(true)} disabled={disabled}>
//                     <Input
//                         value={displayValue}
//                         placeholder={placeholder}
//                         editable={false}
//                         pointerEvents="none"
//                         variant={variant}
//                         size={size}
//                         error={!!error}
//                         suffix={
//                             <ChevronDown
//                                 size={20}
//                                 color={disabled ? colors.mutedForeground : colors.foreground}
//                             />
//                         }
//                         containerClassName={cn(disabled && 'opacity-50')}
//                     />
//                 </Pressable>

//                 <BottomSheetContent>
//                     <BottomSheetHeader>
//                         <View className="flex-row items-center justify-between">
//                             <View className="flex-1">
//                                 <BottomSheetTitle>{title}</BottomSheetTitle>
//                                 {description && (
//                                     <Text variant="muted" size="sm" className="mt-1">
//                                         {description}
//                                     </Text>
//                                 )}
//                             </View>
//                             {showCount && (
//                                 <Text variant="muted" size="sm">
//                                     {tempSelected.length}
//                                     {maxSelection ? `/${maxSelection}` : ''} selected
//                                 </Text>
//                             )}
//                         </View>
//                     </BottomSheetHeader>

//                     {searchable && (
//                         <View className="px-4 pb-3">
//                             <Input
//                                 value={searchQuery}
//                                 onChangeText={handleSearch}
//                                 placeholder={searchPlaceholder}
//                                 autoFocus
//                             />
//                         </View>
//                     )}

//                     {filteredOptions.length === 0 ? (
//                         <View className="flex-1 items-center justify-center py-8">
//                             <Text variant="muted">{emptyMessage}</Text>
//                         </View>
//                     ) : (
//                         <BottomSheetList
//                             data={filteredOptions}
//                             variant="multiple"
//                             selectedValues={tempSelected}
//                             onSelect={handleSelect}
//                             getItemValue={(item) => item.value}
//                             onEndReached={handleEndReached}
//                             onEndReachedThreshold={0.5}
//                             ListFooterComponent={renderFooter}
//                         />
//                     )}

//                     <BottomSheetFooter>
//                         <View className="flex-row gap-2">
//                             <BottomSheetClose>
//                                 <Button
//                                     variant="outline"
//                                     onPress={handleCancel}
//                                     className="flex-1"
//                                 >
//                                     Cancel
//                                 </Button>
//                             </BottomSheetClose>
//                             <Button onPress={handleConfirm} className="flex-1">
//                                 Confirm
//                             </Button>
//                         </View>
//                     </BottomSheetFooter>
//                 </BottomSheetContent>
//             </BottomSheet>

//             {error && (
//                 <Text size="sm" className="text-destructive mt-1">
//                     {error}
//                 </Text>
//             )}
//         </View>
//     );
// }
