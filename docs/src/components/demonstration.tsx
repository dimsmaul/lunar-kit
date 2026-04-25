'use client'

import React from 'react'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

export interface DemonstrationProps {
    components: React.ReactNode
    code: string
}

const Demonstration: React.FC<DemonstrationProps> = ({ components, code }) => {
    const [tab, setTab] = React.useState<'Demo' | 'Code'>('Demo')
    return (
        <div>
            <div className="flex gap-1 w-fit bg-fd-muted rounded-lg p-1">
                {(['Demo', 'Code'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={[
                            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize',
                            tab === t
                                ? 'bg-fd-background text-fd-foreground shadow-sm'
                                : 'text-fd-muted-foreground hover:text-fd-foreground',
                        ].join(' ')}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <div className='mt-4'>
                {tab === 'Demo' ? (
                    <div className="p-4 min-h-80 flex items-center justify-center border border-fd-border rounded-lg bg-fd-background">
                        {components}
                    </div>
                ) : (
                    <DynamicCodeBlock lang="tsx" code={code} />
                )}
            </div>
        </div>
    )
}

export default Demonstration