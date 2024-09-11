import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Passear com o Cachorro', desiredWeeklyFrequency: 5 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalsID: result[0].id, createdAt: startOfWeek.toDate() },
    { goalsID: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
    { goalsID: result[2].id, createdAt: startOfWeek.add(2, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
