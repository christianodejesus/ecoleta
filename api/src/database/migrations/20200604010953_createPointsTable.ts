import Knex from 'knex'

export async function up (knex: Knex): Promise<unknown> {
  return knex.schema.createTable('points', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('name').notNullable()
    table.string('email').notNullable().unique()
    table.string('whatsapp').notNullable()
    table.decimal('lat').notNullable()
    table.decimal('lng').notNullable()
    table.string('city').notNullable()
    table.string('uf').notNullable()
  })
}

export async function down (knex: Knex): Promise<unknown> {
  return knex.schema.dropTable('points')
}
