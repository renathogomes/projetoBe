import Client from '#models/client'
import Product from '#models/product'
import Sale from '#models/sale'
import type { HttpContext } from '@adonisjs/core/http'

export default class SalesController {
  /**
   * Display a list of resource
   */
  async index() {
    const sale = await Sale.all()
    return sale
  }

  /**
   * Handle form submission for the create action
   */

  async store({ request, response }: HttpContext) {
    const { clientId, productId, quantity } = request.body()

    const client = await Client.findOrFail(clientId)
    const product = await Product.findOrFail(productId)
    const unitPrice = product.price

    const totalPrice = quantity * unitPrice

    const clientName = client.name
    const productName = product.name

    const sale = await Sale.create({
      clientId,
      productId,
      quantity,
      unitPrice,
      totalPrice,
    })

    response.status(201)

    return {
      sale,
      clientName,
      productName,
    }
  }
}
