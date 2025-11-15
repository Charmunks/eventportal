import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Airtable from 'airtable';
import { getKnex } from '$lib/server/db/knex.js';
import { getUserClubs } from '$lib/server/auth/clubs.js';
import { getClubsForLeader } from '$lib/server/airtable.js';

export async function load({ locals }) {
	if (!locals.userPublic) {
		throw redirect(302, '/login');
	}

	const knex = getKnex();
	const user = await knex('users').where({ id: locals.userId }).first();

	const base = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);

	let clubs;

	if (user.provider === 'email') {
		const airtableClubs = await getClubsForLeader(user.email);

		clubs = await Promise.all(
			airtableClubs.map(async (club) => {
				let ships = [];

				try {
					const shipRecords = await base('Club Ships')
						.select({
							filterByFormula: `{club_name (from Clubs)} = '${club.name.replace(/'/g, "\\'")}'`
						})
						.all();

					ships = shipRecords.map((record) => ({
						name: record.get('YSWS–Name (from Unified YSWS Database)') || 'Unnamed Ship',
						codeUrl: record.get('code_url') || null,
						memberName: record.get('member_name') || null
					}));
				} catch (error) {
					console.error(`Error fetching ships for club ${club.name}:`, error);
				}

				return { ...club, ships };
			})
		);
	} else {
		const dbClubs = await getUserClubs(knex, locals.userId);

		clubs = await Promise.all(
			dbClubs.map(async (club) => {
				let level = null;
				let ships = [];

				try {
					const clubRecords = await base('Clubs')
						.select({
							filterByFormula: `{club_name} = '${club.name.replace(/'/g, "\\'")}'`,
							maxRecords: 1
						})
						.firstPage();

					if (clubRecords.length > 0) {
						level = clubRecords[0].get('level') || null;
					}
				} catch (error) {
					console.error(`Error fetching level for club ${club.name}:`, error);
				}

				try {
					const shipRecords = await base('Club Ships')
						.select({
							filterByFormula: `{club_name (from Clubs)} = '${club.name.replace(/'/g, "\\'")}'`
						})
						.all();

					ships = shipRecords.map((record) => ({
						name: record.get('YSWS–Name (from Unified YSWS Database)') || 'Unnamed Ship',
						codeUrl: record.get('code_url') || null,
						memberName: record.get('member_name') || null
					}));
				} catch (error) {
					console.error(`Error fetching ships for club ${club.name}:`, error);
				}

				return { ...club, level, ships };
			})
		);
	}

	return {
		user: locals.userPublic,
		clubs
	};
}
