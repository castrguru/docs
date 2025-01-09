import glob from 'fast-glob'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import PlausibleProvider from 'next-plausible'

export const metadata = {
    title: {
        template: '%s - Castr GÜRŲ Docs',
        default: 'Castr GÜRŲ Docs',
    },
}

export default async function RootLayout({ children }) {
    let pages = await glob('**/*.mdx', { cwd: 'src/app' })

    let allSectionsEntries = await Promise.all(
        pages.map(async (filename) => [
            '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
            (await import(`./${filename}`)).sections,
        ]),
    )

    let allSections = Object.fromEntries(allSectionsEntries)

    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
            <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
                <PlausibleProvider
                    domain="docs.castr.guru"
                    customDomain="https://plausible.castr.guru"
                >
                    <Providers>
                        <div className="w-full">
                            <Layout allSections={allSections}>{children}</Layout>
                        </div>
                    </Providers>
                </PlausibleProvider>
            </body>
        </html>
    )
}
