import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class UserValidationMiddleware {
  private updateSchema = z.object({
    username: z.string().min(1, 'The username is required.').trim().optional(),
    email: z.string().email('The email must be invalid.').trim().optional(),
    password: z.string().min(1, 'The password is required.').trim().optional(),
  })

  private showSchema = z.object({
    id: z.string().regex(/^\d+$/, 'The ID must be a valid number.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response, params } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'PUT' || method === 'PATCH') {
        this.updateSchema.parse(request.body())
      } else if (method === 'GET' || method === 'DELETE') {
        if (url.includes('/user/') && params.id) {
          this.showSchema.parse(params)

          const user = await User.find(params.id)
          if (!user) {
            return response.status(404).json({
              message: ['User not found.'],
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
