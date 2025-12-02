import { redirect } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { syncAllUserClubs, syncEmailLeaderClubs } from '$lib/server/sync-clubs.js';

export async function load({ locals }) {
	console.log('[MyClub] load called, userPublic:', !!locals.userPublic, 'userId:', locals.userId);
	if (!locals.userPublic) {
		console.log('[MyClub] No userPublic, redirecting to login');
		throw redirect(302, '/login');
	}

	const knex = getKnex();
	const user = await knex('users').where({ id: locals.userId }).first();
	console.log('[MyClub] User from DB:', user ? { id: user.id, email: user.email, provider: user.provider } : null);

	let clubs;

	if (user.provider === 'email') {
		console.log('[MyClub] Using email provider flow for:', user.email);
		clubs = await syncEmailLeaderClubs(knex, user.email);
	} else {
		console.log('[MyClub] Using OAuth provider flow for userId:', locals.userId);
		clubs = await syncAllUserClubs(knex, locals.userId);
	}

	console.log('[MyClub] Returning', clubs?.length, 'clubs');
	return {
		user: locals.userPublic,
		clubs
	};
}
