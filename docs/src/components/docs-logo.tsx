"use client";

import { useIsMounted } from '@/components/landing-navbar';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export function DocsLogo() {
    const mounted = useIsMounted();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
        <div className="flex items-center gap-2">
            <Image
                src={'/lunar-kit.svg'}
                alt="Lunar Kit Logo"
                width={24}
                height={24}
                className={mounted && !isDark ? "invert" : ""}
            />
            <span className="font-bold tracking-tight">
                Lunar Kit
            </span>
        </div>
    );
}
