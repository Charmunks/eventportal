import crypto from 'node:crypto';
import { json } from '@sveltejs/kit';
import { getKnex } from '$lib/server/db/knex.js';
import { verifyOTP } from '$lib/server/auth/otp.js';
import { createSession } from '$lib/server/auth/sessions.js';
import { getClubsForLeader } from '$lib/server/airtable.js';

const SESSION_COOKIE = 'sid';

export async function POST({ request, cookies, getClientAddress }) {
	const { email, code } = await request.json();

	if (!email || !code) {
		return json({ error: 'Email and code are required' }, { status: 400 });
	}

	const knex = getKnex();

	const isValid = await verifyOTP(knex, email, code);

	if (!isValid) {
		return json({ error: 'Invalid or expired OTP code' }, { status: 401 });
	}

	let user = await knex('users')
		.where({ provider: 'email', provider_user_id: email })
		.first();

	if (!user) {
		const [newUser] = await knex('users')
			.insert({
				id: crypto.randomUUID(),
				provider: 'email',
				provider_user_id: email,
				email: email,
				identity_verified: true
			})
			.returning('*');
		user = newUser;
	}

	const clubs = await getClubsForLeader(email);

	const sessionToken = crypto.randomBytes(32).toString('base64url');
	await createSession(knex, user.id, sessionToken, {
		ip: getClientAddress(),
		userAgent: request.headers.get('user-agent')
	});

	cookies.set(SESSION_COOKIE, sessionToken, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 14
	});

	return json({ success: true, clubs });
}
