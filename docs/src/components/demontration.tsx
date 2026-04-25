'use client'

import React from 'react'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tabs, TabsList, TabsTrigger } from '@/lunar-kit/components/tabs';


export interface DemonstrationProps {
    components: React.ReactNode
    code: string
}

const Demonstration: React.FC<DemonstrationProps> = ({ components, code }) => {
    const [tab, setTab] = React.useState<string>('Demo')
    return (
        <div>
            {/* <PillTabs items={['Demo', 'Code']} active={tab} onChange={setTab} /> */}
            <div className='w-fit'>
                <Tabs value={tab} onValueChange={setTab} variant={'pill'}>
                    <TabsList className="w-full flex-row">
                        <TabsTrigger value="Demo" className="flex-1 capitalize">Demo</TabsTrigger>
                        <TabsTrigger value="Code" className="flex-1 capitalize">Code</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className='mt-4'>
                {
                    tab === 'Demo' ? (
                        <div className="p-4 min-h-80 flex items-center justify-center border rounded-lg bg-fd-background ">
                            {components}
                        </div>
                    ) : (
                        <DynamicCodeBlock lang="tsx" code={code} />
                    )
                }
            </div>

        </div>
    )
}

export default Demonstration