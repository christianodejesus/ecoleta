import httpStatus from 'http-status'
import { ParameterizedContext } from 'koa'
import knex from '../../database/connection'
import StringUtils from '../../utils/StringUtils'

interface IPoint {
  id: number
  name: string
  email: string
  image: string
  whatsapp: string
  lat: string
  long: string
  city: string
  state: string
}

class PointsController {
  public async index (ctx: ParameterizedContext): Promise<void> {
    const {
      name, city, state, items, order
    } = ctx.query

    const parsedItems = String(items).split(',')
      .map(itemId => Number(itemId))
      .filter(itemId => !Number.isNaN(itemId))

    const parsedOrder = String(order).split(',')
      .map(orderDef => {
        const [column, order] = orderDef.split(':')
        return { column, order }
      })
      .filter(orderItem => orderItem.order !== undefined)

    const pointsQuery = knex('points')
      .innerJoin('point_items', 'points.id', '=', 'point_items.point_id')

    if (parsedOrder.length > 0) {
      pointsQuery.orderBy(parsedOrder)
    }

    if (parsedItems.length > 0) {
      pointsQuery.whereIn('point_items.item_id', parsedItems)
    }

    if (name) {
      pointsQuery.whereRaw(`points.name LIKE '%${String(name)}%'`)
    }

    if (city) {
      pointsQuery.where('points.city', city)
    }

    if (state) {
      pointsQuery.where('points.state', state)
    }

    const points = await pointsQuery.distinct()
      .select([
        'points.id',
        'points.name',
        'points.email',
        knex.raw(`'${StringUtils.baseStaticImgUrl(ctx)}' || points.image AS image`),
        'points.whatsapp',
        'points.lat',
        'points.long',
        'points.city',
        'points.state'
      ])

    ctx.body = points
  }

  public async show (ctx: ParameterizedContext): Promise<void> {
    const { id } = ctx.params

    const point: IPoint = await knex('points')
      .select('*').where({ id }).first()

    if (!point) {
      ctx.status = httpStatus.NOT_FOUND
      ctx.body = { message: 'Point not found' }
    } else {
      point.image = `${StringUtils.baseStaticImgUrl(ctx)}${point.image}`

      const pointItems = await knex('items')
        .select([
          'items.id',
          'items.title',
          knex.raw(`'${StringUtils.baseStaticImgUrl(ctx)}' || items.image AS image`)
        ])
        .innerJoin('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)

      ctx.body = { ...point, items: pointItems }
    }
  }

  public async create (ctx: ParameterizedContext): Promise<void> {
    const {
      name, email, whatsapp, lat,
      long, city, state, items
    } = ctx.request.body

    const newPoint: IPoint = await knex.transaction(async trx => {
      const pointToSave = {
        name,
        email,
        image: 'undefined-collection-point.jpg',
        whatsapp,
        lat,
        long,
        city,
        state
      }

      const insertedPoint = await trx('points')
        .insert(pointToSave)
        .then((ids: number[]) => ({
          id: ids[0], ...pointToSave
        }))

      const pointItems = items.map((itemId: number) => ({
        point_id: insertedPoint.id,
        item_id: itemId
      }))

      await trx('point_items').insert(pointItems)

      insertedPoint.image = `${StringUtils.baseStaticImgUrl(ctx)}${insertedPoint.image}`

      return insertedPoint
    })

    if (newPoint) {
      ctx.body = newPoint
    } else {
      ctx.status = httpStatus.BAD_REQUEST
      ctx.body = {
        message: 'Cannot create collection point, please verify data sent'
      }
    }
  }

  public async update (ctx: ParameterizedContext): Promise<void> {
    const { id: pointId } = ctx.params

    const exists: IPoint = await knex('points')
      .where('id', Number(pointId))
      .select('*')
      .first()

    if (!exists) {
      ctx.status = httpStatus.NOT_FOUND
      ctx.body = { message: 'Point not found' }
      return
    }

    const updatedPoint: IPoint = await knex.transaction(async trx => {
      const {
        name, email, whatsapp, lat,
        long, city, state, items
      } = ctx.request.body

      const pointToSave = {
        name,
        email,
        image: 'undefined-collection-point.jpg',
        whatsapp,
        lat,
        long,
        city,
        state
      }

      const pointItems = items.map((itemId: number) => ({
        point_id: Number(pointId),
        item_id: itemId
      }))

      await trx('points').where('id', Number(pointId)).update(pointToSave)
      await trx('point_items').where('point_id', Number(pointId)).delete()
      await trx('point_items').insert(pointItems)

      const savedPoint = {
        id: Number(pointId), ...pointToSave
      }
      savedPoint.image = `${StringUtils.baseStaticImgUrl(ctx)}${savedPoint.image}`

      return savedPoint
    })

    if (updatedPoint) {
      ctx.body = updatedPoint
    } else {
      ctx.status = httpStatus.BAD_REQUEST
      ctx.body = {
        message: 'Cannot create collection point, please verify data sent'
      }
    }
  }
}

export default PointsController
