interface UsageData {
  requests: number
  tokens: number
  lastReset: number
}

interface UsageCheck {
  allowed: boolean
  reason?: string
}

export class UsageTracker {
  private static storage = new Map<string, UsageData>()

  // 월별 제한 (무료 사용자 기준)
  private static readonly MONTHLY_REQUEST_LIMIT = 100
  private static readonly MONTHLY_TOKEN_LIMIT = 50000

  // 일별 제한
  private static readonly DAILY_REQUEST_LIMIT = 20
  private static readonly DAILY_TOKEN_LIMIT = 10000

  static canMakeRequest(userId: string): UsageCheck {
    const usage = this.getUserUsage(userId)
    const now = Date.now()
    const oneMonth = 30 * 24 * 60 * 60 * 1000 // 30일
    const oneDay = 24 * 60 * 60 * 1000 // 1일

    // 월별 데이터 리셋 확인
    if (now - usage.lastReset > oneMonth) {
      this.resetUsage(userId)
      return { allowed: true }
    }

    // 월별 제한 확인
    if (usage.requests >= this.MONTHLY_REQUEST_LIMIT) {
      return {
        allowed: false,
        reason: `월별 요청 한도(${this.MONTHLY_REQUEST_LIMIT}회)를 초과했습니다. Pro 플랜으로 업그레이드하세요.`,
      }
    }

    if (usage.tokens >= this.MONTHLY_TOKEN_LIMIT) {
      return {
        allowed: false,
        reason: `월별 토큰 한도(${this.MONTHLY_TOKEN_LIMIT.toLocaleString()}개)를 초과했습니다.`,
      }
    }

    // 일별 제한 확인 (간단한 구현)
    const dailyRequests = this.getDailyRequests(userId)
    if (dailyRequests >= this.DAILY_REQUEST_LIMIT) {
      return {
        allowed: false,
        reason: `일별 요청 한도(${this.DAILY_REQUEST_LIMIT}회)를 초과했습니다. 내일 다시 시도해주세요.`,
      }
    }

    return { allowed: true }
  }

  static recordUsage(userId: string, tokens: number): void {
    const usage = this.getUserUsage(userId)
    usage.requests += 1
    usage.tokens += tokens

    this.storage.set(userId, usage)

    console.log(`사용량 기록 - 사용자: ${userId}, 요청: ${usage.requests}, 토큰: ${usage.tokens}`)
  }

  static getUserUsage(userId: string): UsageData {
    const existing = this.storage.get(userId)
    if (existing) {
      return existing
    }

    const newUsage: UsageData = {
      requests: 0,
      tokens: 0,
      lastReset: Date.now(),
    }

    this.storage.set(userId, newUsage)
    return newUsage
  }

  static resetUsage(userId: string): void {
    const resetUsage: UsageData = {
      requests: 0,
      tokens: 0,
      lastReset: Date.now(),
    }

    this.storage.set(userId, resetUsage)
    console.log(`사용량 리셋 - 사용자: ${userId}`)
  }

  static getDailyRequests(userId: string): number {
    // 간단한 일별 요청 수 계산 (실제로는 더 정교한 구현 필요)
    const usage = this.getUserUsage(userId)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastReset = new Date(usage.lastReset)
    const resetDate = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate())

    // 오늘 리셋된 경우 현재 요청 수 반환, 아니면 0
    return today.getTime() === resetDate.getTime() ? usage.requests : 0
  }

  static getUsageStats(userId: string) {
    const usage = this.getUserUsage(userId)
    return {
      current: {
        requests: usage.requests,
        tokens: usage.tokens,
      },
      limits: {
        maxRequests: this.MONTHLY_REQUEST_LIMIT,
        maxTokens: this.MONTHLY_TOKEN_LIMIT,
      },
      plan: "free",
      percentages: {
        requests: Math.round((usage.requests / this.MONTHLY_REQUEST_LIMIT) * 100),
        tokens: Math.round((usage.tokens / this.MONTHLY_TOKEN_LIMIT) * 100),
      },
      lastReset: usage.lastReset,
    }
  }
}
