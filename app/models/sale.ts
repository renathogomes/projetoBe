import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from './client.js'

export default class Sale extends BaseModel {
  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @column()
  declare unitPrice: number

  @column()
  declare totalPrice: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
