<script>
	import LevelCard from '$lib/LevelCard.svelte';
	
	let { data } = $props();
</script>

<svelte:head>
	<title>My Club - Clubs Event Portal</title>
</svelte:head>

<div class="container">
	<header>
		<h1 class="page-title">My Club</h1>
		<div class="header-buttons">
			<a href="javascript:window.location.href = '/'" class="nav-button">Home</a>
			<form method="POST" action="/logout" style="display: inline;">
				<button type="submit" class="nav-button">Logout</button>
			</form>
		</div>
	</header>
	


	<section class="clubs-info">

		{#if data.clubs.length > 0}
			<div class="clubs-grid">
				{#each data.clubs as club}
					<div class="club-card">
						<div class="club-header">
							<h3 class="club-name">{club.name}</h3>
							<div class="club-badges">
								{#if club.level}
									<span class="club-level">{club.level}</span>
								{/if}
								<span class="club-role {club.role}">{club.role}</span>
							</div>
						</div>

						<LevelCard currentLevel={club.level || 'Bronze'} clubShips={club.ships.length || 0} />
						
					

						{#if club.members}
							<div class="members-section">
								<h4 class="members-title">Members</h4>
								<div class="members-list">
									<div class="member-item">
										<span class="member-name">{club.members}</span>
									</div>
								</div>
								{#if club.joinCode}
									<h4 class="ships-title">Invite members using <a href="https://hack.club/join/{club.joinCode}" target="_blank" rel="noopener noreferrer">hack.club/join/{club.joinCode}</a></h4>
								{/if}
							</div>
						{/if}
						<div class="ships-section">
						<h4 class="ships-title">Ships ({club.ships.length})</h4>
						{#if club.ships && club.ships.length > 0}

								<div class="ships-list">
									{#each club.ships as ship}
										<div class="ship-item">
											<span class="ship-name">{ship.name} - {ship.memberName}</span>
											{#if ship.codeUrl}
												<a href={ship.codeUrl} target="_blank" rel="noopener noreferrer" class="ship-link">
													View Code
												</a>
											{/if}
										</div>
									{/each}
								</div>
								<h4 class="ships-title">Fill out <a href="https://forms.hackclub.com/club-ships">this</a> form to link shipped projects to your club!</h4>
						{:else}
							<h4 class="ships-title">Fill out <a href="https://forms.hackclub.com/club-ships">this</a> form to link shipped projects to your club!</h4>
						{/if}
						</div>

					</div>
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				<p>You are not a member of any clubs yet.</p>
			</div>
		{/if}
	</section>
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

	.section-title {
		font-size: 32px;
		font-weight: bold;
		color: #1f2d3d;
		margin-bottom: 24px;
	}

	.user-info {
		margin-bottom: 48px;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 16px;
		background: #f9fafc;
		padding: 24px;
		border-radius: 12px;
		border: 2px solid #e5e7eb;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.label {
		font-size: 14px;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.value {
		font-size: 18px;
		color: #1f2d3d;
		font-weight: 500;
	}

	.value.verified {
		color: #10b981;
	}

	.value.not-verified {
		color: #ef4444;
	}

	.clubs-grid {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.club-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		padding: 24px;
		transition: all 0.2s;
	}

	.club-card:hover {
		border-color: #ec3750;
		box-shadow: 0 4px 12px rgba(236, 55, 80, 0.1);
	}

	.club-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		margin-bottom: 12px;
	}

	.club-name {
		font-size: 24px;
		font-weight: bold;
		color: #1f2d3d;
		margin: 0;
		flex: 1;
	}

	.club-badges {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.club-level {
		padding: 4px 12px;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background-color: #dcfce7;
		color: #166534;
	}

	.club-role {
		padding: 4px 12px;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.club-role.leader {
		background-color: #fef3c7;
		color: #92400e;
	}

	.club-role.member {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.club-details {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.detail-label {
		font-size: 14px;
		font-weight: 600;
		color: #6b7280;
	}

	.detail-value {
		font-size: 14px;
		color: #1f2d3d;
		font-weight: 500;
	}

	.empty-state {
		background: #f9fafc;
		padding: 48px;
		border-radius: 12px;
		border: 2px dashed #e5e7eb;
		text-align: center;
	}

	.empty-state p {
		color: #6b7280;
		font-size: 18px;
		margin: 0;
	}

	.members-section {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.members-title {
		font-size: 16px;
		font-weight: 600;
		color: #1f2d3d;
		margin: 0 0 12px 0;
	}

	.members-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom:8px;
	}

	.member-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: #f9fafc;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.member-name {
		font-size: 14px;
		color: #1f2d3d;
		font-weight: 500;
	}

	.ships-section {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	.ships-title {
		font-size: 16px;
		font-weight: 600;
		color: #1f2d3d;
		margin: 0 0 12px 0;
	}

		.ships-title a {
		font-size: 16px;
		font-weight: 600;
		color: #338eda;
		text-decoration: underline;
		margin: 0 0 12px 0;
	}

	.ships-footer {
		font-size: 16px;
		font-weight: 600;
		color: #1f2d3d;
		margin: 0 0 4px 0;
	}

		.ships-footer a {
		font-size: 16px;
		font-weight: 600;
		color: #338eda;
		text-decoration: underline;
		margin: 0 0 4px 0;
	}

	.ships-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom:16px;
	}

	.ship-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: #f9fafc;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.ship-name {
		font-size: 14px;
		color: #1f2d3d;
		font-weight: 500;
	}

	.ship-link {
		font-size: 13px;
		color: #ec3750;
		text-decoration: none;
		font-weight: 600;
		padding: 4px 12px;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.ship-link:hover {
		background-color: #ec3750;
		color: white;
	}
</style>
