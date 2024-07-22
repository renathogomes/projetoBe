import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class RegistrationValidationMiddleware {
  private schema = z.object({
    username: z
      .string()
      .min(1, 'The username is required.')
      .refine((value) => value.trim().length > 0, 'The username cannot be just whitespace.'),
    email: z.string().email(),
    password: z.string(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { username, email, password } = ctx.request.body()

    try {
      this.schema.parse({ username, email, password })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ctx.response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }
      return ctx.response.status(400).json({
        message: 'Error validating registration data.',
      })
    }

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      return ctx.response.status(400).json({
        message: ['Email already registered!'],
      })
    }

    const output = await next()
    return output
  }
}
