import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class LoginValidationMiddleware {
  private loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'POST' && url.includes('/login')) {
        this.loginSchema.parse(request.body())
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }
    }

    const output = await next()
    return output
  }
}
