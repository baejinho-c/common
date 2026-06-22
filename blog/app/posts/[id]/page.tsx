import { notFound } from "next/navigation"
import { getPostById } from "@/app/lib/posts"
import PostContent from "@/app/components/PostContent"

export default async function PostPage({ params }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <PostContent content={post.content} />
    </div>
  )
}
