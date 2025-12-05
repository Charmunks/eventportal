import { getClubLevel, getClubShips, getClubMembers, getClubsForLeaderEmail } from './clubapi.js';

export async function getClubDataFromApi(clubName) {
	console.log('[SyncClubs] getClubDataFromApi called for:', clubName);

	const [level, ships] = await Promise.all([
		getClubLevel(clubName),
		getClubShips(clubName)
	]);
	console.log('[SyncClubs] API returned level:', level, 'ships count:', ships?.length);

	return {
		name: clubName,
		level,
		ships
	};
}

export async function getClubsForEmail(email) {
	console.log('[SyncClubs] getClubsForEmail called for email:', email);
	const apiClubs = await getClubsForLeaderEmail(email);
	console.log('[SyncClubs] API returned', apiClubs.length, 'clubs for email');

	const clubsWithShips = await Promise.all(
		apiClubs.map(async (club) => {
			console.log('[SyncClubs] Fetching ships and members for:', club.name);
			const [ships, members] = await Promise.all([
				getClubShips(club.name),
				getClubMembers(club.name)
			]);
			console.log('[SyncClubs] Got', ships?.length, 'ships and members:', members);

			return {
				...club,
				ships,
				members
			};
		})
	);

	console.log('[SyncClubs] getClubsForEmail returning:', JSON.stringify(clubsWithShips, null, 2));
	return clubsWithShips;
}
