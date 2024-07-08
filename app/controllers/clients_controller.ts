import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  /**
   * Display a list of resource
   */
  async index() {
    const client = await Client.query().select('id', 'name', 'cpf').orderBy('id', 'asc')

    return {
      client,
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const body = request.body()

    const client = await Client.create(body)

    response.status(201)

    return {
      message: 'Cliente cadastrado com sucesso!',
      date: client,
    }
  }

  /**
   * Show individual record
   */
  async show({ params, request }: HttpContext) {
    const { month, year } = request.qs()

    let clientQuery = Client.query().where('id', params.id)

    if (month && year) {
      clientQuery = clientQuery
        .preload('addresses')
        .preload('phoneNumbers')
        .preload('sales', (query) => {
          query.whereRaw('MONTH(created_at) = ?', [month])
          query.whereRaw('YEAR(created_at) = ?', [year])
          query.orderBy('createdAt', 'desc')
        })
    } else {
      clientQuery = clientQuery
        .preload('addresses')
        .preload('phoneNumbers')
        .preload('sales', (query) => {
          query.orderBy('createdAt', 'desc')
        })
    }

    const client = await clientQuery.firstOrFail()

    return {
      client,
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const body = request.body()
    const client = await Client.findOrFail(params.id)

    client.name = body.name
    client.cpf = body.cpf

    await client.save()

    return {
      message: 'Cliente atualizado com sucesso!',
      client,
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const client = await Client.findOrFail(params.id)

    await client.delete()

    return {
      message: 'Cliente excluído com sucesso!',
    }
  }
}
