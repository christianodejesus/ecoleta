import { ParameterizedContext } from 'koa'
import knex from '../../database/connection'
import StringUtils from '../../utils/StringUtils'

class ItemsController {
  public async index (ctx: ParameterizedContext): Promise<ParameterizedContext> {
    const items = await knex('items')
      .select([
        'items.id',
        'items.title',
        knex.raw(`'${StringUtils.baseStaticImgUrl(ctx)}' || items.image AS image`)
      ])

    ctx.body = items

    return ctx
  }
}

export default ItemsController
