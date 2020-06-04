import Knex from 'knex'

export async function up (knex: Knex): Promise<unknown> {
  return knex.schema.createTable('point_items', table => {
    table.integer('point_id').primary()
      .references('id').inTable('points')
    table.integer('item_id').primary()
      .references('id').inTable('items')
  })
}

export async function down (knex: Knex): Promise<unknown> {
  return knex.schema.dropTable('point_items')
}
