import { json } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { createOTP } from '$lib/server/auth/otp.js';
import { checkLeaderEmail } from '$lib/server/airtable.js';
import { sendOTPEmail } from '$lib/server/email.js';

export async function POST({ request }) {
	const { email } = await request.json();

	if (!email) {
		return json({ error: 'Email is required' }, { status: 400 });
	}

	const isLeader = await checkLeaderEmail(email);

	if (!isLeader) {
		return json({ error: 'Email not found in Leaders table' }, { status: 403 });
	}

	const knex = getKnex();
	const code = await createOTP(knex, email);

	await sendOTPEmail(email, code);

	return json({ success: true });
}
