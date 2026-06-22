interface UsageData {
  requests: number
  tokens: number
  lastReset: Date
}

interface UserPlan {
  name: "free" | "pro" | "team"
  maxRequests: number
  maxTokens: number
}

const userUsage = new Map<string, UsageData>()

const PLANS: Record<string, UserPlan> = {
  free: { name: "free", maxRequests: 50, maxTokens: 50000 },
  pro: { name: "pro", maxRequests: 200, maxTokens: 200000 },
  team: { name: "team", maxRequests: 1000, maxTokens: 1000000 },
}

export class UsageTracker {
  static getUserUsage(userId: string): UsageData {
    if (!userUsage.has(userId)) {
      userUsage.set(userId, {
        requests: 0,
        tokens: 0,
        lastReset: new Date(),
      })
    }
    return userUsage.get(userId)!
  }

  static getUserPlan(userId: string): UserPlan {
    // 테스트 사용자는 더 높은 한도 제공
    if (userId === "test-user") {
      return { name: "free", maxRequests: 100, maxTokens: 100000 }
    }
    return PLANS.free
  }

  static canMakeRequest(userId: string): { allowed: boolean; reason?: string } {
    const usage = this.getUserUsage(userId)
    const plan = this.getUserPlan(userId)

    // 개발 환경에서는 사용량 제한을 더 관대하게
    const isDevMode = process.env.NODE_ENV === "development"
    if (isDevMode && userId === "test-user") {
      // 개발 환경에서도 어느 정도 제한은 두되, 더 관대하게
      if (usage.requests >= 200) {
        return {
          allowed: false,
          reason: `개발 환경 요청 한도(200회)를 초과했습니다.`,
        }
      }
      return { allowed: true }
    }

    if (usage.requests >= plan.maxRequests) {
      return {
        allowed: false,
        reason: `월간 요청 한도(${plan.maxRequests}회)를 초과했습니다.`,
      }
    }

    if (usage.tokens >= plan.maxTokens) {
      return {
        allowed: false,
        reason: `월간 토큰 한도(${plan.maxTokens.toLocaleString()}개)를 초과했습니다.`,
      }
    }

    return { allowed: true }
  }

  static recordUsage(userId: string, tokens: number): void {
    const usage = this.getUserUsage(userId)
    usage.requests += 1
    usage.tokens += tokens
    userUsage.set(userId, usage)

    console.log(`사용량 기록: 사용자 ${userId}, 요청 ${usage.requests}회, 토큰 ${usage.tokens}개`)
  }

  static getUsageStats(userId: string) {
    const usage = this.getUserUsage(userId)
    const plan = this.getUserPlan(userId)

    return {
      current: usage,
      limits: {
        maxRequests: plan.maxRequests,
        maxTokens: plan.maxTokens,
      },
      plan: plan.name,
      percentages: {
        requests: Math.round((usage.requests / plan.maxRequests) * 100),
        tokens: Math.round((usage.tokens / plan.maxTokens) * 100),
      },
    }
  }

  static resetUsage(userId: string): void {
    userUsage.set(userId, {
      requests: 0,
      tokens: 0,
      lastReset: new Date(),
    })
  }
}
