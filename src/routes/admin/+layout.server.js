import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.userPublic || !locals.userPublic.isAdmin) {
		throw redirect(302, '/');
	}
	return {
		user: locals.userPublic
	};
}
