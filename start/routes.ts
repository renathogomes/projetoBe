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

router.post('/login', [LoginController, 'login'])
router.post('/register', [LoginController, 'register'])

router
  .group(() => {
    router.get('/user', [UsersController, 'index'])
    router.get('/user/:id', [UsersController, 'show'])
    router.delete('/user/:id', [UsersController, 'destroy'])
    router.patch('/user/:id', [UsersController, 'update'])
    router.put('/user/:id', [UsersController, 'update'])
    router.post('/clients', [ClientsController, 'store'])
    router.get('/clients', [ClientsController, 'index'])
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
    router.get('/products', [ProductsController, 'index'])
    router.get('/products/:id', [ProductsController, 'show'])
    router.delete('/products/:id', [ProductsController, 'destroy'])
    router.post('/products', [ProductsController, 'store'])
    router.patch('/products/:id', [ProductsController, 'update'])
    router.post('/products/:id/restore', [ProductsController, 'restore'])
    router.put('/products/:id', [ProductsController, 'update'])
    router.get('/sales', [SalesController, 'index']).use(middleware.auth())
    router.post('/sales', [SalesController, 'store']).use(middleware.auth())
  })
  .use(middleware.auth())
