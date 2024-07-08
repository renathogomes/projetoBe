import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index() {
    const product = await Product.query()
      .select('id', 'name', 'description', 'price')
      .where('is_deleted', false)
      .orderBy('name', 'asc')

    return {
      product,
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const body = request.body()

    const product = await Product.create(body)

    response.status(201)

    return {
      message: 'Produto criado com sucesso!',
      date: product,
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return {
      product,
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const body = request.body()
    const product = await Product.findOrFail(params.id)

    product.name = body.name
    product.description = body.description
    product.price = body.price

    await product.save()

    return {
      message: 'Produto foi atualizado com sucesso!',
      product,
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    product.isDeleted = true
    await product.save()

    response.status(200)

    return {
      message: 'Produto foi deletado com sucesso!',
    }
  }

  async restore({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    product.isDeleted = false
    await product.save()

    response.status(200)

    return {
      message: 'Produto foi restaurado com sucesso!',
    }
  }
}
