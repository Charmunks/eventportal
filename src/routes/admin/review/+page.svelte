<script>
	let { data } = $props();
	let selectedProject = $state(data.projects && data.projects.length > 0 ? data.projects[0] : null);

	function selectProject(project) {
		selectedProject = project;
	}
</script>

<svelte:head>
	<title>Review Projects</title>
</svelte:head>

<div class="container">
	<header>
		<h1 class="page-title">Review Projects</h1>
		<div class="header-buttons">
			<a href="/" class="nav-button">Home</a>
			<form method="POST" action="/logout" style="display: inline;">
				<button type="submit" class="nav-button">Logout</button>
			</form>
		</div>
	</header>
	
	{#if data.error}
		<div class="error-banner">
			<p>Error: {data.error}</p>
		</div>
	{/if}

	{#if data.projects && data.projects.length > 0}
		<div class="review-layout">
			<!-- Left Sidebar: List of Projects -->
			<div class="project-list">
				{#each data.projects as project}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						class="project-list-item {selectedProject?.id === project.id ? 'selected' : ''}"
						onclick={() => selectProject(project)}
					>
						<div class="item-header">
							<span class="item-name">{project.FirstName} {project.LastName}</span>
							<span class="item-date">{new Date().toLocaleDateString()}</span> <!-- Placeholder date if not in data -->
						</div>
						<div class="item-summary">
							{project.City}, {project.Country}
						</div>
					</div>
				{/each}
			</div>

			<!-- Right Content: Selected Project Details -->
			<div class="project-detail">
				{#if selectedProject}
					<div class="detail-card">
						<div class="detail-header">
							<div>
								<h2 class="detail-name">{selectedProject.FirstName} {selectedProject.LastName}</h2>
								<div class="detail-badges">
									<span class="badge pending">Pending Review</span>
								</div>
							</div>
							<div class="action-buttons">
								<button class="action-btn approve">Approve</button>
								<button class="action-btn reject">Reject</button>
							</div>
						</div>

						<div class="info-grid">
							<div class="info-group">
								<span class="info-label">Email</span>
								<div class="info-value">{selectedProject.Email}</div>
							</div>
							<div class="info-group">
								<span class="info-label">GitHub</span>
								<div class="info-value">
									<a href="https://github.com/{selectedProject.GitHubUsername}" target="_blank" class="text-link">
										{selectedProject.GitHubUsername}
									</a>
								</div>
							</div>
							<div class="info-group">
								<span class="info-label">Location</span>
								<div class="info-value">
									{selectedProject.AddressLine1}<br>
									{#if selectedProject.AddressLine2}{selectedProject.AddressLine2}<br>{/if}
									{selectedProject.City}, {selectedProject.StateProvince} {selectedProject.ZipPostalCode}<br>
									{selectedProject.Country}
								</div>
							</div>
							<div class="info-group">
								<span class="info-label">Birthday</span>
								<div class="info-value">{selectedProject.Birthday}</div>
							</div>
							<div class="info-group">
								<span class="info-label">Slack ID</span>
								<div class="info-value">{selectedProject.SlackID}</div>
							</div>
						</div>

						<div class="assets-section">
							<h3 class="section-title">Project Assets</h3>
							<div class="assets-grid">
								{#if selectedProject.Screenshot && selectedProject.Screenshot.length > 0}
									<div class="asset-card">
										<div class="asset-preview">
											<img src={selectedProject.Screenshot[0].url} alt="Project Screenshot" />
										</div>
										<div class="asset-info">
											<span class="asset-type">Screenshot</span>
											<a href={selectedProject.Screenshot[0].url} target="_blank" class="asset-link">View Full Size</a>
										</div>
									</div>
								{/if}
								
								{#if selectedProject.ProjectFile && selectedProject.ProjectFile.length > 0}
									<div class="asset-card file-card">
										<div class="asset-preview">
											<div class="file-icon">📦</div>
										</div>
										<div class="asset-info">
											<span class="asset-type">STEP File</span>
											<span class="file-name">{selectedProject.ProjectFile[0].filename}</span>
											<a href={selectedProject.ProjectFile[0].url} target="_blank" class="asset-link">Download</a>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="empty-selection">
						<p>Select a project to review</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>No pending projects to review.</p>
		</div>
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

	:global(body) {
		font-family: 'Phantom Sans', sans-serif;
		background-color: #f4f4f6;
		margin: 0;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 32px 24px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		flex-shrink: 0;
	}

	.page-title {
		font-size: 32px;
		font-weight: bold;
		color: #ec3750;
		margin: 0;
	}

	.header-buttons {
		display: flex;
		gap: 12px;
	}

	.nav-button {
		padding: 8px 16px;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
		border: 2px solid #ec3750;
		cursor: pointer;
		background-color: #ec3750;
		color: white;
		transition: all 0.2s;
	}

	.nav-button:hover {
		background-color: #d62c47;
		border-color: #d62c47;
	}

	.error-banner {
		background-color: #fee2e2;
		border: 1px solid #ef4444;
		color: #b91c1c;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 16px;
	}

	/* Layout */
	.review-layout {
		display: flex;
		gap: 24px;
		flex: 1;
		min-height: 0; /* Important for nested scrolling */
	}

	/* Sidebar */
	.project-list {
		width: 300px;
		background: white;
		border-radius: 12px;
		border: 1px solid #e5e7eb;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
	}

	.project-list-item {
		padding: 16px;
		border-bottom: 1px solid #f3f4f6;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.project-list-item:hover {
		background-color: #f9fafc;
	}

	.project-list-item.selected {
		background-color: #fff1f3;
		border-left: 4px solid #ec3750;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 4px;
	}

	.item-name {
		font-weight: 600;
		color: #1f2d3d;
	}

	.item-date {
		font-size: 12px;
		color: #6b7280;
	}

	.item-summary {
		font-size: 13px;
		color: #4b5563;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Main Content */
	.project-detail {
		flex: 1;
		background: white;
		border-radius: 12px;
		border: 1px solid #e5e7eb;
		overflow-y: auto;
		padding: 32px;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 32px;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 24px;
	}

	.detail-name {
		font-size: 28px;
		font-weight: bold;
		color: #1f2d3d;
		margin: 0 0 8px 0;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.badge.pending {
		background-color: #fef3c7;
		color: #92400e;
	}

	.action-buttons {
		display: flex;
		gap: 12px;
	}

	.action-btn {
		padding: 8px 20px;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		font-size: 14px;
		transition: all 0.2s;
	}

	.action-btn.approve {
		background-color: #10b981;
		color: white;
	}

	.action-btn.approve:hover {
		background-color: #059669;
	}

	.action-btn.reject {
		background-color: #ef4444;
		color: white;
	}

	.action-btn.reject:hover {
		background-color: #dc2626;
	}

	/* Info Grid */
	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
		margin-bottom: 48px;
	}

	.info-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.info-label {
		font-size: 12px;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.info-value {
		font-size: 16px;
		color: #1f2d3d;
		line-height: 1.5;
	}

	.text-link {
		color: #ec3750;
		text-decoration: none;
	}

	.text-link:hover {
		text-decoration: underline;
	}

	/* Assets */
	.section-title {
		font-size: 20px;
		font-weight: 600;
		color: #1f2d3d;
		margin: 0 0 16px 0;
	}

	.assets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 24px;
	}

	.asset-card {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s;
	}

	.asset-card:hover {
		border-color: #ec3750;
		box-shadow: 0 4px 6px rgba(0,0,0,0.05);
	}

	.asset-preview {
		height: 150px;
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.asset-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.file-icon {
		font-size: 48px;
	}

	.file-card .asset-preview {
		background-color: #f9fafc;
	}

	.asset-info {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.asset-type {
		font-size: 11px;
		text-transform: uppercase;
		color: #6b7280;
		font-weight: 600;
	}

	.file-name {
		font-size: 14px;
		font-weight: 500;
		color: #1f2d3d;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.asset-link {
		font-size: 13px;
		color: #ec3750;
		text-decoration: none;
		font-weight: 500;
		margin-top: 4px;
	}

	.asset-link:hover {
		text-decoration: underline;
	}

	.empty-state {
		text-align: center;
		padding: 64px;
		color: #6b7280;
		background: white;
		border-radius: 12px;
		border: 2px dashed #e5e7eb;
		text-align: center;
	}
</style>
