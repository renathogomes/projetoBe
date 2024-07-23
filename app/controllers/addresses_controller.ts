import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'
import Address from '#models/address'

export default class AddressesController {
  async store({ params, request, response }: HttpContext) {
    const clientId = params.clientId
    const body = request.body()

    const client = await Client.findOrFail(clientId)

    const address = await Address.create({
      ...body,
      clientId: client.id,
    })

    response.status(201)

    return {
      message: 'Address registered successfully!',
      address,
    }
  }
}
