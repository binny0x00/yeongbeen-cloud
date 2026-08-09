import { getDatabase } from '../../content/infrastructure/drizzle/database'
import { aiUsage } from '../../content/infrastructure/drizzle/schema'
import type { AiUsageRecord, AiUsageRepository } from '../ports/ai-provider'

export class DrizzleAiUsageRepository implements AiUsageRepository {
  async record(input: AiUsageRecord): Promise<void> {
    await getDatabase().insert(aiUsage).values(input)
  }
}
