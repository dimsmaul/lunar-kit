import { DocsLogo } from '@/components/docs-logo';
import { source } from '@/lib/source';
// import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      // tree={source.pageTree}
      githubUrl="https://github.com/dimsmaul/lunar-kit"
      nav={{
        title: <DocsLogo />,

      }}
    >
      {children}
    </DocsLayout>
  );
}
