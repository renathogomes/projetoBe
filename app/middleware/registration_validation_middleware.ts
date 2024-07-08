import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RegistrationValidationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { username, email, password } = ctx.request.body()

    if (!username || !email || !password) {
      return ctx.response.status(400).json({
        message: 'Por favor, verifique se todos os campos estão preenchidos corretamente.',
      })
    }

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      return ctx.response.status(400).json({
        message: 'Email já cadastrado!',
      })
    }

    const output = await next()
    return output
  }
}
