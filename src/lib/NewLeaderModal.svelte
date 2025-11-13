<script>
	import { marked } from 'marked';
	
	let { closeModal } = $props();
	
	let currentPage = $state(0);
	
	const pages = [
		{
			title: "Level up your club!",
			content: `
Every club starts as a Bronze level Hack Club. This means we recognize you all as an official Hack Club and offer these perks:

1. Leader Newsletters email to inform of new programs. <br>
3. Guidance from the Clubs team. <br>
4. Access to various workshops to use in meetings.

**How do clubs level up?** By shipping projects! Hack Club is all about learning through building and shipping projects for others to see. Have 4+ members ship projects to any Hack Club program to level your club status. More perks unlock at each level.

You can view your clubs level by selecting a club or signing in with club dashboard.

			`
		},
		{
			title: "YSWS Programs",
			content: `
Do you know what a You Ship We Ship (YSWS) program is? It simply means "You Ship" us a project, "We Ship" something in return. This can be anything from grants to purchase food at club meetings or 3D printed object people designed within your meetings!

This page contains a list off all YSWS programs that currently support clubs. If you click on any of the programs, a popup window will appear with information about the YSWS program and a link to a tutorial presentation you can show to your club.
			`
		},
		{
			title: "More questions?",
			content: `
If you have more questions about your club, please reach out! you may contact us by:

Emailing clubs@hackclub.com<br>
Asking in the [#leaders](https://hackclub.slack.com/archives/C02PA5G01ND) channel on slack<br>
Scheduling a meeting with your ambassador.

We are always willing to help out or answer questions!


			`
		}
	];
	
	function renderMarkdown(markdown) {
		return marked(markdown);
	}
	
	function nextPage() {
		if (currentPage < pages.length - 1) {
			currentPage++;
		}
	}
	
	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}
</script>

<div class="modal-overlay" onclick={closeModal} onkeydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0">
	<div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" tabindex="0">
		<button class="close-button" onclick={closeModal}>✕</button>
		
		<div class="modal-header">
			<h2>{pages[currentPage].title}</h2>
		</div>
		
		<div class="modal-body">
			{@html renderMarkdown(pages[currentPage].content)}
		</div>
		
		<div class="navigation">
			{#if currentPage > 0}
				<button class="nav-button prev" onclick={prevPage}>
					← Previous
				</button>
			{/if}
			
			<div class="page-indicator">
				{currentPage + 1} / {pages.length}
			</div>
			
			{#if currentPage < pages.length - 1}
				<button class="nav-button next" onclick={nextPage}>
					Next →
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-content {
		background: #ffffff;
		border-radius: 16px;
		padding: 48px;
		max-width: 600px;
		width: 90%;
		max-height: 90vh;
		overflow: hidden;
		position: relative;
		animation: slideUp 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 640px) {
		.modal-content {
			padding: 24px;
			max-height: 95vh;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.close-button {
		position: absolute;
		top: 24px;
		right: 24px;
		background: none;
		border: none;
		font-size: 32px;
		color: #8492a6;
		cursor: pointer;
		padding: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: #f9fafc;
		color: #ec3750;
	}

	.modal-header {
		margin-bottom: 24px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		flex-shrink: 0;
	}

	.modal-header h2 {
		color: #1f2d3d;
		font-size: 36px;
		margin: 0;
		padding-right: 40px;
		font-weight: 900;
	}

	@media (max-width: 640px) {
		.modal-header h2 {
			font-size: 28px;
		}
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 24px;
		font-size: 18px;
		line-height: 1.6;
		color: #1f2d3d;
		overflow-y: auto;
		flex: 1;
	}

	@media (max-width: 640px) {
		.modal-body {
			font-size: 16px;
			gap: 12px;
			margin-bottom: 16px;
		}
	}

	.modal-body :global(p) {
		margin: 0 0 16px 0;
	}

	.modal-body :global(ul) {
		margin: 0 0 16px 0;
		padding-left: 24px;
	}

	.modal-body :global(a) {
		color: #ec3750;
		text-decoration: underline;
	}

	.modal-body :global(a:hover) {
		color: #d63447;
	}

	.modal-body :global(strong) {
		font-weight: bold;
	}

	.navigation {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 24px;
		border-top: 2px solid #f0f0f0;
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		.navigation {
			padding-top: 16px;
		}
	}

	.nav-button {
		background: #ec3750;
		color: #ffffff;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: bold;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: 'Phantom Sans', sans-serif;
	}

	@media (max-width: 640px) {
		.nav-button {
			padding: 10px 16px;
			font-size: 14px;
		}
	}

	.nav-button:hover {
		background: #d63447;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(236, 55, 80, 0.3);
	}

	.page-indicator {
		color: #8492a6;
		font-size: 14px;
		font-weight: 600;
	}
</style>
