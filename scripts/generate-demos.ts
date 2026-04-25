import { writeFileSync } from 'fs';
import { join } from 'path';

const missing = [
  'alert', 'breadcrumb', 'carousel', 'empty-state', 'input-otp',
  'progress', 'radio-group', 'search-bar', 'separator', 'skeleton',
  'slider', 'step-indicator', 'switch', 'toast', 'toaster'
];

function pascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generateDemo(name: string): string {
  const Pascal = pascalCase(name);
  const kebab = name;
  
  return `'use client'

import Demonstration from '@/components/demontration'
import { ${Pascal} } from '@/lunar-kit/components/${kebab}'
import { View } from 'react-native'
import React from 'react'

const ${Pascal}Demo = () => {
  return (
    <Demonstration components={
      <View>
        <${Pascal} />
      </View>
    } code={\`import { ${Pascal} } from '@/components/ui/${kebab}'

const ${Pascal}Preview = () => {
  return (
    <${Pascal} />
  )
}

export default ${Pascal}Preview\`}/>
  )
}

export default ${Pascal}Demo
`;
}

async function main() {
  const demoDir = 'docs/src/demo';
  let created = 0;

  for (const comp of missing) {
    const Pascal = pascalCase(comp);
    const filePath = join(demoDir, `${Pascal}Demo.tsx`);
    const demo = generateDemo(comp);
    writeFileSync(filePath, demo);
    console.log(`✅ ${Pascal}Demo`);
    created++;
  }

  console.log(`\n✨ Created ${created} demo components`);
}

main().catch(console.error);
