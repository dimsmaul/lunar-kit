// components/ui/avatar.tsx
import * as React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { cn } from '@/lib/utils';

interface AvatarProps {
    source?: ImageSourcePropType;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
    className?: string;
}

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
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
    size: 'sm' | 'md' | 'lg' | 'xl';
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

// Size mappings
const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
};

const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
};

const statusSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
};

const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
};

export function Avatar({
    source,
    alt,
    fallback,
    size = 'md',
    status,
    className
}: AvatarProps) {
    const [hasImage, setHasImage] = React.useState(!!source);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setHasImage(!!source && !imageError);
    }, [source, imageError]);

    // Get initials from fallback text
    const getInitials = (text?: string) => {
        if (!text) return '?';
        const words = text.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return text.substring(0, 2).toUpperCase();
    };

    return (
        <AvatarContext.Provider value={{ size, hasImage, setHasImage }}>
            <View className={cn('relative', className)}>
                <View
                    className={cn(
                        'rounded-full overflow-hidden items-center justify-center bg-slate-200',
                        sizeClasses[size]
                    )}
                >
                    {source && !imageError ? (
                        <Image
                            source={source}
                            alt={alt}
                            className="w-full h-full"
                            onError={() => setImageError(true)}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text
                            className={cn(
                                'font-semibold text-slate-600',
                                textSizeClasses[size]
                            )}
                        >
                            {getInitials(fallback || alt)}
                        </Text>
                    )}
                </View>

                {/* Status Indicator */}
                {status && (
                    <View
                        className={cn(
                            'absolute bottom-0 right-0 rounded-full border-2 border-white',
                            statusSizeClasses[size],
                            statusColors[status]
                        )}
                    />
                )}
            </View>
        </AvatarContext.Provider>
    );
}

// Composable Avatar components
export function AvatarRoot({
    size = 'md',
    className,
    children
}: {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    children: React.ReactNode;
}) {
    const [hasImage, setHasImage] = React.useState(false);

    return (
        <AvatarContext.Provider value={{ size, hasImage, setHasImage }}>
            <View
                className={cn(
                    'rounded-full overflow-hidden items-center justify-center bg-slate-200',
                    sizeClasses[size],
                    className
                )}
            >
                {children}
            </View>
        </AvatarContext.Provider>
    );
}

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

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
    const { size, hasImage } = useAvatar();

    if (hasImage) return null;

    return (
        <Text
            className={cn(
                'font-semibold text-slate-600',
                textSizeClasses[size],
                className
            )}
        >
            {children}
        </Text>
    );
}

// Avatar Group
export function AvatarGroup({ children, max = 3, size = 'md', className }: AvatarGroupProps) {
    const avatars = React.Children.toArray(children);
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    // Overlap offset based on size
    const overlapOffset = {
        sm: -8,
        md: -10,
        lg: -12,
        xl: -16,
    };

    return (
        <View className={cn('flex-row items-center', className)}>
            {visibleAvatars.map((avatar, index) => (
                <View
                    key={index}
                    style={{
                        marginLeft: index > 0 ? overlapOffset[size] : 0,
                        zIndex: visibleAvatars.length - index,
                    }}
                    className="border-2 border-white rounded-full"
                >
                    {React.isValidElement(avatar) && avatar.type === Avatar
                        ? React.cloneElement(avatar as React.ReactElement<AvatarProps>, { size })
                        : avatar}
                </View>
            ))}

            {/* Remaining count badge */}
            {remainingCount > 0 && (
                <View
                    style={{
                        marginLeft: overlapOffset[size],
                        zIndex: 0,
                    }}
                    className={cn(
                        'rounded-full bg-slate-300 items-center justify-center border-2 border-white',
                        sizeClasses[size]
                    )}
                >
                    <Text
                        className={cn(
                            'font-semibold text-slate-700',
                            textSizeClasses[size]
                        )}
                    >
                        +{remainingCount}
                    </Text>
                </View>
            )}
        </View>
    );
}
