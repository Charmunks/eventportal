<script>
	import { goto } from '$app/navigation';

	let email = $state('');
	let otpCode = $state('');
	let step = $state('email');
	let loading = $state(false);
	let error = $state('');

	async function requestOTP(e) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await fetch('/api/auth/request-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Failed to send OTP';
				loading = false;
				return;
			}

			step = 'otp';
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function verifyOTP(e) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await fetch('/api/auth/verify-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, code: otpCode })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Invalid OTP code';
				loading = false;
				return;
			}

			goto('/my-club');
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	function goBack() {
		step = 'email';
		otpCode = '';
		error = '';
	}
</script>

<svelte:head>
	<title>Email Login - Club Leaders Portal</title>
</svelte:head>


<div class="container">
	<div class="login-card">
		<h1 class="title">Leader Portal Login</h1>
		
		{#if step === 'email'}
			<form onsubmit={requestOTP}>
				<div class="form-group">
					<label for="email">Email Address</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="your.email@example.com"
						required
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="error">{error}</div>
				{/if}

				<button type="submit" class="submit-button" disabled={loading}>
					{loading ? 'Sending...' : 'Send OTP Code'}
				</button>

				<div class="back-link">
					<a href="/">Back to Home</a>
				</div>
			</form>
		{:else if step === 'otp'}
			<div class="otp-sent-message">
				A 6-digit code has been sent to <strong>{email}</strong>
			</div>

			<form onsubmit={verifyOTP}>
				<div class="form-group">
					<label for="otp">Enter OTP Code</label>
					<input
						id="otp"
						type="text"
						bind:value={otpCode}
						placeholder="123456"
						maxlength="6"
						inputmode="numeric"
						required
						disabled={loading}
						autofocus
					/>
				</div>

				{#if error}
					<div class="error">{error}</div>
				{/if}

				<button type="submit" class="submit-button" disabled={loading}>
					{loading ? 'Verifying...' : 'Verify & Login'}
				</button>

				<div class="back-link">
					<button type="button" onclick={goBack} disabled={loading}>
						Use a different email
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
<style>
	@font-face {
		font-family: 'Phantom Sans';
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Regular.woff')
			format('woff'),
		url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Regular.woff2')
			format('woff2');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Phantom Sans';
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Bold.woff')
			format('woff'),
		url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Bold.woff2')
			format('woff2');
		font-weight: bold;
		font-style: normal;
		font-display: swap;
	}

	:global(body) {
		font-family: 'Phantom Sans', sans-serif;
		color: #1f2d3d;
		margin: 0;
		padding: 0;
	}

	.container {
		min-height: 100vh;
		display: flex;
		background: url("/orpheus.jpg") center/cover;
		align-items: center;
		justify-content: center;
		padding: 16px;
		box-sizing: border-box;
	}

	.login-card {
		background: white;
		border: 3px solid #ec3750;
		border-radius: 16px;
		padding: 48px;
		max-width: 480px;
		width: 100%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
	}

	.title {
		font-size: 32px;
		font-weight: bold;
		color: #ec3750;
		margin: 0 0 32px 0;
		text-align: center;
	}

	.form-group {
		margin-bottom: 24px;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 8px;
		color: #1f2d3d;
		font-size: 14px;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #ddd;
		border-radius: 8px;
		font-size: 16px;
		font-family: 'Phantom Sans', sans-serif;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #ec3750;
	}

	input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	.submit-button {
		width: 100%;
		padding: 14px 24px;
		background-color: #ec3750;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		font-family: 'Phantom Sans', sans-serif;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #d62c47;
	}

	.submit-button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.error {
		background-color: #fee;
		border: 1px solid #fcc;
		color: #c33;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
	}

	.otp-sent-message {
		background-color: #e8f4fd;
		border: 1px solid #3b82f6;
		color: #1e40af;
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 24px;
		text-align: center;
		font-size: 14px;
	}

	.back-link {
		margin-top: 16px;
		text-align: center;
	}

	.back-link a,
	.back-link button {
		color: #ec3750;
		text-decoration: none;
		font-size: 14px;
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'Phantom Sans', sans-serif;
		font-weight: 600;
	}

	.back-link a:hover,
	.back-link button:hover:not(:disabled) {
		text-decoration: underline;
	}

	.back-link button:disabled {
		color: #999;
		cursor: not-allowed;
	}
</style>
