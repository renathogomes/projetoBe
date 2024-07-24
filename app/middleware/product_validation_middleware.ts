import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class ProductValidationMiddleware {
  private storeSchema = z.object({
    name: z
      .string()
      .min(1, 'The product name is required.')
      .refine((value) => value.trim().length > 0, 'The name cannot be just whitespace.'),
    description: z.string().min(1, 'The product description is required.'),
    price: z.number().positive('The price must be a positive number.'),
  })

  private updateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive('The price must be a positive number.').optional(),
  })

  private showSchema = z.object({
    id: z.string().regex(/^\d+$/, 'The ID must be a valid number.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response, params } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
      } else if (method === 'PUT' || method === 'PATCH') {
        this.updateSchema.parse(request.body())
      } else if (method === 'GET' || method === 'DELETE') {
        if (url.includes('/products/') && params.id) {
          this.showSchema.parse(params)

          const product = await Product.find(params.id)
          if (!product) {
            return response.status(404).json({
              message: ['Product not found.'],
            })
          }
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }

      return response.status(400).json({
        message: ['Error validating the data.'],
      })
    }

    const output = await next()
    return output
  }
}
