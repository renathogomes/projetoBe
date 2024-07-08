import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import PhoneNumber from './phone_number.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Address from './address.js'
import Sale from './sale.js'

export default class Client extends BaseModel {
  @hasMany(() => PhoneNumber)
  declare phoneNumbers: HasMany<typeof PhoneNumber>

  @hasMany(() => Address)
  declare addresses: HasMany<typeof Address>

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare cpf: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
