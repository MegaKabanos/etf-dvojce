const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
	return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** HMAC-SHA256 of the normalised e-mail address, hex encoded. Works in Node and edge runtimes. */
export async function makeUnsubscribeToken(email: string, secret: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(email.trim().toLowerCase()));
	return toHex(sig);
}

/** Constant-time comparison of the supplied token with the expected one. */
export async function verifyUnsubscribeToken(email: string, token: string, secret: string): Promise<boolean> {
	const expected = await makeUnsubscribeToken(email, secret);
	if (token.length !== expected.length) return false;
	let diff = 0;
	for (let i = 0; i < expected.length; i++) {
		diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
	}
	return diff === 0;
}
