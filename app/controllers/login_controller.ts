import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export default class LoginController {
  async register({ request, response }: HttpContext) {
    try {
      const { username, email, password } = request.body()

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      })

      response.status(201)

      return {
        message: 'Usuário cadastrado com sucesso!',
        data: user,
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Ocorreu um erro ao cadastrar o usuário.',
      })
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.body()

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({
        message: 'E-mail ou senha inválidos.',
      })
    }

    const verifyPassword = await bcrypt.compare(password, user.password)

    if (!verifyPassword) {
      return response.status(404).json({
        message: 'E-mail ou senha inválidos.',
      })
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? '', {
      expiresIn: '1d',
    })
    return response.status(200).json({
      user,
      token,
    })
  }
}
