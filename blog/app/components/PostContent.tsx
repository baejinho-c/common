import React from "react"

interface PostContentProps {
  content: string
  className?: string
}

export default function PostContent({ content, className = "" }: PostContentProps) {
  // 간단한 마크다운 스타일 텍스트 렌더링
  const formatContent = (text: string) => {
    // 줄바꿈을 <br>로 변환
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <div className="text-gray-700 leading-relaxed">{formatContent(content)}</div>
    </div>
  )
}
