import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'
import Client from '#models/client'
import Product from '#models/product'

export default class SalesValidationMiddleware {
  private storeSchema = z.object({
    clientId: z.number(),
    productId: z.number(),
    quantity: z
      .number()
      .int('The quantity must be a positive integer.')
      .positive('The quantity must be a positive integer.'),
  })

  private idSchema = z.object({
    id: z.string().regex(/^\d+$/, 'The ID must be a valid number.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response, params } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'POST') {
        const { clientId, productId } = this.storeSchema.parse(request.body())

        const client = await Client.find(clientId)

        if (!client) {
          return response.status(404).json({ message: ['Client not found.'] })
        }
        const product = await Product.find(productId)
        if (!product) {
          return response.status(404).json({ message: ['Product not found.'] })
        }
      } else if (method === 'GET' || method === 'DELETE') {
        if (url.includes('/sales/') && params.id) {
          this.idSchema.parse(params)
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ message: error.errors.map((e) => e.message) })
      }
    }

    const output = await next()
    return output
  }
}
