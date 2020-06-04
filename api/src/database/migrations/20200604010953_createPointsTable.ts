import Knex from 'knex'

export async function up (knex: Knex): Promise<unknown> {
  return knex.schema.createTable('points', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('whatsapp').notNullable()
    table.decimal('lat').notNullable()
    table.decimal('long').notNullable()
    table.string('city').notNullable()
    table.string('state').notNullable()
  })
}

export async function down (knex: Knex): Promise<unknown> {
  return knex.schema.dropTable('points')
}
