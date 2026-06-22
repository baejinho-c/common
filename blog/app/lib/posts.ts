// 포스트 관련 유틸리티 함수들

export interface Post {
  id: string
  title: string
  content: string
  status: "published" | "draft" | "scheduled"
  publishedAt?: string
  scheduledAt?: string
  createdAt: string
  views: number
  likes: number
  category: string
  tags: string[]
}

// 임시 포스트 데이터 (실제로는 데이터베이스에서 가져와야 함)
const mockPosts: Post[] = [
  {
    id: "1",
    title: "AI와 블로그 자동화의 미래",
    content:
      "인공지능 기술의 발전으로 블로그 작성이 더욱 쉬워지고 있습니다. GPT-4o와 같은 대규모 언어 모델을 활용하면 고품질의 콘텐츠를 자동으로 생성할 수 있으며, 이는 블로거들에게 새로운 가능성을 제시합니다.",
    status: "published",
    publishedAt: "2024-01-15T09:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    views: 1250,
    likes: 45,
    category: "기술",
    tags: ["AI", "블로그", "자동화", "GPT-4"],
  },
  {
    id: "2",
    title: "효율적인 콘텐츠 제작 전략",
    content:
      "좋은 콘텐츠를 만들기 위한 체계적인 접근 방법을 알아보겠습니다. 독자의 니즈를 파악하고, 구조화된 글쓰기 방법을 통해 더 나은 콘텐츠를 제작할 수 있습니다.",
    status: "draft",
    createdAt: "2024-01-14T14:30:00Z",
    views: 0,
    likes: 0,
    category: "마케팅",
    tags: ["콘텐츠", "전략", "마케팅"],
  },
  {
    id: "3",
    title: "네이버 블로그 SEO 최적화 가이드",
    content:
      "네이버 블로그에서 검색 노출을 높이는 방법들을 정리했습니다. 키워드 선택부터 제목 작성, 본문 구성까지 SEO 최적화의 모든 것을 다룹니다.",
    status: "scheduled",
    scheduledAt: "2024-01-16T10:00:00Z",
    createdAt: "2024-01-13T16:00:00Z",
    views: 0,
    likes: 0,
    category: "SEO",
    tags: ["네이버", "SEO", "최적화", "검색"],
  },
]

export async function getPostById(id: string): Promise<Post | null> {
  // 실제로는 데이터베이스에서 조회
  const post = mockPosts.find((p) => p.id === id)
  return post || null
}

export async function getAllPosts(): Promise<Post[]> {
  // 실제로는 데이터베이스에서 조회
  return mockPosts
}

export async function getPostsByStatus(status: Post["status"]): Promise<Post[]> {
  return mockPosts.filter((post) => post.status === status)
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  return mockPosts.filter((post) => post.category === category)
}

export async function searchPosts(query: string): Promise<Post[]> {
  const lowercaseQuery = query.toLowerCase()
  return mockPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
