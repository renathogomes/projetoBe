# Projeto de API com AdonisJS

## Introdução

Este projeto é uma API construída com AdonisJS para gerenciar clientes, produtos, vendas e usuários. Ele inclui funcionalidades de autenticação e registro de usuários, CRUD para clientes, produtos e vendas, e gerenciamento de números de telefone e endereços dos clientes.

## Instalação

Para instalar e rodar o projeto, siga os passos abaixo:

1. Clone o repositório:
    ```bash
    git clone git@github.com:renathogomes/projetoBe.git
    ```

2. Navegue até o diretório do projeto:
    ```bash
    cd projetoBe
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Copie o arquivo de configuração `.env.example` para `.env`:
    ```bash
    cp .env.example .env
    ```

5. Configure o arquivo `.env` com suas credenciais de banco de dados e outras configurações necessárias.

6. Rode as migrações para criar as tabelas no banco de dados:
    ```bash
    node ace migration:run
    ```

7. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
8. A documentação detalhada pode ser vista através desse link
   ```
   http://127.0.0.1:5500/docs/index.html

   ```

## Configuração

Certifique-se de configurar as variáveis de ambiente no arquivo `.env` para conectar-se ao banco de dados e outras configurações do AdonisJS.

## Modelos

### User

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

### Client

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import PhoneNumber from './phone_number.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Address from './address.js'
import Sale from './sale.js'

export default class Client extends BaseModel {
  @hasMany(() => PhoneNumber)
  declare phoneNumbers: HasMany<typeof PhoneNumber>

  @hasMany(() => Address)
  declare addresses: HasMany<typeof Address>

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare cpf: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

### PhoneNumber

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PhoneNumber extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare phoneNumber: string

  @column()
  declare clientId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

### Address

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare street: string

  @column()
  declare number: string

  @column()
  declare complement: string

  @column()
  declare neighborhood: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare postal_code: string

  @column({ columnName: 'client_id' })
  declare clientId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

### Sale

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @column()
  declare unitPrice: number

  @column()
  declare totalPrice: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

## Controladores

### LoginController

```typescript
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
        message: 'User registered successfully!',
        data: user,
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'An error occurred while registering the user.',
      })
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.body()

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({
        message: 'Invalid credentials.',
      })
    }

    const verifyPassword = await bcrypt.compare(password, user.password)

    if (!verifyPassword) {
      return response.status(404).json({
        message: 'Invalid credentials.',
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

```

### UsersController

```typescript
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
      message: 'User updated successfully!',
      user,
    }
  }

  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return {
      message: 'User deleted successfully!',
    }
  }
}


```
### ClientsController

```typescript
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
      message: 'Client registered successfully!',
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
      message: 'Client updated successfully!',
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
      message: 'Client deleted successfully!',
    }
  }
}


```
### PhoneNumbersController

```typescript
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
      message: 'Phone number registered successfully!',
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
      message: 'Phone number updated successfully!',
      phoneNumber,
    }
  }
}

```

### AddressesController

```typescript
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

