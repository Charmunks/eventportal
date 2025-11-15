import Airtable from 'airtable';
import { env } from '$env/dynamic/private';

export function getAirtableBase() {
	if (!env.AIRTABLE_API_KEY) {
		throw new Error("Missing AIRTABLE_API_KEY");
	}
	if (!env.AIRTABLE_BASE_ID) {
		throw new Error("Missing AIRTABLE_BASE_ID");
	}
	return new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);
}

export async function checkLeaderEmail(email) {
	const base = getAirtableBase();
	
	try {
		const records = await base('Leaders')
			.select({
				filterByFormula: `{email} = '${email.replace(/'/g, "\\'")}'`,
				maxRecords: 1
			})
			.firstPage();

		return records.length > 0;
	} catch (error) {
		console.error('Error checking leader email:', error);
		throw new Error("Failed to check leader email");
	}
}

export async function getClubsForLeader(email) {
	const base = getAirtableBase();
	
	console.log(`[getClubsForLeader] Starting search for leader email: ${email}`);
	
	try {
		const leaderRecords = await base('Leaders')
			.select({
				filterByFormula: `{email} = '${email.replace(/'/g, "\\'")}'`,
				maxRecords: 1
			})
			.firstPage();

		if (leaderRecords.length === 0) {
			console.log(`[getClubsForLeader] No leader found with email: ${email}`);
			return [];
		}

		const leaderId = leaderRecords[0].id;
		console.log(`[getClubsForLeader] Found leader ID: ${leaderId}`);
		
		console.log(`[getClubsForLeader] Fetching ALL clubs to filter in JavaScript...`);
		const allRecords = await base('Clubs').select().all();
		console.log(`[getClubsForLeader] Total clubs in Airtable: ${allRecords.length}`);
		
		const records = allRecords.filter(record => {
			const relLeader = record.get('rel_leader');
			const hasMatch = Array.isArray(relLeader) && relLeader.includes(leaderId);
			if (hasMatch) {
				console.log(`[getClubsForLeader] MATCH FOUND: ${record.get('club_name')} has leader ${leaderId}`);
			}
			return hasMatch;
		});

		console.log(`[getClubsForLeader] Found ${records.length} matching clubs after filtering`);
		
		const clubs = records.map(record => {
			const club = {
				id: record.id,
				name: record.get('club_name') || 'Unnamed Club',
				level: record.get('level') || null,
				description: record.get('description') || null,
				location: record.get('location') || null
			};
			console.log(`[getClubsForLeader] Club found:`, club);
			return club;
		});
		
		return clubs;
	} catch (error) {
		console.error('[getClubsForLeader] Error fetching clubs for leader:', error);
		console.error('[getClubsForLeader] Error details:', {
			message: error.message,
			statusCode: error.statusCode,
			error: error.error
		});
		throw new Error("Failed to fetch clubs");
	}
}
