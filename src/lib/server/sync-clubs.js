import { env } from '$env/dynamic/private';
import Airtable from 'airtable';
import { getClubsForLeader } from './airtable.js';

export async function syncClubDataFromAirtable(knex, clubName) {
	const base = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);
	
	const club = await knex('clubs').where({ name: clubName }).first();
	if (!club) {
		console.error(`Club not found: ${clubName}`);
		return null;
	}

	const CACHE_DURATION_MS = 60 * 60 * 1000;
	const now = new Date();
	
	if (club.airtable_synced_at && (now - new Date(club.airtable_synced_at)) < CACHE_DURATION_MS) {
		return {
			...club,
			ships: club.ships || []
		};
	}

	let level = null;
	let ships = [];

	try {
		const clubRecords = await base('Clubs')
			.select({
				filterByFormula: `{club_name} = '${clubName.replace(/'/g, "\\'")}'`,
				maxRecords: 1
			})
			.firstPage();

		if (clubRecords.length > 0) {
			level = clubRecords[0].get('level') || null;
		}
	} catch (error) {
		console.error(`Error fetching level for club ${clubName}:`, error);
	}

	try {
		const shipRecords = await base('Club Ships')
			.select({
				filterByFormula: `{club_name (from Clubs)} = '${clubName.replace(/'/g, "\\'")}'`
			})
			.all();

		ships = shipRecords.map((record) => ({
			name: record.get('YSWS–Name (from Unified YSWS Database)') || 'Unnamed Ship',
			codeUrl: record.get('code_url') || null,
			memberName: record.get('member_name') || null
		}));
	} catch (error) {
		console.error(`Error fetching ships for club ${clubName}:`, error);
	}

	await knex('clubs')
		.where({ id: club.id })
		.update({
			level,
			ships: JSON.stringify(ships),
			airtable_synced_at: knex.fn.now(),
			updated_at: knex.fn.now()
		});

	return {
		...club,
		level,
		ships
	};
}

export async function syncAllUserClubs(knex, userId) {
	const dbClubs = await knex('user_clubs')
		.join('clubs', 'user_clubs.club_id', 'clubs.id')
		.where('user_clubs.user_id', userId)
		.select('clubs.*', 'user_clubs.role', 'user_clubs.joined_at');

	const syncedClubs = await Promise.all(
		dbClubs.map(async (club) => {
			const syncedData = await syncClubDataFromAirtable(knex, club.name);
			return {
				...club,
				level: syncedData?.level || club.level,
				ships: syncedData?.ships || club.ships || []
			};
		})
	);

	return syncedClubs;
}

export async function syncEmailLeaderClubs(knex, email) {
	const base = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);
	const airtableClubs = await getClubsForLeader(email);

	const syncedClubs = await Promise.all(
		airtableClubs.map(async (club) => {
			let dbClub = await knex('clubs')
				.where({ name: club.name })
				.first();

			if (!dbClub) {
				const [insertedClub] = await knex('clubs')
					.insert({
						id: knex.raw('gen_random_uuid()'),
						provider_club_id: club.id.hashCode ? club.id.hashCode() : Math.floor(Math.random() * 1000000),
						name: club.name,
						description: club.description,
						location: club.location,
						level: club.level,
						ships: JSON.stringify([])
					})
					.returning('*');
				dbClub = insertedClub;
			}

			const CACHE_DURATION_MS = 60 * 60 * 1000;
			const now = new Date();
			
			if (dbClub.airtable_synced_at && (now - new Date(dbClub.airtable_synced_at)) < CACHE_DURATION_MS) {
				return {
					...club,
					level: dbClub.level,
					ships: dbClub.ships || []
				};
			}

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

			await knex('clubs')
				.where({ id: dbClub.id })
				.update({
					level: club.level,
					ships: JSON.stringify(ships),
					airtable_synced_at: knex.fn.now(),
					updated_at: knex.fn.now()
				});

			return {
				...club,
				ships
			};
		})
	);

	return syncedClubs;
}
