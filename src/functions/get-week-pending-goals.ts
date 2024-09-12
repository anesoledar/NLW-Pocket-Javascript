import dayjs from 'dayjs'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, count, lte, gte, eq, sql } from 'drizzle-orm'
import { number } from 'zod'

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUptoWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalCompletionCount = db.$with('goal_completions_conts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id)
          .mapWith(Number)
          .as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          lte(goalCompletions.createdAt, lastDayOfWeek),
          gte(goalCompletions.createdAt, firstDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const pendingGoals = await db
    .with(goalsCreatedUptoWeek, goalCompletionCount)
    .select({
      id: goalsCreatedUptoWeek.id,
      title: goalsCreatedUptoWeek.title,
      desiredWeeklyFrequency: goalsCreatedUptoWeek.desiredWeeklyFrequency,
      completionCount: sql`
        COALESCE(${goalCompletionCount.completionCount}, 0)`.mapWith(number),
    })
    .from(goalsCreatedUptoWeek)
    .leftJoin(
      goalCompletionCount,
      eq(goalCompletionCount.goalId, goalsCreatedUptoWeek.id)
    )

  return {
    pendingGoals,
  }
}
