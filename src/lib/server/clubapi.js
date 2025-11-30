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

	const response = await fetch(url.toString(), { headers });
	if (!response.ok) {
		throw new Error(`Club API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

export async function getLeaderByEmail(email) {
	try {
		const data = await fetchClubApi('/leader', { email });
		return data;
	} catch (error) {
		console.error('Error fetching leader by email:', error);
		return null;
	}
}

export async function checkLeaderEmail(email) {
	try {
		const data = await fetchClubApi('/leader', { email });
		return data.leader === true || !!data.club_name;
	} catch (error) {
		console.error('Error checking leader email:', error);
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
		return data.level || null;
	} catch (error) {
		console.error(`Error fetching level for club ${clubName}:`, error);
		return null;
	}
}

export async function getClubShips(clubName) {
	try {
		const data = await fetchClubApi('/ships', { club_name: clubName });
		if (!Array.isArray(data)) {
			return [];
		}
		return data.map((ship) => ({
			name: ship['YSWS–Name (from Unified YSWS Database)']?.[0] || 'Unnamed Ship',
			codeUrl: ship.code_url || null,
			memberName: ship.member_name || null
		}));
	} catch (error) {
		console.error(`Error fetching ships for club ${clubName}:`, error);
		return [];
	}
}

export async function getClubsForLeaderEmail(email) {
	try {
		const leaderData = await getLeaderByEmail(email);
		if (!leaderData || !leaderData.club_name) {
			return [];
		}

		const clubNames = Array.isArray(leaderData.club_name) 
			? leaderData.club_name 
			: [leaderData.club_name];

		const clubs = await Promise.all(
			clubNames.map(async (clubName) => {
				const clubInfo = await getClubByName(clubName);
				return {
					id: clubInfo?.id || clubName,
					name: clubName,
					level: clubInfo?.level || null,
					description: null,
					location: clubInfo?.venue_address_country || null,
					role: 'leader'
				};
			})
		);

		return clubs;
	} catch (error) {
		console.error('Error fetching clubs for leader:', error);
		return [];
	}
}
