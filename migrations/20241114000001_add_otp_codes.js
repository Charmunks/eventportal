export async function up(knex) {
	await knex.schema.createTable('otp_codes', (t) => {
		t.uuid('id').primary();
		t.text('email').notNullable();
		t.string('code', 6).notNullable();
		t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
		t.timestamp('expires_at', { useTz: true }).notNullable();
		t.boolean('used').notNullable().defaultTo(false);
		t.index(['email']);
		t.index(['expires_at']);
	});
}

export async function down(knex) {
	await knex.schema.dropTableIfExists('otp_codes');
}
