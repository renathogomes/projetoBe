/*
|--------------------------------------------------------------------------
| Routes file with apidoc 
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
 * @api {post} /login Login do usuário
 * @apiName LoginUser
 * @apiGroup Autenticação
 * @apiVersion 1.0.0
 *
 * @apiBody {String} email Email do usuário.
 * @apiBody {String} password Senha do usuário.
 *
 * @apiSuccess {Object} user Informações do usuário.
 * @apiSuccess {Number} user.id ID do usuário.
 * @apiSuccess {String} user.username Nome de usuário.
 * @apiSuccess {String} user.email Email do usuário.
 * @apiSuccess {String} user.createdAt Data de criação do usuário.
 * @apiSuccess {String} user.updatedAt Data de atualização do usuário.
 * @apiSuccess {String} token Token JWT de autenticação.
 *
 * @apiSuccessExample {json} Sucesso 200 OK:
 *    HTTP/1.1 200 OK
 *    {
 *      "user": {
 *        "id": 1,
 *        "username": "userzin",
 *        "email": "user1@test.com",
 *        "createdAt": "2024-07-10T17:45:19.000+00:00",
 *        "updatedAt": "2024-07-10T17:45:19.000+00:00"
 *      },
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzIwNjM3MTQwLCJleHAiOjE3MjA3MjU0MH0.OX-i--Zq5zQpFZ6xnbdTQD3FD6kOUnIlA9ohBNCyAWg"
 *    }
 *
 * @apiError {String} message Mensagem de erro.
 *
 * @apiErrorExample {json} Erro 401:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "message": "Credenciais inválidas"
 *    }
 */
router.post('/login', [LoginController, 'login']).use(middleware.loginValidation())

/**
 * @api {post} /register Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiBody {String} username Username of the User.
 * @apiBody {String} email Email of the User.
 * @apiBody {String} password Password of the User.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data User data.
 * @apiSuccess {String} data.username Username of the User.
 * @apiSuccess {String} data.email Email of the User.
 * @apiSuccess {String} data.createdAt Creation date of the User.
 * @apiSuccess {String} data.updatedAt Update date of the User.
 * @apiSuccess {Number} data.id ID of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Usuário cadastrado com sucesso!",
 *       "data": {
 *         "username": "userzin",
 *         "email": "user@test.com",
 *         "createdAt": "2024-07-10T19:11:28.349+00:00",
 *         "updatedAt": "2024-07-10T19:11:28.349+00:00",
 *         "id": 2
 *       }
 *     }
 *
 * @apiError UserAlreadyExists The email address is already in use.
 * @apiError InvalidData The provided data is invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "The email address is already in use."
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": "The provided data is invalid."
 *     }
 */
router.post('/register', [LoginController, 'register']).use(middleware.registrationValidation())

