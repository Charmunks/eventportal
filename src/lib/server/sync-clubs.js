import { getClubLevel, getClubShips, getClubsForLeaderEmail } from './clubapi.js';

export async function syncClubDataFromApi(knex, clubName) {
	console.log('[SyncClubs] syncClubDataFromApi called for:', clubName);
	const club = await knex('clubs').where({ name: clubName }).first();
	if (!club) {
		console.error('[SyncClubs] Club not found in DB:', clubName);
		return null;
	}
	console.log('[SyncClubs] Found club in DB:', club.id);

	const CACHE_DURATION_MS = 60 * 60 * 1000;
	const now = new Date();
	
	if (club.airtable_synced_at && (now - new Date(club.airtable_synced_at)) < CACHE_DURATION_MS) {
		console.log('[SyncClubs] Using cached data for:', clubName);
		return {
			...club,
			ships: club.ships || []
		};
	}

	console.log('[SyncClubs] Fetching fresh data from API for:', clubName);
	const [level, ships] = await Promise.all([
		getClubLevel(clubName),
		getClubShips(clubName)
	]);
	console.log('[SyncClubs] API returned level:', level, 'ships count:', ships?.length);

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
	console.log('[SyncClubs] syncAllUserClubs called for userId:', userId);
	const dbClubs = await knex('user_clubs')
		.join('clubs', 'user_clubs.club_id', 'clubs.id')
		.where('user_clubs.user_id', userId)
		.select('clubs.*', 'user_clubs.role', 'user_clubs.joined_at');
	console.log('[SyncClubs] Found', dbClubs.length, 'clubs in DB for user');

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

	console.log('[SyncClubs] syncAllUserClubs returning', syncedClubs.length, 'clubs');
	return syncedClubs;
}

export async function syncEmailLeaderClubs(knex, email) {
	console.log('[SyncClubs] syncEmailLeaderClubs called for email:', email);
	const apiClubs = await getClubsForLeaderEmail(email);
	console.log('[SyncClubs] API returned', apiClubs.length, 'clubs for email');

	const syncedClubs = await Promise.all(
		apiClubs.map(async (club) => {
			console.log('[SyncClubs] Processing club:', club.name);
			let dbClub = await knex('clubs')
				.where({ name: club.name })
				.first();

			if (!dbClub) {
				console.log('[SyncClubs] Club not in DB, inserting:', club.name);
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
				console.log('[SyncClubs] Inserted club with id:', dbClub.id);
			} else {
				console.log('[SyncClubs] Club found in DB:', dbClub.id);
			}

			const CACHE_DURATION_MS = 60 * 60 * 1000;
			const now = new Date();
			
			if (dbClub.airtable_synced_at && (now - new Date(dbClub.airtable_synced_at)) < CACHE_DURATION_MS) {
				console.log('[SyncClubs] Using cached data for:', club.name, 'dbClub.level:', dbClub.level, 'club.level:', club.level);
				return {
					...club,
					level: club.level || dbClub.level,
					ships: dbClub.ships || []
				};
			}

			console.log('[SyncClubs] Fetching ships for:', club.name);
			const ships = await getClubShips(club.name);
			console.log('[SyncClubs] Got', ships?.length, 'ships');

			await knex('clubs')
				.where({ id: dbClub.id })
				.update({
					level: club.level,
					ships: JSON.stringify(ships),
					airtable_synced_at: knex.fn.now(),
					updated_at: knex.fn.now()
				});

			const result = {
				...club,
				level: club.level,
				ships
			};
			console.log('[SyncClubs] Returning club with level:', result.level);
			return result;
		})
	);

	console.log('[SyncClubs] syncEmailLeaderClubs returning:', JSON.stringify(syncedClubs, null, 2));
	return syncedClubs;
}
