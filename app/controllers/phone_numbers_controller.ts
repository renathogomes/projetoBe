import Client from '#models/client'
import PhoneNumber from '#models/phone_number'
import type { HttpContext } from '@adonisjs/core/http'

export default class PhoneNumbersController {
  async store({ request, response, params }: HttpContext) {
    const clientId = params.clientId
    const body = request.body()

    const client = await Client.findOrFail(clientId)

    const phoneNumber = await PhoneNumber.create({
      phoneNumber: body.phoneNumber,
      clientId: client.id,
    })

    response.status(201)

    return {
      message: 'Telefone cadastrado com sucesso!',
      phoneNumber,
    }
  }

  async update({ request, response, params }: HttpContext) {
    const phoneNumberId = params.phoneNumberId
    const body = request.body()

    const phoneNumber = await PhoneNumber.findOrFail(phoneNumberId)

    phoneNumber.phoneNumber = body.phoneNumber

    await phoneNumber.save()

    response.status(200)

    return {
      message: 'Telefone atualizado com sucesso!',
      phoneNumber,
    }
  }
}
