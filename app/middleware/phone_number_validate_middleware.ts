import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class PhoneNumberValidateMiddleware {
  private storeSchema = z.object({
    phonenumber: z.string().min(10).max(15),
  })

  private updateSchema = z.object({
    phonenumber: z.string().min(10).max(15).optional(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
      } else if (method === 'PUT' || method === 'PATCH') {
        this.updateSchema.parse(request.body())
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
