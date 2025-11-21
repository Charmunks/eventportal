import crypto from 'node:crypto';
import { getKnex } from '$lib/server/db/knex.js';
import { findSessionByTokenHash, touchSession, deleteSessionById } from '$lib/server/auth/sessions.js';
import { getUserPublicById } from '$lib/server/auth/users.js';
import { refreshIfNeeded } from '$lib/server/auth/tokens.js';

const SESSION_COOKIE = 'sid';

export async function handle({ event, resolve }) {
	const knex = getKnex();

	const raw = event.cookies.get(SESSION_COOKIE);
	if (raw) {
		const token = raw;
		const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
		const session = await findSessionByTokenHash(knex, tokenHash);

		if (session && session.expires_at > new Date()) {
			const now = new Date();

			if (session.last_activity_at < new Date(now.getTime() - 15 * 60 * 1000)) {
				await touchSession(knex, session.id, { last_activity_at: now });
			}

			const userPublic = await getUserPublicById(knex, session.user_id);
			event.locals.userId = session.user_id;
			event.locals.userPublic = userPublic;

			event.locals.getAccessToken = async () => {
				const { token } = await refreshIfNeeded(knex, session.user_id, event.fetch);
				return token;
			};
		} else if (session) {
			await deleteSessionById(knex, session.id);
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	}

	return resolve(event);
}
