// components/ui/avatar.tsx
import * as React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Text } from './text';

// Avatar Variants
const avatarVariants = cva(
    'rounded-full overflow-hidden items-center justify-center',
    {
        variants: {
            variant: {
                default: 'bg-muted',
                primary: 'bg-primary',
                secondary: 'bg-secondary',
                outline: 'bg-background border-2 border-border',
            },
            size: {
                xs: 'h-6 w-6',
                sm: 'h-8 w-8',
                md: 'h-10 w-10',
                lg: 'h-12 w-12',
                xl: 'h-16 w-16',
                '2xl': 'h-20 w-20',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

// Text size variants
const avatarTextVariants = cva(
    'font-semibold',
    {
        variants: {
            variant: {
                default: 'text-muted-foreground',
                primary: 'text-primary-foreground',
                secondary: 'text-secondary-foreground',
                outline: 'text-foreground',
            },
            size: {
                xs: 'text-[10px]',
                sm: 'text-xs',
                md: 'text-sm',
                lg: 'text-base',
                xl: 'text-xl',
                '2xl': 'text-2xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

// Status indicator variants
const statusVariants = cva(
    'absolute bottom-0 right-0 rounded-full border-2 border-background',
    {
        variants: {
            status: {
                online: 'bg-green-500',
                offline: 'bg-muted-foreground',
                away: 'bg-yellow-500',
                busy: 'bg-red-500',
            },
            size: {
                xs: 'h-1.5 w-1.5',
                sm: 'h-2 w-2',
                md: 'h-2.5 w-2.5',
                lg: 'h-3 w-3',
                xl: 'h-4 w-4',
                '2xl': 'h-5 w-5',
            },
        },
    }
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
    source?: ImageSourcePropType;
    alt?: string;
    fallback?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
    className?: string;
}

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    variant?: 'default' | 'primary' | 'secondary' | 'outline';
    className?: string;
}

interface AvatarImageProps {
    source: ImageSourcePropType;
    alt?: string;
}

interface AvatarFallbackProps {
    children: React.ReactNode;
    className?: string;
}

const AvatarContext = React.createContext<{
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    variant: 'default' | 'primary' | 'secondary' | 'outline';
    hasImage: boolean;
    setHasImage: (value: boolean) => void;
} | null>(null);

function useAvatar() {
    const context = React.useContext(AvatarContext);
    if (!context) {
        throw new Error('Avatar components must be used within Avatar');
    }
    return context;
}

// Get initials helper
const getInitials = (text?: string) => {
    if (!text) return '?';
    const words = text.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
};

// Simple Avatar (All-in-one)
export function Avatar({
    source,
    alt,
    fallback,
    size = 'md',
    variant = 'default',
    status,
    className
}: AvatarProps) {
    const [hasImage, setHasImage] = React.useState(!!source);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setHasImage(!!source && !imageError);
    }, [source, imageError]);

    const avatarSize = size ?? 'md';
    const avatarVariant = variant ?? 'default';

    return (
        <AvatarContext.Provider value={{
            size: avatarSize,
            variant: avatarVariant,
            hasImage,
            setHasImage
        }}>
            <View className={cn('relative', className)}>
                <View className={cn(avatarVariants({ variant: avatarVariant, size: avatarSize }))}>
                    {source && !imageError ? (
                        <Image
                            source={source}
                            alt={alt}
                            className="w-full h-full"
                            onError={() => setImageError(true)}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text className={cn(avatarTextVariants({ variant: avatarVariant, size: avatarSize }))}>
                            {getInitials(fallback || alt)}
                        </Text>
                    )}
                </View>

                {/* Status Indicator */}
                {status && (
                    <View className={cn(statusVariants({ status, size: avatarSize }))} />
                )}
            </View>
        </AvatarContext.Provider>
    );
}

// Composable Avatar Root
export function AvatarRoot({
    size = 'md',
    variant = 'default',
    className,
    children
}: {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    variant?: 'default' | 'primary' | 'secondary' | 'outline';
    className?: string;
    children: React.ReactNode;
}) {
    const [hasImage, setHasImage] = React.useState(false);

    const avatarSize = size ?? 'md';
    const avatarVariant = variant ?? 'default';

    return (
        <AvatarContext.Provider value={{
            size: avatarSize,
            variant: avatarVariant,
            hasImage,
            setHasImage
        }}>
            <View className={cn(avatarVariants({ variant: avatarVariant, size: avatarSize }), className)}>
                {children}
            </View>
        </AvatarContext.Provider>
    );
}

// Avatar Image
export function AvatarImage({ source, alt }: AvatarImageProps) {
    const { setHasImage } = useAvatar();

    return (
        <Image
            source={source}
            alt={alt}
            className="w-full h-full"
            onLoad={() => setHasImage(true)}
            onError={() => setHasImage(false)}
            resizeMode="cover"
        />
    );
}

// Avatar Fallback
export function AvatarFallback({ children, className }: AvatarFallbackProps) {
    const { size, variant, hasImage } = useAvatar();

    if (hasImage) return null;

    return (
        <Text className={cn(avatarTextVariants({ variant, size }), className)}>
            {children}
        </Text>
    );
}

// Avatar Status
export function AvatarStatus({
    status
}: {
    status: 'online' | 'offline' | 'away' | 'busy'
}) {
    const { size } = useAvatar();

    return (
        <View className={cn(statusVariants({ status, size }))} />
    );
}

// Avatar Group
export function AvatarGroup({
    children,
    max = 3,
    size = 'md',
    variant = 'default',
    className
}: AvatarGroupProps) {
    const avatars = React.Children.toArray(children);
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const avatarSize = size ?? 'md';
    const avatarVariant = variant ?? 'default';

    // Overlap offset based on size
    const overlapOffset = {
        xs: -6,
        sm: -8,
        md: -10,
        lg: -12,
        xl: -16,
        '2xl': -20,
    };

    return (
        <View className={cn('flex-row items-center', className)}>
            {visibleAvatars.map((avatar, index) => (
                <View
                    key={index}
                    style={{
                        marginLeft: index > 0 ? overlapOffset[avatarSize] : 0,
                        zIndex: visibleAvatars.length - index,
                    }}
                    className="border-2 border-background rounded-full"
                >
                    {React.isValidElement(avatar) && avatar.type === Avatar
                        ? React.cloneElement(avatar as React.ReactElement<AvatarProps>, {
                            size: avatarSize,
                            variant: avatarVariant
                        })
                        : avatar}
                </View>
            ))}

            {/* Remaining count badge */}
            {remainingCount > 0 && (
                <View
                    style={{
                        marginLeft: overlapOffset[avatarSize],
                        zIndex: 0,
                    }}
                    className={cn(
                        avatarVariants({ variant: 'default', size: avatarSize }),
                        'border-2 border-background'
                    )}
                >
                    <Text className={cn(avatarTextVariants({ variant: 'default', size: avatarSize }))}>
                        +{remainingCount}
                    </Text>
                </View>
            )}
        </View>
    );
}
