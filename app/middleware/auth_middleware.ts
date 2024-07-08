import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'

type JwtPayload = {
  id: number
}

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { authorization } = ctx.request.headers()

    if (!authorization) {
      return ctx.response.status(401).json({
        message: 'Não autorizado',
      })
    }

    const token = authorization.split(' ')[1]

    const { id } = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload

    const user = await User.find(id)

    if (!user) {
      return ctx.response.status(404).json({
        message: 'Usuário não encontrado',
      })
    }

    const output = await next()
    return output
  }
}