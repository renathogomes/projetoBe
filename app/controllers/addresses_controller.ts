import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'
import Address from '#models/address'

import { z } from 'zod'

const addressSchema = z.object({
  street: z.string().min(1, { message: 'Street is required' }),
  number: z.string().min(1, { message: 'Number is required' }),
  neighborhood: z.string().optional(),
  city: z.string().min(1, { message: 'Neighborhood is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postal_code: z.string().min(1, { message: 'Postal code is required' }),
})

export default class AddressesController {
  async store({ params, request, response }: HttpContext) {
    const clientId = params.clientId
    const body = request.body()

    const validatedData = addressSchema.safeParse(body)

    const client = await Client.findOrFail(clientId)

    if (validatedData.success) {
      const address = await Address.create({
        ...validatedData.data,
        clientId: client.id,
      })

      response.status(201)

      return {
        message: 'Endereço cadastrado com sucesso!',
        address,
      }
    }
    if (validatedData.error) {
      response.status(400)

      return {
        message: 'Endereço não cadastrado!',
        error: validatedData.error.errors,
      }
    }
  }
}
