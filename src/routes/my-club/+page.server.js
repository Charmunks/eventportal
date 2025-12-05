import { redirect } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { getClubsForEmail } from '$lib/server/sync-clubs.js';

export async function load({ locals }) {
	console.log('[MyClub] load called, userPublic:', !!locals.userPublic, 'userId:', locals.userId);
	if (!locals.userPublic) {
		console.log('[MyClub] No userPublic, redirecting to login');
		throw redirect(302, '/login');
	}

	const knex = getKnex();
	const user = await knex('users').where({ id: locals.userId }).first();
	console.log('[MyClub] User from DB:', user ? { id: user.id, email: user.email, provider: user.provider } : null);

	const clubs = await getClubsForEmail(user.email);

	console.log('[MyClub] Returning', clubs?.length, 'clubs');
	return {
		user: locals.userPublic,
		clubs
	};
}
