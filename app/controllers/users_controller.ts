import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index() {
    const users = await User.all()
    return {
      data: users,
    }
  }

  async show({ params }: HttpContext) {
    const { id } = params

    const user = await User.find(id)

    return { user }
  }

  async update({ request, params }: HttpContext) {
    const body = request.body()
    const user = await User.findOrFail(params.id)

    user.username = body.username
    user.email = body.email
    user.password = body.password

    await user.save()

    return {
      message: 'Usuário foi atualizado com sucesso!',
      user,
    }
  }

  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return {
      message: 'Usuário foi deletado com sucesso!',
    }
  }
}
