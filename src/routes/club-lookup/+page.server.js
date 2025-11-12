import { env } from '$env/dynamic/private';
import Airtable from 'airtable';
import { fail } from '@sveltejs/kit';

export async function load({ locals }) {
	return {
		user: locals.userPublic || null
	};
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const clubName = data.get('clubName');

		if (!clubName) {
			return fail(400, { error: 'Please enter a club name' });
		}

		const base = new Airtable({ apiKey: env.AIRTABLE_API_KEY }).base(env.AIRTABLE_BASE_ID);

		let level = null;
		let ships = [];

		try {
			const clubRecords = await base('Clubs')
				.select({
					filterByFormula: `{club_name} = '${clubName.toString().replace(/'/g, "\\'")}'`,
					maxRecords: 1
				})
				.firstPage();

			if (clubRecords.length > 0) {
				level = clubRecords[0].get('level') || null;
			} else {
				return fail(404, { error: `Club "${clubName}" not found in database` });
			}
		} catch (error) {
			console.error('Error fetching club from Airtable:', error);
			return fail(500, { error: 'Error fetching club data' });
		}

		try {
			const shipRecords = await base('Club Ships')
				.select({
					filterByFormula: `{club_name (from Clubs)} = '${clubName.toString().replace(/'/g, "\\'")}'`
				})
				.all();

			ships = shipRecords.map((record) => ({
				name: record.get('YSWS–Name (from Unified YSWS Database)') || 'Unnamed Ship',
				codeUrl: record.get('code_url') || null
			}));
		} catch (error) {
			console.error('Error fetching ships from Airtable:', error);
		}

		return {
			club: {
				name: clubName,
				level,
				ships
			}
		};
	}
};
