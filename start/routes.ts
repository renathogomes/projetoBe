/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')
const SalesController = () => import('#controllers/sales_controller')
const UsersController = () => import('#controllers/users_controller')
const LoginController = () => import('#controllers/login_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AddressesController = () => import('#controllers/addresses_controller')
const PhoneNumbersController = () => import('#controllers/phone_numbers_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/**
 * @api {post} /login User Login
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 *
 * @apiSuccess {Object} user User information.
 * @apiSuccess {String} token JWT token.
 *
 * @apiError UserNotFound The user with the provided email was not found.
 * @apiError InvalidPassword The provided password is incorrect.
 */

router.post('/login', [LoginController, 'login'])

/**
 * @api {post} /clients Registra um Cliente
 * @apiName RegisterClient
 * @apiGroup Clientes
 *
 * @apiBody {String} name Nome do cliente
 * @apiBody {String} cpf CPF do cliente
 *
 * @apiSuccess {String} message Mensagem de sucesso
 * @apiSuccessExample {json} Sucesso
 * HTTP/1.1 200 OK
 * {
 *   "message": "Cliente cadastrado com sucesso!",
 *   "data": {
 *     "name": "Renatho",
 *     "cpf": "1243535346",
 *     "createdAt": "2024-07-08T19:00:53.570+00:00",
 *     "updatedAt": "2024-07-08T19:00:53.570+00:00",
 *     "id": 2
 *   }
 * }
 *
 * @apiError ClienteNaoEncontrado O cliente não foi encontrado.
 */
router.post('/register', [LoginController, 'register']).use(middleware.registrationValidation())

router
  .group(() => {
    /**
     * @api{get} /user Lista os clientes
     * @apiName ListUser
     * @apiGroup Users
     *
     * @apiSuccessExemple {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * {
     *   "date": [
     *   {
     *    "id": "2",
     *    "username": "isaiza@gmail.com",
     *    "createdAt": "2024-07-08T19:00:53.570+00:00",
     *    "updatedAt": "2024-07-08T19:00:53.570+00:00",
     *   }, {
     *    "id": "1",
     *    "username": "exemplo@exemplo.com",
     *    "createdAt": "2024-07-08T19:00:53.570+00:00",
     *    "updatedAt": "2024-07-08T19:00:53.570+00:00",
     *   }
     * ]
     * }
     * }
     *
     */
    router.get('/user', [UsersController, 'index'])
    /**
     *
     */
    router.get('/user/:id', [UsersController, 'show'])
    router.delete('/user/:id', [UsersController, 'destroy'])
    router.patch('/user/:id', [UsersController, 'update'])
    router.put('/user/:id', [UsersController, 'update'])

    /**
     * @api{post} /clients Registra um Cliente
     * @apiName RegisterClient
     * @apiGroup Clientes
     * @apiBody {String} name Nome do cliente
     * @apiBody {String} cpf CPF do cliente
     *
     * @apiSuccess {String} message Mensagem de sucesso
     * @apiSuccessExemple {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * {
     *  "message": "Cliente cadastrado com sucesso!",
     *   "date": {
     *   "name": "Renatho",
     *   "cpf": "1243535346",
     *  "createdAt": "2024-07-08T19:00:53.570+00:00",
     * "updatedAt": "2024-07-08T19:00:53.570+00:00",
     * "id": 2
     * }
     *}
     * }
     *
     */
    router.post('/clients', [ClientsController, 'store'])

    /**
     * @api {get} /clients Busca os clientes
     * @apiName ListClients
     * @apiGroup Clientes
     *
     *
     * @apiSuccess {String} message Mensagem de sucesso
     * @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     *   "client": [
     *     {
     *      "id": 1
     *      "name": "Renatho",
     *      "cpf": "0628364683",
     *     },
     *     {
     *      "id": 2
     *      "name": "Affonso",
     *      "cpf": "0356345333",
     *     }
     * }
     */

    router.get('/clients', [ClientsController, 'index'])
    /**
     * @api {get} /products/:id listar clientes
     * @apiName GetClient
     * @apiGroup Clients
     *
     * @apiParam {String} id identificador do cliente
     *
     * @apiSuccess {Number} id ID do produto.
     * @apiSuccess {String} name Nome do produto.
     * @apiSuccess {String} description Descrição do produto.
     * @apiSuccess {Number} price Preço do produto.
     * @apiSuccess {String} created_at Data de criação do produto.
     * @apiSuccess {String} updated_at Data de atualização do produto.
     * @apiSuccess {Number} isDeleted Número para soft delete.
     *
     * @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * product: {
     * "id": 1,
     * "name": "Notebook",
     * "description": "Notebook Acer i7 16GB RAM 1TB SSD",
     * "price": 5000,
     * "created_at": "2024-07-08T19:00:53.570+00:00",
     * "updated_at": "2024-07-08T19:00:53.570+00:00",
     * "isDeleted": 0
     * }
     */
    router.get('/clients/:id', [ClientsController, 'show'])
    router.patch('/clients/:id', [ClientsController, 'update'])
    router.put('/clients/:id', [ClientsController, 'update'])
    router.delete('/clients/:id', [ClientsController, 'destroy'])
    router.post('/clients/:clientId/phoneNumbers', [PhoneNumbersController, 'store'])
    router.patch('/clients/:clientId/phoneNumbers/:phoneNumberId', [
      PhoneNumbersController,
      'update',
    ])
    router.put('/clients/:clientId/phoneNumbers/:phoneNumberId', [PhoneNumbersController, 'update'])
    router.post('/clients/:clientId/addresses', [AddressesController, 'store'])
    /**
     * @api {get} /products Listar produtos
     * @apiName GetProducts
     * @apiGroup Products
     *
     * @apiSuccess {Number} id ID do produto.
     * @apiSuccess {String} name Nome do produto.
     * @apiSuccess {String} description Descrição do produto.
     * @apiSuccess {Number} price Preço do produto.
     *
     * @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * product: [
     * {
     * "id": 1,
     * "name": "Notebook",
     * "description": "Notebook Acer i7 16GB RAM 1TB SSD",
     * "price": 5000
     * },
     * {
     * "id": 2,
     * "name": "Smartphone",
     * "description": "Smartphone Samsung 8GB RAM 128GB",
     * "price": 2000
     * }
     */
    router.get('/products', [ProductsController, 'index'])
    /**
     * @api {get} /products Listar produtos
     * @apiName GetProducts
     * @apiGroup Products
     *
     * @apiSuccess {Number} id ID do produto.
     * @apiSuccess {String} name Nome do produto.
     * @apiSuccess {String} description Descrição do produto.
     * @apiSuccess {Number} price Preço do produto.
     *
     * @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * product: [
     * {
     * "id": 1,
     * "name": "Notebook",
     * "description": "Notebook Acer i7 16GB RAM 1TB SSD",
     * "price": 5000
     * },
     * {
     * "id": 2,
     * "name": "Smartphone",
     * "description": "Smartphone Samsung 8GB RAM 128GB",
     * "price": 2000
     * }
     */
    router.get('/products/:id', [ProductsController, 'show'])
    /**
     * @api {get} /products/:id Listar produto
     * @apiName GetProduct
     * @apiGroup Products
     *
     * @apiParam {String} id identificador do produto
     *
     * @apiSuccess {Number} id ID do produto.
     * @apiSuccess {String} name Nome do produto.
     * @apiSuccess {String} description Descrição do produto.
     * @apiSuccess {Number} price Preço do produto.
     * @apiSuccess {String} created_at Data de criação do produto.
     * @apiSuccess {String} updated_at Data de atualização do produto.
     * @apiSuccess {Number} isDeleted Número para soft delete.
     *
     * @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * product: {
     * "id": 1,
     * "name": "Notebook",
     * "description": "Notebook Acer i7 16GB RAM 1TB SSD",
     * "price": 5000,
     * "created_at": "2024-07-08T19:00:53.570+00:00",
     * "updated_at": "2024-07-08T19:00:53.570+00:00",
     * "isDeleted": 0
     * }
     */
    router.delete('/products/:id', [ProductsController, 'destroy'])
    /**
     * @api {post} /products/:id Criar produto
     * @apiName PostProduct
     * @apiGroup Products
     *
     * @apiParam {String} id identificador do produto
     *
     * @apiBody {String}   name Nome do produto
     * @apiBody {String}   description  Descrição do produto
     * @apiBody {Number}   price Preço do produto
     *
     * @apiSuccess {String} name Nome do produto.
     * @apiSuccess {String} description Descrição do produto.
     * @apiSuccess {Number} price Preço do produto.
     * @apiSuccess {String} created_at Data de criação do produto.
     * @apiSuccess {String} updated_at Data de atualização do produto.
     * @apiSuccess {Number} isDeleted Número para soft delete.
     * @apiSuccess {String} message Mensagem informando que o produto foi deletado.
     * @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * message: {'Produto criado com sucesso!
     * product: {
     * "name": "Nodebook",
     * "description": "Notebook Acer i7 16GB RAM 1TB SSD",
     * "price": 5000,
     * "created_at": "2024-07-08T19:00:53.570+00:00",
     * "updated_at": "2024-07-08T19:00:53.570+00:00",
     * "isDeleted": 0
     * }
     * }
     * }
     *
     */
    router.post('/products/:id', [ProductsController, 'store'])
    /**
     * 
     * 
    @apiSuccessExample {json} Sucesso
     * HTTP/1.1 200 OK
     * {
     * message: {'Produto criado com sucesso!
     * product: {
     * "name": "Nodebook",
     * "description": "Notebook Acer i7 16GB RAM 1TB SSD",
     * "price": 5000,
     * "created_at": "2024-07-08T19:00:53.570+00:00",
     * "updated_at": "2024-07-08T19:00:53.570+00:00",
     * "isDeleted": 0
     * }
     * }
     * }
     **/
    router.post('/products', [ProductsController, 'store'])
    router.patch('/products/:id', [ProductsController, 'update'])
    router.post('/products/:id/restore', [ProductsController, 'restore'])
    /**
     * @api {put} /products/:id Atualizar produto
     * @apiName PutProduct
     * @apiGroup Products
     *
     * @apiParam {String} id identificador do produto
     *
     * @apiBody {String} name Nome do produto
     * @apiBody {String} description  Descrição do produto"
     * @apiBody {Number} price Preço do projuto
     *
     */
    router.put('/products/:id', [ProductsController, 'update'])
    router.get('/sales', [SalesController, 'index'])
    router.post('/sales', [SalesController, 'store'])
  })
  .use(middleware.auth())
