import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('client_id').unsigned().references('clients.id')
      table.integer('product_id').unsigned().references('products.id')
      table.unique(['client_id', 'product_id'])

      table.integer('quantity')
      table.integer('unit_price')
      table.integer('total_price')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
