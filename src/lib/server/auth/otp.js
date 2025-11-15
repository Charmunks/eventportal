import crypto from 'node:crypto';

export function generateOTP() {
	return crypto.randomInt(100000, 999999).toString();
}

export async function createOTP(knex, email) {
	const code = generateOTP();
	const now = new Date();
	const expires = new Date(now.getTime() + 10 * 60 * 1000);

	await knex('otp_codes')
		.where({ email, used: false })
		.update({ used: true });

	await knex('otp_codes').insert({
		id: crypto.randomUUID(),
		email,
		code,
		created_at: now,
		expires_at: expires,
		used: false
	});

	return code;
}

export async function verifyOTP(knex, email, code) {
	const otp = await knex('otp_codes')
		.where({ email, code, used: false })
		.andWhere('expires_at', '>', knex.fn.now())
		.first();

	if (!otp) {
		return false;
	}

	await knex('otp_codes').where({ id: otp.id }).update({ used: true });

	return true;
}

export async function cleanupExpiredOTPs(knex) {
	await knex('otp_codes')
		.where('expires_at', '<', knex.fn.now())
		.delete();
}
