import { getAirtableBase } from './airtable.js';

export async function sendOTPEmail(email, code) {
	const base = getAirtableBase();
	
	try {
		await base('Leader Emails').create({
			email: email,
			otp: code
		});
		
		console.log(`Created OTP record in Airtable for ${email}`);
		return true;
	} catch (error) {
		console.error('Error creating OTP record in Airtable:', error);
		throw new Error("Failed to create OTP record");
	}
}
