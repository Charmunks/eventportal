<script>
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Club Lookup - Clubs Event Portal</title>
</svelte:head>

<div class="container">
	<header>
		<h1 class="page-title">Clubs Event Portal</h1>
		<div class="header-buttons">
			<a href="/" class="nav-button">Home</a>
			{#if data.user}
				<a href="/my-club" class="nav-button">My Club</a>
			{/if}
		</div>
	</header>

	<section class="search-section">
		<form method="POST" class="search-form">
			<div class="form-group">
				<label for="clubName">Enter Club Name</label>
				<input
					type="text"
					id="clubName"
					name="clubName"
					placeholder="e.g., Tech High Hack Club"
					required
				/>
			</div>
			<button type="submit" class="search-button">Search Club</button>
		</form>

		{#if form?.error}
			<div class="error-message">
				{form.error}
			</div>
		{/if}
	</section>

	{#if form?.club}
		<section class="club-result">
			<div class="club-card">
				<div class="club-header">
					<h2 class="club-name">{form.club.name}</h2>
					{#if form.club.level}
						<span class="club-level">{form.club.level}</span>
					{/if}
				</div>

				{#if form.club.ships && form.club.ships.length > 0}
					<div class="ships-section">
						<h3 class="ships-title">Ships ({form.club.ships.length})</h3>
						<div class="ships-list">
							{#each form.club.ships as ship}
								<div class="ship-item">
									<span class="ship-name">{ship.name}</span>
									{#if ship.codeUrl}
										<a href={ship.codeUrl} target="_blank" rel="noopener noreferrer" class="ship-link">
											View Code
										</a>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<p class="no-ships">No ships found for this club.</p>
				{/if}
			</div>
		</section>
	{/if}
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

	.container {
		max-width: 1024px;
		margin: 0 auto;
		padding: 32px 16px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	.page-title {
		font-size: 48px;
		font-weight: bold;
		color: #ec3750;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.header-buttons {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.nav-button {
		padding: 10px 20px;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
		transition: all 0.2s;
		border: 2px solid #ec3750;
		cursor: pointer;
		font-family: 'Phantom Sans', sans-serif;
		background-color: #ec3750;
		color: white;
	}

	.nav-button:hover {
		background-color: #d62c47;
		border-color: #d62c47;
	}

	.search-section {
		margin-bottom: 48px;
	}

	.search-form {
		max-width: 600px;
		margin: 0 auto;
	}

	.form-group {
		margin-bottom: 16px;
	}

	label {
		display: block;
		font-size: 16px;
		font-weight: 600;
		color: #1f2d3d;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		font-size: 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-family: 'Phantom Sans', sans-serif;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #ec3750;
	}

	.search-button {
		width: 100%;
		padding: 12px 24px;
		font-size: 16px;
		font-weight: 600;
		background-color: #ec3750;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-family: 'Phantom Sans', sans-serif;
		transition: background-color 0.2s;
	}

	.search-button:hover {
		background-color: #d62c47;
	}

	.error-message {
		max-width: 600px;
		margin: 16px auto 0;
		padding: 12px 16px;
		background-color: #fef2f2;
		border: 2px solid #fecaca;
		border-radius: 8px;
		color: #dc2626;
		font-weight: 500;
		text-align: center;
	}

	.club-result {
		max-width: 800px;
		margin: 0 auto;
	}

	.club-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 32px;
	}

	.club-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 2px solid #e5e7eb;
	}

	.club-name {
		font-size: 32px;
		font-weight: bold;
		color: #1f2d3d;
		margin: 0;
	}

	.club-level {
		padding: 8px 16px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background-color: #dcfce7;
		color: #166534;
	}

	.ships-section {
		margin-top: 16px;
	}

	.ships-title {
		font-size: 20px;
		font-weight: 600;
		color: #1f2d3d;
		margin: 0 0 16px 0;
	}

	.ships-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.ship-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background: #f9fafc;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	.ship-name {
		font-size: 16px;
		color: #1f2d3d;
		font-weight: 500;
	}

	.ship-link {
		font-size: 14px;
		color: #ec3750;
		text-decoration: none;
		font-weight: 600;
		padding: 6px 16px;
		border-radius: 6px;
		transition: all 0.2s;
	}

	.ship-link:hover {
		background-color: #ec3750;
		color: white;
	}

	.no-ships {
		text-align: center;
		color: #6b7280;
		font-size: 16px;
		padding: 24px;
		background: #f9fafc;
		border-radius: 8px;
	}
</style>
