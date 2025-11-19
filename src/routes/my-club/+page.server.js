import { redirect } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { syncAllUserClubs, syncEmailLeaderClubs } from '$lib/server/sync-clubs.js';

export async function load({ locals }) {
	if (!locals.userPublic) {
		throw redirect(302, '/login');
	}

	const knex = getKnex();
	const user = await knex('users').where({ id: locals.userId }).first();

	let clubs;

	if (user.provider === 'email') {
		clubs = await syncEmailLeaderClubs(knex, user.email);
	} else {
		clubs = await syncAllUserClubs(knex, locals.userId);
	}

	return {
		user: locals.userPublic,
		clubs
	};
}
