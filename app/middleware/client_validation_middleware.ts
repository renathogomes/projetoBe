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
    month: z
      .string()
      .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month.')
      .optional(),
    year: z
      .string()
      .regex(/^\d{4}$/, 'Invalid year.')
      .optional(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
      } else if (method === 'PUT') {
        this.updateSchema.parse(request.body())
      } else if (method === 'GET' && request.url().includes('/clients/')) {
        this.showSchema.parse(request.qs())
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => err.message),
          local: error.errors.map((err) => err.path.join('.')),
        })
      }
    }

    const output = await next()
    return output
  }
}
