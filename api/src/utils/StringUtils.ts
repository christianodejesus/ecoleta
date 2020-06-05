import { ParameterizedContext } from 'koa'

const baseStaticImgUrl = (ctx: ParameterizedContext): string => {
  return `${ctx.protocol}://${ctx.host}/api/static/images/`
}

export default {
  baseStaticImgUrl
}