router
  .group(() => {
    router
      .group(() => {
        /**
         * @api {get} /user List all users
         * @apiName GetUsers
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiSuccess {Object[]} data List of users.
         * @apiSuccess {Number} data.id ID of the User.
         * @apiSuccess {String} data.username Username of the User.
         * @apiSuccess {String} data.email Email of the User.
         * @apiSuccess {String} data.createdAt Creation date of the User.
         * @apiSuccess {String} data.updatedAt Update date of the User.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "data": [
         *         {
         *           "id": 2,
         *           "username": "userzin",
         *           "email": "user@test.com",
         *           "createdAt": "2024-07-10T19:11:28.000+00:00",
         *           "updatedAt": "2024-07-10T19:11:28.000+00:00"
         *         },
         *         {
         *           "id": 1,
         *           "username": "userzin",
         *           "email": "user1@test.com",
         *           "createdAt": "2024-07-10T17:45:19.000+00:00",
         *           "updatedAt": "2024-07-10T17:45:19.000+00:00"
         *         }
         *       ]
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         */
        router.get('/user', [UsersController, 'index'])

        /**
         * @api {get} /user/:id Get user details
         * @apiName GetUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id User's unique ID.
         *
         * @apiSuccess {Object} user User details.
         * @apiSuccess {Number} user.id ID of the User.
         * @apiSuccess {String} user.username Username of the User.
         * @apiSuccess {String} user.email Email of the User.
         * @apiSuccess {String} user.createdAt Creation date of the User.
         * @apiSuccess {String} user.updatedAt Update date of the User.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "user": {
         *         "id": 1,
         *         "username": "userzin",
         *         "email": "user1@test.com",
         *         "createdAt": "2024-07-10T17:45:19.000+00:00",
         *         "updatedAt": "2024-07-10T17:45:19.000+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The user with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Usuário não encontrado"
         *     }
         */
        router.get('/user/:id', [UsersController, 'show'])

        /**
         * @api {delete} /user/:id Delete a user
         * @apiName DeleteUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id User's unique ID.
         *
         * @apiSuccess {String} message Success message.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Usuário foi deletado com sucesso!"
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The user with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Usuário não encontrado"
         *     }
         */
        router.delete('/user/:id', [UsersController, 'destroy'])

        /**
         * @api {patch} /user/:id Update a user
         * @apiName UpdateUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id User's unique ID.
         *
         * @apiBody {String} [username] Username of the User.
         * @apiBody {String} [email] Email of the User.
         * @apiBody {String} [password] Password of the User.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} user Updated user details.
         * @apiSuccess {Number} user.id ID of the User.
         * @apiSuccess {String} user.username Username of the User.
         * @apiSuccess {String} user.email Email of the User.
         * @apiSuccess {String} user.createdAt Creation date of the User.
         * @apiSuccess {String} user.updatedAt Update date of the User.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Usuário foi atualizado com sucesso!",
         *       "user": {
         *         "id": 1,
         *         "username": "userzaum",
         *         "email": "userzaum@test.com",
         *         "createdAt": "2024-07-10T17:45:19.000+00:00",
         *         "updatedAt": "2024-07-10T19:26:22.000+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The user with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Usuário não encontrado"
         *     }
         */
        router.patch('/user/:id', [UsersController, 'update'])

        /**
         * @api {put} /user/:id Update a user
         * @apiName UpdateUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id User's unique ID.
         *
         * @apiBody {String} [username] Username of the User.
         * @apiBody {String} [email] Email of the User.
         * @apiBody {String} [password] Password of the User.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} user Updated user details.
         * @apiSuccess {Number} user.id ID of the User.
         * @apiSuccess {String} user.username Username of the User.
         * @apiSuccess {String} user.email Email of the User.
         * @apiSuccess {String} user.createdAt Creation date of the User.
         * @apiSuccess {String} user.updatedAt Update date of the User.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Usuário foi atualizado com sucesso!",
         *       "user": {
         *         "id": 1,
         *         "username": "userzaum",
         *         "email": "userzaum@test.com",
         *         "createdAt": "2024-07-10T17:45:19.000+00:00",
         *         "updatedAt": "2024-07-10T19:26:22.000+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The user with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Usuário não encontrado"
         *     }
         */
        router.put('/user/:id', [UsersController, 'update'])
      })
      .use(middleware.userValidation())

    router
      .group(() => {
        /**
         * @api {post} /clients Create a new client
         * @apiName CreateClient
         * @apiGroup Client
         *
         * @apiParam {String} name Name of the client.
         * @apiParam {String} cpf CPF (Brazilian Taxpayer Registry) of the client.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} date Client data.
         * @apiSuccess {String} date.name Name of the client.
         * @apiSuccess {String} date.cpf CPF of the client.
         * @apiSuccess {String} date.createdAt Creation date of the client.
         * @apiSuccess {String} date.updatedAt Update date of the client.
         * @apiSuccess {Number} date.id ID of the client.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 201 Created
         *     {
         *       "message": "Cliente cadastrado com sucesso!",
         *       "date": {
         *         "name": "Renatho",
         *         "cpf": "1243535346",
         *         "createdAt": "2024-07-10T19:30:11.944+00:00",
         *         "updatedAt": "2024-07-10T19:30:11.944+00:00",
         *         "id": 1
         *       }
         *     }
         *
         * @apiError BadRequest Invalid client data provided.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "Dados inválidos do cliente"
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         */
        router.post('/clients', [ClientsController, 'store'])

        /**
         * @api {get} /clients List all clients
         * @apiName GetClients
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiSuccess {Object[]} client List of clients.
         * @apiSuccess {Number} client.id ID of the client.
         * @apiSuccess {String} client.name Name of the client.
         * @apiSuccess {String} client.cpf CPF of the client.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "client": [
         *         {
         *           "id": 1,
         *           "name": "Renatho",
         *           "cpf": "1243535346"
         *         },
         *         {
         *           "id": 2,
         *           "name": "Isabelle",
         *           "cpf": "1243535346"
         *         },
         *         {
         *           "id": 3,
         *           "name": "Vanessa",
         *           "cpf": "1243545656"
         *         }
         *       ]
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         */
        router.get('/clients', [ClientsController, 'index'])

        /**
         * @api {get} /clients/:id Get client details
         * @apiName GetClient
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id Client's unique ID.
         *
         * @apiSuccess {Object} client Client details.
         * @apiSuccess {Number} client.id ID of the client.
         * @apiSuccess {String} client.name Name of the client.
         * @apiSuccess {String} client.cpf CPF of the client.
         * @apiSuccess {String} client.createdAt Creation date of the client.
         * @apiSuccess {String} client.updatedAt Update date of the client.
         * @apiSuccess {Object[]} client.addresses List of addresses associated with the client.
         * @apiSuccess {Object[]} client.phoneNumbers List of phone numbers associated with the client.
         * @apiSuccess {Object[]} client.sales List of sales associated with the client.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "client": {
         *         "id": 1,
         *         "name": "Renatho",
         *         "cpf": "1243535346",
         *         "createdAt": "2024-07-10T18:02:27.000+00:00",
         *         "updatedAt": "2024-07-10T18:02:27.000+00:00",
         *         "addresses": [],
         *         "phoneNumbers": [],
         *         "sales": []
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.get('/clients/:id', [ClientsController, 'show'])
        // router.get('/clients/:id?month=X&year=XXXX', [ClientsController, 'show'])

        /**
         * @api {patch} /clients/:id Update client details
         * @apiName UpdateClient
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id Client's unique ID.
         *
         * @apiBody {String} [name] Updated name of the client.
         * @apiBody {String} [cpf] Updated CPF (Brazilian Taxpayer Registry) of the client.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} client Updated client details.
         * @apiSuccess {Number} client.id ID of the client.
         * @apiSuccess {String} client.name Name of the client.
         * @apiSuccess {String} client.cpf CPF of the client.
         * @apiSuccess {String} client.createdAt Creation date of the client.
         * @apiSuccess {String} client.updatedAt Update date of the client.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Cliente atualizado com sucesso!",
         *       "client": {
         *         "id": 1,
         *         "name": "Affonso",
         *         "cpf": "1243535346",
         *         "createdAt": "2024-07-10T18:02:27.000+00:00",
         *         "updatedAt": "2024-07-10T19:41:48.993+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.patch('/clients/:id', [ClientsController, 'update'])

        /**
         * @api {put} /clients/:id Update client details
         * @apiName UpdateClient
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id Client's unique ID.
         *
         * @apiBody {String} name Updated name of the client.
         * @apiBody {String} cpf Updated CPF (Brazilian Taxpayer Registry) of the client.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} client Updated client details.
         * @apiSuccess {Number} client.id ID of the client.
         * @apiSuccess {String} client.name Name of the client.
         * @apiSuccess {String} client.cpf CPF of the client.
         * @apiSuccess {String} client.createdAt Creation date of the client.
         * @apiSuccess {String} client.updatedAt Update date of the client.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Cliente atualizado com sucesso!",
         *       "client": {
         *         "id": 1,
         *         "name": "Affonso",
         *         "cpf": "1243535346",
         *         "createdAt": "2024-07-10T18:02:27.000+00:00",
         *         "updatedAt": "2024-07-10T19:41:48.993+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.put('/clients/:id', [ClientsController, 'update'])

        /**
         * @api {delete} /clients/:id Delete a client
         * @apiName DeleteClient
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} id Client's unique ID.
         *
         * @apiSuccess {String} message Success message.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Cliente excluído com sucesso!"
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.delete('/clients/:id', [ClientsController, 'destroy'])

        /**
         * @api {post} /clients/:clientId/phoneNumbers Create a phone number for a client
         * @apiName CreateClientPhoneNumber
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} clientId ID of the client.
         *
         * @apiParam {String} phonenumber Phone number to be associated with the client.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} phoneNumber Created phone number data.
         * @apiSuccess {Number} phoneNumber.clientId ID of the client.
         * @apiSuccess {String} phoneNumber.createdAt Creation date of the phone number.
         * @apiSuccess {String} phoneNumber.updatedAt Update date of the phone number.
         * @apiSuccess {Number} phoneNumber.id ID of the phone number.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 201 Created
         *     {
         *       "message": "Telefone cadastrado com sucesso!",
         *       "phoneNumber": {
         *         "clientId": 1,
         *         "createdAt": "2024-07-08T12:55:33.797+00:00",
         *         "updatedAt": "2024-07-08T12:55:33.797+00:00",
         *         "id": 1
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.post('/clients/:clientId/phoneNumbers', [PhoneNumbersController, 'store'])

        /**
         * @api {patch} /clients/:clientId/phoneNumbers/:phoneNumberId Update a phone number for a client
         * @apiName UpdateClientPhoneNumber
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} clientId ID of the client.
         * @apiParam {Number} phoneNumberId ID of the phone number to update.
         *
         * @apiParam {String} phoneNumber Updated phone number to be associated with the client.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} phoneNumber Updated phone number data.
         * @apiSuccess {Number} phoneNumber.id ID of the phone number.
         * @apiSuccess {String} phoneNumber.phoneNumber Updated phone number.
         * @apiSuccess {Number} phoneNumber.clientId ID of the client associated with the phone number.
         * @apiSuccess {String} phoneNumber.createdAt Creation date of the phone number.
         * @apiSuccess {String} phoneNumber.updatedAt Update date of the phone number.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Telefone atualizado com sucesso!",
         *       "phoneNumber": {
         *         "id": 1,
         *         "phoneNumber": "797997763",
         *         "clientId": 1,
         *         "createdAt": "2024-07-08T12:55:33.000+00:00",
         *         "updatedAt": "2024-07-08T13:30:15.271+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client or phone number with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.patch('/clients/:clientId/phoneNumbers/:phoneNumberId', [
          PhoneNumbersController,
          'update',
        ])

        /**
         * @api {put} /clients/:clientId/phoneNumbers/:phoneNumberId Update a phone number for a client
         * @apiName UpdateClientPhoneNumber
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} clientId ID of the client.
         * @apiParam {Number} phoneNumberId ID of the phone number to update.
         *
         * @apiParam {String} phoneNumber Updated phone number to be associated with the client.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} phoneNumber Updated phone number data.
         * @apiSuccess {Number} phoneNumber.id ID of the phone number.
         * @apiSuccess {String} phoneNumber.phoneNumber Updated phone number.
         * @apiSuccess {Number} phoneNumber.clientId ID of the client associated with the phone number.
         * @apiSuccess {String} phoneNumber.createdAt Creation date of the phone number.
         * @apiSuccess {String} phoneNumber.updatedAt Update date of the phone number.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Telefone atualizado com sucesso!",
         *       "phoneNumber": {
         *         "id": 1,
         *         "phoneNumber": "797997763",
         *         "clientId": 1,
         *         "createdAt": "2024-07-08T12:55:33.000+00:00",
         *         "updatedAt": "2024-07-08T13:30:15.271+00:00"
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client or phone number with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.put('/clients/:clientId/phoneNumbers/:phoneNumberId', [
          PhoneNumbersController,
          'update',
        ])

        /**
         * @api {post} /clients/:clientId/addresses Create an address for a client
         * @apiName CreateClientAddress
         * @apiGroup Client
         *
         * @apiHeader {String} Authorization Bearer token.
         * @apiParam {Number} clientId ID of the client.
         *
         * @apiParam {String} street Street name of the address.
         * @apiParam {String} number Number of the address.
         * @apiParam {String} [complement] Complement of the address (optional).
         * @apiParam {String} neighborhood Neighborhood of the address.
         * @apiParam {String} city City of the address.
         * @apiParam {String} state State of the address.
         * @apiParam {String} postal_code Postal code of the address.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} address Created address data.
         * @apiSuccess {String} address.street Street name of the address.
         * @apiSuccess {String} address.number Number of the address.
         * @apiSuccess {String} [address.complement] Complement of the address.
         * @apiSuccess {String} address.neighborhood Neighborhood of the address.
         * @apiSuccess {String} address.city City of the address.
         * @apiSuccess {String} address.state State of the address.
         * @apiSuccess {String} address.postalCode Postal code of the address.
         * @apiSuccess {Number} address.clientId ID of the client associated with the address.
         * @apiSuccess {String} address.createdAt Creation date of the address.
         * @apiSuccess {String} address.updatedAt Update date of the address.
         * @apiSuccess {Number} address.id ID of the address.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 201 Created
         *     {
         *       "message": "Endereço cadastrado com sucesso!",
         *       "address": {
         *         "street": "rua A",
         *         "number": "3",
         *         "complement": "primeiro andar",
         *         "neighborhood": "petropolis",
         *         "city": "Maceió",
         *         "state": "Alagoas",
         *         "postalCode": "5793993",
         *         "clientId": 1,
         *         "createdAt": "2024-07-08T20:48:29.691+00:00",
         *         "updatedAt": "2024-07-08T20:48:29.691+00:00",
         *         "id": 3
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The client with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         */
        router.post('/clients/:clientId/addresses', [AddressesController, 'store'])
      })
      .use(middleware.clientValidation())

    router
      .group(() => {
        /**
         * @api {get} /products List all products
         * @apiName GetProducts
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiSuccess {Object[]} product List of products.
         * @apiSuccess {Number} product.id Product ID.
         * @apiSuccess {String} product.name Product name.
         * @apiSuccess {String} product.description Product description.
         * @apiSuccess {Number} product.price Product price.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "product": [
         *         {
         *           "id": 1,
         *           "name": "aaa",
         *           "description": "um relogio caro",
         *           "price": 2500
         *         },
         *         {
         *           "id": 2,
         *           "name": "Smartwatch",
         *           "description": "um relogio caro",
         *           "price": 2500
         *         }
         *       ]
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         */
        router.get('/products', [ProductsController, 'index'])

        /**
         * @api {get} /products/:id Get product details
         * @apiName GetProductDetails
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {Number} id Product ID.
         *
         * @apiSuccess {Object} product Product details.
         * @apiSuccess {Number} product.id Product ID.
         * @apiSuccess {String} product.name Product name.
         * @apiSuccess {String} product.description Product description.
         * @apiSuccess {Number} product.price Product price.
         * @apiSuccess {String} product.createdAt Creation date of the product.
         * @apiSuccess {String} product.updatedAt Update date of the product.
         * @apiSuccess {Number} product.isDeleted Flag indicating if the product is deleted (0 - false, 1 - true).
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "product": {
         *         "id": 2,
         *         "name": "Smartwatch",
         *         "description": "um relogio caro",
         *         "price": 2500,
         *         "createdAt": "2024-07-10T19:55:25.000+00:00",
         *         "updatedAt": "2024-07-10T19:55:25.000+00:00",
         *         "isDeleted": 0
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The product with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Produto não encontrado"
         *     }
         */
        router.get('/products/:id', [ProductsController, 'show'])

        /**
         * @api {delete} /products/:id Delete a product
         * @apiName DeleteProduct
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {Number} id Product ID.
         *
         * @apiSuccess {String} message Success message.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Produto foi deletado com sucesso!"
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The product with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Produto não encontrado"
         *     }
         */
        router.delete('/products/:id', [ProductsController, 'destroy'])

        /**
         * @api {post} /products Create a new product
         * @apiName CreateProduct
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {String} name Name of the product.
         * @apiParam {String} description Description of the product.
         * @apiParam {Number} price Price of the product.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} data Created product data.
         * @apiSuccess {String} data.name Name of the product.
         * @apiSuccess {String} data.description Description of the product.
         * @apiSuccess {Number} data.price Price of the product.
         * @apiSuccess {String} data.createdAt Creation date of the product.
         * @apiSuccess {String} data.updatedAt Update date of the product.
         * @apiSuccess {Number} data.id ID of the product.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 201 Created
         *     {
         *       "message": "Produto criado com sucesso!",
         *       "data": {
         *         "name": "Notebook",
         *         "description": "Dell i9",
         *         "price": 11000,
         *         "createdAt": "2024-07-10T19:59:52.568+00:00",
         *         "updatedAt": "2024-07-10T19:59:52.568+00:00",
         *         "id": 3
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError BadRequest The request parameters are invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "Parâmetros inválidos"
         *     }
         */
        router.post('/products', [ProductsController, 'store'])

        /**
         * @api {patch} /products/:id Update a product
         * @apiName UpdateProduct
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {Number} id Product ID.
         * @apiParam {String} [name] Updated name of the product.
         * @apiParam {String} [description] Updated description of the product.
         * @apiParam {Number} [price] Updated price of the product.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} product Updated product data.
         * @apiSuccess {Number} product.id Product ID.
         * @apiSuccess {String} product.name Updated name of the product.
         * @apiSuccess {String} product.description Updated description of the product.
         * @apiSuccess {Number} product.price Updated price of the product.
         * @apiSuccess {String} product.createdAt Creation date of the product.
         * @apiSuccess {String} product.updatedAt Update date of the product.
         * @apiSuccess {Number} product.isDeleted Flag indicating if the product is deleted (0 - false, 1 - true).
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Produto foi atualizado com sucesso!",
         *       "product": {
         *         "id": 3,
         *         "name": "tv",
         *         "description": "4k full",
         *         "price": 5000,
         *         "createdAt": "2024-07-10T19:59:52.000+00:00",
         *         "updatedAt": "2024-07-10T20:05:00.790+00:00",
         *         "isDeleted": 0
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The product with the specified ID was not found.
         * @apiError BadRequest The request parameters are invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Produto não encontrado"
         *     }
         */
        router.patch('/products/:id', [ProductsController, 'update'])

        /**
         * @api {post} /products/:id/restore Restore a product
         * @apiName RestoreProduct
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {Number} id Product ID.
         *
         * @apiSuccess {String} message Success message.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Produto foi restaurado com sucesso!"
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The product with the specified ID was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Produto não encontrado"
         *     }
         */
        router.post('/products/:id/restore', [ProductsController, 'restore'])

        /**
         * @api {put} /products/:id Update a product
         * @apiName UpdateProduct
         * @apiGroup Product
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {Number} id Product ID.
         * @apiParam {String} name Updated name of the product.
         * @apiParam {String} description Updated description of the product.
         * @apiParam {Number} price Updated price of the product.
         *
         * @apiSuccess {String} message Success message.
         * @apiSuccess {Object} product Updated product data.
         * @apiSuccess {Number} product.id Product ID.
         * @apiSuccess {String} product.name Updated name of the product.
         * @apiSuccess {String} product.description Updated description of the product.
         * @apiSuccess {Number} product.price Updated price of the product.
         * @apiSuccess {String} product.createdAt Creation date of the product.
         * @apiSuccess {String} product.updatedAt Update date of the product.
         * @apiSuccess {Number} product.isDeleted Flag indicating if the product is deleted (0 - false, 1 - true).
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "message": "Produto foi atualizado com sucesso!",
         *       "product": {
         *         "id": 1,
         *         "name": "tv",
         *         "description": "8k ultra full",
         *         "price": 8000,
         *         "createdAt": "2024-07-10T19:54:44.000+00:00",
         *         "updatedAt": "2024-07-10T20:08:46.643+00:00",
         *         "isDeleted": 0
         *       }
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound The product with the specified ID was not found.
         * @apiError BadRequest The request parameters are invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Produto não encontrado"
         *     }
         */
        router.put('/products/:id', [ProductsController, 'update'])
      })
      .use(middleware.productValidation())

    router
      .group(() => {
        /**
         * @api {get} /sales Retrieve all sales
         * @apiName GetSales
         * @apiGroup Sale
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiSuccess {Object[]} sales List of sales.
         * @apiSuccess {Number} sales.id Sale ID.
         * @apiSuccess {Number} sales.clientId ID of the client making the purchase.
         * @apiSuccess {Number} sales.productId ID of the product being purchased.
         * @apiSuccess {Number} sales.quantity Quantity of the product being purchased.
         * @apiSuccess {Number} sales.unitPrice Unit price of the product at the time of sale.
         * @apiSuccess {Number} sales.totalPrice Total price of the sale (quantity * unit price).
         * @apiSuccess {String} sales.createdAt Creation date of the sale.
         * @apiSuccess {String} sales.updatedAt Update date of the sale.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     [
         *       {
         *         "id": 1,
         *         "clientId": 2,
         *         "productId": 1,
         *         "quantity": 3,
         *         "unitPrice": 8000,
         *         "totalPrice": 24000,
         *         "createdAt": "2024-07-10T20:11:26.000+00:00",
         *         "updatedAt": "2024-07-10T20:11:26.000+00:00"
         *       }
         *     ]
         *
         * @apiError Unauthorized The token is either missing or invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         */
        router.get('/sales', [SalesController, 'index'])

        /**
         * @api {post} /sales Create a new sale
         * @apiName CreateSale
         * @apiGroup Sale
         *
         * @apiHeader {String} Authorization Bearer token.
         *
         * @apiParam {Number} clientId ID of the client making the purchase.
         * @apiParam {Number} productId ID of the product being purchased.
         * @apiParam {Number} quantity Quantity of the product being purchased.
         *
         * @apiSuccess {Object} sale Sale information.
         * @apiSuccess {Number} sale.clientId ID of the client making the purchase.
         * @apiSuccess {Number} sale.productId ID of the product being purchased.
         * @apiSuccess {Number} sale.quantity Quantity of the product being purchased.
         * @apiSuccess {Number} sale.unitPrice Unit price of the product at the time of sale.
         * @apiSuccess {Number} sale.totalPrice Total price of the sale (quantity * unit price).
         * @apiSuccess {String} sale.createdAt Creation date of the sale.
         * @apiSuccess {String} sale.updatedAt Update date of the sale.
         * @apiSuccess {Number} sale.id Sale ID.
         * @apiSuccess {String} clientName Name of the client making the purchase.
         * @apiSuccess {String} productName Name of the product being purchased.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "sale": {
         *         "clientId": 2,
         *         "productId": 1,
         *         "quantity": 3,
         *         "unitPrice": 8000,
         *         "totalPrice": 24000,
         *         "createdAt": "2024-07-10T20:11:26.844+00:00",
         *         "updatedAt": "2024-07-10T20:11:26.844+00:00",
         *         "id": 1
         *       },
         *       "clientName": "Renatho",
         *       "productName": "tv"
         *     }
         *
         * @apiError Unauthorized The token is either missing or invalid.
         * @apiError NotFound Either the client or the product with the specified ID was not found.
         * @apiError BadRequest The request parameters are invalid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "message": "Não autorizado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Cliente não encontrado"
         *     }
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "Produto não encontrado"
         *     }
         */
        router.post('/sales', [SalesController, 'store'])
      })
      .use(middleware.salesValidation())
  })
  .use(middleware.auth())
