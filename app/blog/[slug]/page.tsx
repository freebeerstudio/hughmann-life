import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Cache purge: 2026-01-05-14:06 - Force Vercel to regenerate all routes
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamic = 'force-static' // Force static generation

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  try {
    const post = await getPostBySlug(slug)
    const relatedPosts = getRelatedPosts(slug, 3)

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
        <article className="max-w-4xl mx-auto px-6 py-20">
          {/* Back Link */}
          <Link
            href="/blog"
            className="text-[#3b82f6] hover:underline mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-[#666] mb-6">
              <time dateTime={post.date}>{post.date}</time>
              <span>·</span>
              <span>{post.readTime} min read</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-[#1a1a1a] text-[#3b82f6] rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-16">
            <div className="prose-headings:text-[#e5e5e5] prose-p:text-[#a0a0a0] prose-p:leading-relaxed prose-a:text-[#3b82f6] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#e5e5e5] prose-code:text-[#3b82f6] prose-code:bg-[#1a1a1a] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-[#2a2a2a]">
              {post.content}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="my-16 p-8 rounded-lg border border-[#3b82f6] bg-[#0f1419]">
            <h2 className="text-2xl font-bold mb-4">📬 Enjoyed this post?</h2>
            <p className="text-[#a0a0a0] mb-6">
              Subscribe to get notified when I publish new updates about building in public.
            </p>

            <form className="flex gap-4">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#3b82f6] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#3b82f6] text-white rounded-lg font-semibold hover:bg-[#2563eb] transition-colors"
              >
                Subscribe
              </button>
            </form>

            <p className="text-sm text-[#666] mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-16 border-t border-[#1a1a1a]">
              <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-6 rounded-lg border border-[#1a1a1a] hover:border-[#3b82f6] transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-[#e5e5e5]">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-[#666] mb-3">
                      {relatedPost.date} · {relatedPost.readTime} min read
                    </p>
                    <p className="text-[#a0a0a0]">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