```
### ProductsController

```typescript
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index() {
    const product = await Product.query()
      .select('id', 'name', 'description', 'price')
      .where('is_deleted', false)
      .orderBy('name', 'asc')

    return {
      product,
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const body = request.body()

    const product = await Product.create(body)

    response.status(201)

    return {
      message: 'Product created successfully!',
      date: product,
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return {
      product,
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const body = request.body()
    const product = await Product.findOrFail(params.id)

    product.name = body.name
    product.description = body.description
    product.price = body.price

    await product.save()

    return {
      message: 'Product updated successfully!',
      product,
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    product.isDeleted = true
    await product.save()

    response.status(200)

    return {
      message: 'Product deleted successfully!',
    }
  }

  async restore({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    product.isDeleted = false
    await product.save()

    response.status(200)

    return {
      message: 'Product restored successfully!',
    }
  }
}


```

### SalesController

```typescript

import Client from '#models/client'
import Product from '#models/product'
import Sale from '#models/sale'
import type { HttpContext } from '@adonisjs/core/http'

export default class SalesController {
  /**
   * Display a list of resource
   */
  async index() {
    const sale = await Sale.all()
    return sale
  }

  /**
   * Handle form submission for the create action
   */

  async store({ request, response }: HttpContext) {
    const { clientId, productId, quantity } = request.body()

    const client = await Client.findOrFail(clientId)
    const product = await Product.findOrFail(productId)
    const unitPrice = product.price

    const totalPrice = quantity * unitPrice

    const clientName = client.name
    const productName = product.name

    const sale = await Sale.create({
      clientId,
      productId,
      quantity,
      unitPrice,
      totalPrice,
    })

    response.status(201)

    return {
      sale,
      clientName,
      productName,
    }
  }
}

```
## Middleware

### AuthMiddleware

```typescript
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

    try {
      if (!authorization) {
        return ctx.response.status(401).json({
          message: 'Unauthorized.',
        })
      }
      const token = authorization.split(' ')[1]

      const { id } = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload

      const user = await User.find(id)

      if (!user) {
        return ctx.response.status(404).json({
          message: 'User not found',
        })
      }

      const output = await next()
      return output
    } catch (error) {
      return ctx.response.status(401).json({
        message: 'Unauthorized.',
      })
    }
  }
}


```
### RegistrationValidationMiddleware

```typescript
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class RegistrationValidationMiddleware {
  private schema = z.object({
    username: z
      .string()
      .min(1, 'The username is required.')
      .refine((value) => value.trim().length > 0, 'The username cannot be just whitespace.'),
    email: z.string().email(),
    password: z.string(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { username, email, password } = ctx.request.body()

    try {
      this.schema.parse({ username, email, password })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ctx.response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }
      return ctx.response.status(400).json({
        message: 'Error validating registration data.',
      })
    }

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      return ctx.response.status(400).json({
        message: ['Email already registered!'],
      })
    }

    const output = await next()
    return output
  }
}


```
### UserValidationMiddleware

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class UserValidationMiddleware {
  private updateSchema = z.object({
    username: z.string().min(1, 'The username is required.').trim().optional(),
    email: z.string().email('The email must be invalid.').trim().optional(),
    password: z.string().min(1, 'The password is required.').trim().optional(),
  })

  private showSchema = z.object({
    id: z.string().regex(/^\d+$/, 'The ID must be a valid number.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response, params } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'PUT' || method === 'PATCH') {
        this.updateSchema.parse(request.body())
      } else if (method === 'GET' || method === 'DELETE') {
        if (url.includes('/user/') && params.id) {
          this.showSchema.parse(params)
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }

      return response.status(400).json({
        message: ['Error validating the data.'],
      })
    }

    const output = await next()
    return output
  }
}

```
### SalesValidationMiddleware

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'
import Client from '#models/client'
import Product from '#models/product'

export default class SalesValidationMiddleware {
  private storeSchema = z.object({
    clientId: z.number(),
    productId: z.number(),
    quantity: z
      .number()
      .int('The quantity must be a positive integer.')
      .positive('The quantity must be a positive integer.'),
  })

  private idSchema = z.object({
    id: z.string().regex(/^\d+$/, 'The ID must be a valid number.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response, params } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'POST') {
        const { clientId, productId } = this.storeSchema.parse(request.body())

        const client = await Client.find(clientId)

        if (!client) {
          return response.status(404).json({ message: ['Client not found.'] })
        }
        const product = await Product.find(productId)
        if (!product) {
          return response.status(404).json({ message: ['Product not found.'] })
        }
      } else if (method === 'GET' || method === 'DELETE') {
        if (url.includes('/sales/') && params.id) {
          this.idSchema.parse(params)
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ message: error.errors.map((e) => e.message) })
      }
    }

    const output = await next()
    return output
  }
}

```

### ProductValidationMiddleware

```typescript

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class ProductValidationMiddleware {
  private storeSchema = z.object({
    name: z
      .string()
      .min(1, 'The product name is required.')
      .refine((value) => value.trim().length > 0, 'The name cannot be just whitespace.'),
    description: z.string().min(1, 'The product description is required.'),
    price: z.number().positive('The price must be a positive number.'),
  })

  private updateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive('The price must be a positive number.').optional(),
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
      } else if (method === 'PUT' || method === 'PATCH') {
        this.updateSchema.parse(request.body())
      } else if (method === 'GET' || method === 'DELETE') {
        if (url.includes('/products/') && params.id) {
          this.showSchema.parse(params)
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }

      return response.status(400).json({
        message: ['Error validating the data.'],
      })
    }

    const output = await next()
    return output
  }
}

```
### PhoneNumberValidationMiddleware

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class PhoneNumberValidateMiddleware {
  private storeSchema = z.object({
    phonenumber: z.string().min(10).max(15),
  })

  private updateSchema = z.object({
    phonenumber: z.string().min(10).max(15).optional(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
      } else if (method === 'PUT' || method === 'PATCH') {
        this.updateSchema.parse(request.body())
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }
      return response.status(400).json({
        message: ['Error validating the data.'],
      })
    }

    const output = await next()
    return output
  }
}

```

