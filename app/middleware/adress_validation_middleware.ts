import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class AdressValidationMiddleware {
  private storeSchema = z.object({
    street: z
      .string()
      .min(1, 'Street is required.')
      .refine((value) => value.trim().length > 0, 'The street cannot be just whitespace.'),
    number: z
      .string()
      .min(1, 'Number is required.')
      .refine((value) => value.trim().length > 0, 'The number cannot be just whitespace.'),
    neighborhood: z
      .string()
      .refine((value) => value.trim().length > 0, 'The neighborhood cannot be just whitespace.'),
    city: z
      .string()
      .min(1, 'City is required.')
      .refine((value) => value.trim().length > 0, 'The city cannot be just whitespace.'),
    state: z
      .string()
      .min(1, 'State is required.')
      .refine((value) => value.trim().length > 0, 'The state cannot be just whitespace.'),
    postal_code: z
      .string()
      .min(1, 'Postal code is required.')
      .refine((value) => value.trim().length > 0, 'The postal code cannot be just whitespace.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
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
