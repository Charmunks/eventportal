import { getClubLevel, getClubShips, getClubsForLeaderEmail } from './clubapi.js';

export async function syncClubDataFromApi(knex, clubName) {
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

	const [level, ships] = await Promise.all([
		getClubLevel(clubName),
		getClubShips(clubName)
	]);

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
			const syncedData = await syncClubDataFromApi(knex, club.name);
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
	const apiClubs = await getClubsForLeaderEmail(email);

	const syncedClubs = await Promise.all(
		apiClubs.map(async (club) => {
			let dbClub = await knex('clubs')
				.where({ name: club.name })
				.first();

			if (!dbClub) {
				const [insertedClub] = await knex('clubs')
					.insert({
						id: knex.raw('gen_random_uuid()'),
						provider_club_id: typeof club.id === 'string' ? club.id.hashCode?.() || Math.floor(Math.random() * 1000000) : club.id,
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

			const ships = await getClubShips(club.name);

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
