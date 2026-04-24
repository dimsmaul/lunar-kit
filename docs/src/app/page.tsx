import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          🌙 Lunar Kit
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
          Beautiful, accessible React Native UI components styled with{' '}
          <span className="font-semibold">NativeWind</span>
        </p>
        <div className="mt-10 flex gap-4 justify-center flex-wrap">
          <Link
            href="/docs"
            className="rounded-lg bg-slate-900 px-8 py-3 text-white font-semibold hover:bg-slate-800 transition"
          >
            View Documentation
          </Link>
          <a
            href="https://github.com/dimsmaul/lunar-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-8 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Why Lunar Kit?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg transition">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">Cross-Platform</h3>
            <p className="text-slate-600">
              Build iOS, Android, and web apps with the same component library.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg transition">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">NativeWind Styling</h3>
            <p className="text-slate-600">
              Use Tailwind CSS utilities for consistent, maintainable styling.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg transition">
            <div className="text-3xl mb-4">♿</div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">Fully Accessible</h3>
            <p className="text-slate-600">
              WCAG 2.1 compliant components following WAI-ARIA standards.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg transition">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">Highly Customizable</h3>
            <p className="text-slate-600">
              Extend and customize components using CVA and Tailwind utilities.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg transition">
            <div className="text-3xl mb-4">📦</div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">CLI-Driven</h3>
            <p className="text-slate-600">
              Use the lunar CLI to add components and scaffold new features.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-8 hover:shadow-lg transition">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="font-semibold text-slate-900 mb-3 text-lg">Well Documented</h3>
            <p className="text-slate-600">
              Complete examples, API reference, and best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">39+</div>
            <p className="text-slate-600">Components</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-slate-600">TypeScript</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">MIT</div>
            <p className="text-slate-600">License</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">Active</div>
            <p className="text-slate-600">Community</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 border-t border-slate-200">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to get started?</h2>
        <p className="text-slate-600 mb-8 max-w-xl mx-auto">
          Create a new React Native project with Lunar Kit pre-configured.
        </p>
        <div className="bg-slate-900 text-white p-6 rounded-lg inline-block max-w-2xl">
          <code className="text-sm font-mono">npx create-lunar-kit@latest my-app</code>
        </div>
        <div className="mt-8">
          <Link
            href="/docs"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Read the Documentation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/docs" className="text-slate-600 hover:text-slate-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dimsmaul/lunar-kit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nativewind.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    NativeWind
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Learn</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/docs" className="text-slate-600 hover:text-slate-900">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="/docs" className="text-slate-600 hover:text-slate-900">
                    Component Guide
                  </a>
                </li>
                <li>
                  <a href="/docs" className="text-slate-600 hover:text-slate-900">
                    Best Practices
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/dimsmaul/lunar-kit/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Issues
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dimsmaul/lunar-kit/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Discussions
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/dimsmaul/lunar-kit/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Contributing
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8">
            <p className="text-center text-slate-600">
              © 2025 Lunar Kit. All rights reserved. MIT License.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
