import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('street')
      table.string('number')
      table.string('complement')
      table.string('neighborhood')
      table.string('city')
      table.string('state')
      table.string('postal_code')
      table.integer('client_id').unsigned().references('clients.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