### LoginValidation

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class LoginValidationMiddleware {
  private loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()
    const url = request.url()

    try {
      if (method === 'POST' && url.includes('/login')) {
        this.loginSchema.parse(request.body())
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

```

### ClientValidationMiddleware

```typescript

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

```

### AdressValidationMiddleware

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { z } from 'zod'

export default class AdressValidationMiddleware {
  private storeSchema = z.object({
    street: z
      .string()
      .min(1, 'Street is required.')
      .refine((value) => value.trim().length > 0, 'The street cannot be just whitespace.'),
    number: z
      .string()
      .min(1, 'Number is required.')
      .refine((value) => value.trim().length > 0, 'The number cannot be just whitespace.'),
    neighborhood: z
      .string()
      .refine((value) => value.trim().length > 0, 'The neighborhood cannot be just whitespace.'),
    city: z
      .string()
      .min(1, 'City is required.')
      .refine((value) => value.trim().length > 0, 'The city cannot be just whitespace.'),
    state: z
      .string()
      .min(1, 'State is required.')
      .refine((value) => value.trim().length > 0, 'The state cannot be just whitespace.'),
    postal_code: z
      .string()
      .min(1, 'Postal code is required.')
      .refine((value) => value.trim().length > 0, 'The postal code cannot be just whitespace.'),
  })

  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const method = request.method()

    try {
      if (method === 'POST') {
        this.storeSchema.parse(request.body())
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: error.errors.map((err) => `${err.message} ${err.path}`),
        })
      }
      return response.status(400).json({
        message: ['Error validating the data.'],
      })
    }

    const output = await next()
    return output
  }
}

```


## Projeto de Gestão de Vendas

### Descrição

Este projeto é uma aplicação backend desenvolvida com AdonisJS, que gerencia clientes, produtos, vendas, e dados de contato. Utiliza um banco de dados MySQL para armazenar informações e inclui funcionalidades de autenticação de usuários.

### Tecnologias Utilizadas

- Node.js - Ambiente de execução JavaScript no servidor.
  
- AdonisJS - Framework Node.js MVC.
  
- MySQL - Banco de dados relacional.
  
- Docker - Containerização do banco de dados.
  
### Configuração do Ambiente

#### Instalação do MySQL com Docker

Para rodar o MySQL em um container Docker, utilize o seguinte comando:

```typescript
docker container run --name container-mysql -e MYSQL_ROOT_PASSWORD=senha-mysql -d -p 3306:3306 mysql:8.0.31
```

## Instalação das Dependências

Clone o repositório e instale as dependências:

```typescript
git clone git@github.com:renathogomes/projetoBe.git>
cd projetoBe
npm install
```

## Estrutura do Projeto

### Modelos

- User
  
- Sale
  
- Product
  
- PhoneNumber
  
- Client
  
- Address
  
### Controladores

- UsersController- Gerencia usuários.
  
- SalesController - Gerencia vendas.
  
- ProductsController - Gerencia produtos.
  
- PhoneNumbersController - Gerencia números de telefone.
  
- ClientsController - Gerencia clientes.
  
- LoginController - Gerencia autenticação de usuários.
  
## Rotas

### Público

#### POST /login
 - Realiza login.

Exmplo:

Envio

```
{
	"email": "user@test.com",
	"password": "123123"
}

```
Resposta

```
{
	"user": {
		"id": 7,
		"username": "userzin",
		"email": "user@test.com",
		"createdAt": "2024-07-08T14:34:42.000+00:00",
		"updatedAt": "2024-07-08T14:34:42.000+00:00"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzIwNDU5OTc3LCJleHAiOjE3MjA1NDYzNzd9.a1B48Xd8qeHgP4rBtAiXsH-jSXrTHSiuJn_s3166DCg"
}

```
  
#### POST /register
  - Registra um novo usuário.

Exemplo:

Envio

```
{
	"username": "userzin",
	"email": "user1@test.com",
	"password": "123123"
}

```

Resposta

```
{
	"message": "Usuário cadastrado com sucesso!",
	"data": {
		"username": "userzin",
		"email": "user1@test.com",
		"createdAt": "2024-07-08T17:39:22.523+00:00",
		"updatedAt": "2024-07-08T17:39:22.523+00:00",
		"id": 8
	}
}

```
  
### Protegido por Autenticação

#### GET /user
- Lista todos os usuários.

#### GET /user/:id
- Exibe um usuário específico.

#### PATCH /user/:id
- Atualiza um usuário específico.

#### DELETE /user/:id
- Deleta um usuário específico.

#### POST /clients
- Cria um novo cliente.

#### GET /clients
- Lista todos os clientes.

#### GET /clients/:id
- Exibe um cliente específico.

#### PATCH /clients/:id
- Atualiza um cliente específico.

#### DELETE /clients/:id
- Deleta um cliente específico.

#### POST /clients/:clientId/phoneNumbers
 - Adiciona um número de telefone ao cliente.

#### PATCH /clients/:clientId/phoneNumbers/:id
 - Atualiza um número de telefone do cliente.

#### POST /clients/:clientId/addresses
 - Adiciona um endereço ao cliente.

#### GET /products
- Lista todos os produtos.

#### GET /products/:id
- Exibe um produto específico.

#### POST /products
- Cria um novo produto.

#### PATCH /products/:id
- Atualiza um produto específico.

#### POST /products/:projectId/restore
 - Restaura um produto deletado.

#### DELETE /products/:id
- Deleta um produto específico.

#### GET /sales
- Lista todas as vendas.

#### POST /sales
- Cria uma nova venda.

## Exemplo de Uso

### Registro de Usuário

```typescript
curl -X POST http://localhost:3333/register \
-H "Content-Type: application/json" \
-d '{"username": "john", "email": "john@example.com", "password": "password123"}'
```

### Login

```typescript
curl -X POST http://localhost:3333/login \
-H "Content-Type: application/json" \
-d '{"email": "john@example.com", "password": "password123"}'
```

### Criação de Cliente

```typescript
curl -X POST http://localhost:3333/clients \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{"name": "John Doe", "cpf": "123.456.789-00"}'
```

### Contribuição

Sinta-se à vontade para enviar pull requests. Qualquer ajuda é bem-vinda!

### Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.









  
