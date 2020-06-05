import Router from '@koa/router'
import PointsController from '../controllers/PointsController'

const pointsController = new PointsController()

const pointsRouter = new Router({
  prefix: '/points'
})

pointsRouter.get('/', pointsController.index)
pointsRouter.get('/:id', pointsController.show)
pointsRouter.post('/', pointsController.create)
pointsRouter.put('/:id', pointsController.update)

export default pointsRouter
