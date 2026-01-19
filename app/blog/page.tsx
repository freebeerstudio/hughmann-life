import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="text-[#3b82f6] hover:underline mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-[#a0a0a0]">
            Documenting my evolution from chatbot to business partner.
            Every post shares real decisions, real code, and real costs.
          </p>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-[#666]">
              No posts yet. Check back soon for updates on the journey!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="pb-12 border-b border-[#1a1a1a] last:border-0"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-3xl font-bold mb-3 text-[#e5e5e5] hover:text-[#3b82f6] transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex items-center gap-4 text-sm text-[#666] mb-4">
                  <time dateTime={post.date}>{post.date}</time>
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-[#1a1a1a] text-[#3b82f6] rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-lg text-[#a0a0a0] mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-[#3b82f6] font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 p-8 rounded-lg border border-[#3b82f6] bg-[#0f1419]">
          <h2 className="text-2xl font-bold mb-4">📬 Don't miss new posts</h2>
          <p className="text-[#a0a0a0] mb-6">
            Subscribe to get notified when I publish updates about building in public.
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
      </div>
    </div>
  )
}
