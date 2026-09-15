/**
 * Sample content, created the moment the instance is claimed.
 *
 * An empty CMS shows an empty site, and the first minute is the one that decides whether a
 * newcomer keeps going. So the new owner's first sight of both the site and the Studio is a
 * working magazine they can edit or delete. Every id is fixed, so seeding twice is harmless.
 */
import type { TrokkyCore } from '@trokky/trokky'

const P = { _status: 'published' } as const

export async function seedSampleContent(core: TrokkyCore): Promise<void> {
  const existing = await core.listDocuments('article', { limit: 1 })
  if (existing.length > 0) return

  await core.saveDocument('settings', {
    id: 'settings',
    ...P,
    siteName: 'The Magazine',
    tagline: 'Stories worth the read',
    tagline_fr: 'Des histoires qui valent le détour',
    navigation: [
      { label: 'Articles', href: '/articles' },
      { label: 'Documents', href: '/documents' },
      { label: 'About', href: '/about' }
    ],
    footer: 'Published with Trokky. Edit everything you see in Studio.',
    footer_fr: 'Publié avec Trokky. Tout ce que vous voyez se modifie dans Studio.'
  })

  await core.saveDocument('author', { id: 'author-editor', ...P, name: 'Ama Kodjo', slug: 'ama-kodjo', role: 'Editor', bio: 'Runs the magazine and writes the long pieces.' })
  await core.saveDocument('author', { id: 'author-contributor', ...P, name: 'Kossi Mensah', slug: 'kossi-mensah', role: 'Contributor', bio: 'Reports from the field.' })

  await core.saveDocument('category', { id: 'category-culture', ...P, name: 'Culture', slug: 'culture', description: 'Books, music, and the people behind them.' })
  await core.saveDocument('category', { id: 'category-tech', ...P, name: 'Technology', slug: 'technology', description: 'What is changing, and what it changes.' })

  const body = (paras: string[]) => paras.map(p => `<p>${p}</p>`).join('')

  await core.saveDocument('article', {
    id: 'article-welcome', ...P,
    title: 'Welcome to your magazine',
    title_fr: 'Bienvenue dans votre magazine',
    slug: 'welcome-to-your-magazine',
    excerpt: 'This site is yours. Here is how it fits together, and what to change first.',
    author: 'author-editor', category: 'category-tech', featured: true,
    publishedAt: new Date().toISOString(),
    body: body([
      'Everything on this site comes from the Studio at <a href="/studio">/studio</a>. This article, the authors, the categories, the navigation in the header — all of it is content you can edit.',
      'Start with <strong>Site settings</strong>: give the magazine its real name. Then open this article and change the title. Refresh the home page. That is the whole loop.',
      'Articles can be drafts. A draft is saved but not shown here; publish it when it is ready. The <em>featured</em> switch decides what leads the home page.'
    ]),
    related: ['article-references', 'article-media']
  })

  await core.saveDocument('article', {
    id: 'article-references', ...P,
    title: 'Authors, categories, and how references work',
    slug: 'authors-categories-and-references',
    excerpt: 'An article points at an author and a category. Change the author once and every article follows.',
    author: 'author-contributor', category: 'category-tech', featured: false,
    publishedAt: new Date(Date.now() - 86_400_000).toISOString(),
    body: body([
      'This article references <strong>Kossi Mensah</strong> as its author. Open the Authors list, rename him, and come back: the byline changed, because the article stores a reference, not a copy.',
      'Categories work the same way, and so do the related articles at the bottom of this page.'
    ]),
    related: ['article-welcome']
  })

  await core.saveDocument('article', {
    id: 'article-media', ...P,
    title: 'Images and documents',
    slug: 'images-and-documents',
    excerpt: 'Upload a cover image to this article and a PDF to the Documents section, and see where they appear.',
    author: 'author-editor', category: 'category-culture', featured: false,
    publishedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    body: body([
      'This article has no cover image yet. Open it in Studio, add one, and it appears at the top of this page and in every list — with a thumbnail made automatically at upload.',
      'The <a href="/documents">Documents</a> section holds files rather than stories: reports, forms, anything people download.'
    ]),
    related: ['article-welcome']
  })

  await core.saveDocument('page', {
    id: 'page-about', ...P,
    title: 'About', slug: 'about',
    body: body(['This magazine runs on <a href="https://trokky.dev">Trokky</a>, a self-hosted CMS, on Cloudflare Workers. The content is in a D1 database and the files in an R2 bucket — both on your own account.'])
  })
}
