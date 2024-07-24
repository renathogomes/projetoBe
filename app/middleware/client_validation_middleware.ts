import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class ClientValidationMiddleware {
  private storeSchema = z.object({
    name: z
      .string()
      .min(1, 'O nome é obrigatório.')
      .refine((value) => value.trim().length > 0, 'The name cannot be just whitespace.'),
    cpf: z
      .string()
      .length(11, 'The CPF must have 11 digits')
      .refine((value) => value.trim().length > 0, 'The CPF cannot be just whitespace.'),
  })

  private updateSchema = z.object({
    name: z.string().optional(),
    cpf: z.string().length(11, 'The CPF must have 11 digits').optional(),
  })

  private showSchema = z.object({
    id: z.string().regex(/^\d+$/, 'The ID must be a valid number.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response, params } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
      } else if (method === 'PUT') {
        this.updateSchema.parse(request.body())
      } else if (method === 'GET') {
        if (url.includes('/clients/') && params.id) {
          this.showSchema.parse(params)

          const client = await Client.find(params.id)
          if (!client) {
            return response.status(404).json({ message: ['Client not found.'] })
          }
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }
    }

    const output = await next()
    return output
  }
}
