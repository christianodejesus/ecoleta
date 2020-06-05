import Router from '@koa/router'
import httpStatus from 'http-status'
import send from 'koa-send'
import path from 'path'

const staticRouter = new Router({
  prefix: '/static'
})

const staticBasePath = path.resolve(__dirname, '..', '..', '..', 'static')

staticRouter.get('/images/(.*)', async ctx => {
  try {
    const result = await send(ctx, ctx.params['0'],
      { root: path.resolve(staticBasePath, 'images') }
    )

    return result
  } catch (err) {
    ctx.status = httpStatus.NOT_FOUND
  }
})

export default staticRouter
