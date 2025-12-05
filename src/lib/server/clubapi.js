import { env } from '$env/dynamic/private';

const CLUB_API_BASE = 'https://clubapi.hackclub.com';

async function fetchClubApi(endpoint, params = {}) {
	const url = new URL(endpoint, CLUB_API_BASE);
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			url.searchParams.append(key, value);
		}
	});

	const headers = {};
	if (env.CLUB_API_KEY) {
		headers['Authorization'] = env.CLUB_API_KEY;
	}

	console.log('[ClubAPI] Fetching:', url.toString());
	console.log('[ClubAPI] Has API key:', !!env.CLUB_API_KEY);

	try {
		const response = await fetch(url.toString(), { headers });
		console.log('[ClubAPI] Response status:', response.status, response.statusText);
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('[ClubAPI] Error response body:', errorText);
			throw new Error(`Club API error: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		console.log('[ClubAPI] Response data:', JSON.stringify(data).slice(0, 500));
		return data;
	} catch (error) {
		console.error('[ClubAPI] Fetch error:', error.message);
		throw error;
	}
}

export async function getLeaderByEmail(email) {
	console.log('[ClubAPI] getLeaderByEmail called with:', email);
	try {
		const data = await fetchClubApi('/leader', { email });
		console.log('[ClubAPI] getLeaderByEmail result:', data);
		return data;
	} catch (error) {
		console.error('[ClubAPI] getLeaderByEmail error:', error);
		return null;
	}
}

export async function checkLeaderEmail(email) {
	console.log('[ClubAPI] checkLeaderEmail called with:', email);
	try {
		const data = await fetchClubApi('/leader', { email });
		const isLeader = data.leader === true || !!data.club_name;
		console.log('[ClubAPI] checkLeaderEmail result:', isLeader, 'data:', data);
		return isLeader;
	} catch (error) {
		console.error('[ClubAPI] checkLeaderEmail error:', error);
		return false;
	}
}

export async function getClubByName(clubName) {
	try {
		const data = await fetchClubApi('/club', { name: clubName });
		return data;
	} catch (error) {
		console.error(`Error fetching club ${clubName}:`, error);
		return null;
	}
}

export async function getClubLevel(clubName) {
	try {
		const data = await fetchClubApi('/level', { club_name: clubName });
		return data.fields?.level || data.level || null;
	} catch (error) {
		console.error(`Error fetching level for club ${clubName}:`, error);
		return null;
	}
}

export async function getClubShips(clubName) {
	try {
		const data = await fetchClubApi('/ships', { club_name: clubName });
		console.log('[ClubAPI] getClubShips raw data:', JSON.stringify(data, null, 2));
		if (!Array.isArray(data)) {
			return [];
		}
		return data.map((ship) => {
			const fields = ship.fields || ship;
			console.log('[ClubAPI] Ship fields:', JSON.stringify(fields, null, 2));
			return {
				name: fields['YSWS–Name (from Unified YSWS Database)']?.[0] || fields.name || 'Unnamed Ship',
				codeUrl: fields.code_url || null,
				memberName: fields.member_name || null
			};
		});
	} catch (error) {
		console.error(`Error fetching ships for club ${clubName}:`, error);
		return [];
	}
}

export async function getClubMembers(clubName) {
	try {
		const data = await fetchClubApi('/members', { club_name: clubName });
		console.log('[ClubAPI] getClubMembers raw data:', JSON.stringify(data, null, 2));
		return data.members || null;
	} catch (error) {
		console.error(`Error fetching members for club ${clubName}:`, error);
		return null;
	}
}

export async function getClubsForLeaderEmail(email) {
	console.log('[ClubAPI] getClubsForLeaderEmail called with:', email);
	try {
		const leaderData = await getLeaderByEmail(email);
		console.log('[ClubAPI] getClubsForLeaderEmail leaderData:', leaderData);
		if (!leaderData || !leaderData.club_name) {
			console.log('[ClubAPI] getClubsForLeaderEmail: No leader data or club_name found');
			return [];
		}

		const clubNames = Array.isArray(leaderData.club_name) 
			? leaderData.club_name 
			: [leaderData.club_name];
		console.log('[ClubAPI] getClubsForLeaderEmail clubNames:', clubNames);

		const clubs = await Promise.all(
			clubNames.map(async (clubName) => {
				const [clubInfo, level] = await Promise.all([
					getClubByName(clubName),
					getClubLevel(clubName)
				]);
				console.log('[ClubAPI] Club info for', clubName, ':', clubInfo, 'level:', level);
				return {
					id: clubInfo?.id || clubInfo?.fields?.id || clubName,
					name: clubName,
					level: level || clubInfo?.fields?.level || clubInfo?.level || null,
					description: null,
					location: clubInfo?.fields?.venue_address_country || clubInfo?.venue_address_country || null,
					role: 'leader',
					joinCode: clubInfo?.fields?.['Join Code'] || clubInfo?.['Join Code'] || null
				};
			})
		);

		console.log('[ClubAPI] getClubsForLeaderEmail result:', clubs);
		return clubs;
	} catch (error) {
		console.error('[ClubAPI] getClubsForLeaderEmail error:', error);
		return [];
	}
}
