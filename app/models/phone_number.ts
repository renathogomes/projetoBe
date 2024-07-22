import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Client from './client.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PhoneNumber extends BaseModel {
  @belongsTo(() => Client)
  client!: BelongsTo<typeof Client>

  static get tableName() {
    return 'phone_numbers'
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare phoneNumber: string

  @column()
  declare clientId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
