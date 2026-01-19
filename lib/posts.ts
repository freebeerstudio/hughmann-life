import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import readingTime from 'reading-time'

export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  author?: string
  featured?: boolean
  published?: boolean
  readTime: number
  content?: string
}

const postsDirectory = path.join(process.cwd(), 'Content/posts')

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
  // Ensure Content/posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        author: data.author || 'Hugh Mann',
        featured: data.featured || false,
        published: data.published !== false, // Default to true
        readTime: Math.ceil(readingTime(content).minutes),
      }
    })
    .filter((post) => post.published)
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))

  return posts
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Compile MDX
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
    },
  })

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    tags: data.tags || [],
    excerpt: data.excerpt || '',
    author: data.author || 'Hugh Mann',
    featured: data.featured || false,
    published: data.published !== false,
    readTime: Math.ceil(readingTime(content).minutes),
    content: mdxContent,
  }
}

/**
 * Get posts filtered by tag
 */
export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.tags.includes(tag))
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts()
  const tags = new Set<string>()
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

/**
 * Get related posts based on shared tags
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): Post[] {
  const allPosts = getAllPosts()
  const currentPost = allPosts.find((post) => post.slug === currentSlug)

  if (!currentPost) return []

  // Score posts by number of matching tags
  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const matchingTags = post.tags.filter((tag) => currentPost.tags.includes(tag))
      return {
        post,
        score: matchingTags.length,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scoredPosts.map((item) => item.post)
}
