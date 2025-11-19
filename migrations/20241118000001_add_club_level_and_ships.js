export async function up(knex) {
	await knex.schema.alterTable('clubs', (t) => {
		t.text('level');
		t.jsonb('ships').defaultTo('[]');
		t.timestamp('airtable_synced_at', { useTz: true });
	});
}

export async function down(knex) {
	await knex.schema.alterTable('clubs', (t) => {
		t.dropColumn('level');
		t.dropColumn('ships');
		t.dropColumn('airtable_synced_at');
	});
}
