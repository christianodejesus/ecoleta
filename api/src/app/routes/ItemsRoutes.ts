import Router from '@koa/router'
import ItemsController from '../controllers/ItemsController'

const itemsController = new ItemsController()

const itemsRouter = new Router({
  prefix: '/items'
})

itemsRouter.get('/', itemsController.index)

export default itemsRouter
