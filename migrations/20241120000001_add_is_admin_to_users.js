export async function up(knex) {
	await knex.schema.alterTable('users', (t) => {
		t.boolean('is_admin').notNullable().defaultTo(false);
	});
}

export async function down(knex) {
	await knex.schema.alterTable('users', (t) => {
		t.dropColumn('is_admin');
	});
}
