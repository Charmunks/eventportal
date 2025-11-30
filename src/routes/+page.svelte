<script>
	import { onMount } from 'svelte';
	import EventGrid from '$lib/EventGrid.svelte';
	import EventModal from '$lib/EventModal.svelte';
	import NewLeaderModal from '$lib/NewLeaderModal.svelte';

	let { data } = $props();
	let events = $state([]);
	let selectedEvent = $state(null);
	let showNewLeaderModal = $state(false);
	let bannerDismissed = $state(false);
	let hasCompletedEvents = $derived(events.some(e => e.completed));

	onMount(async () => {
		const dismissed = localStorage.getItem('newLeaderBannerDismissed');
		if (dismissed === 'true') {
			bannerDismissed = true;
		}
		await fetchEvents();
	});

	async function fetchEvents() {
		try {
			const response = await fetch('/api/events');
			if (response.ok) {
				events = await response.json();
			} else {
				console.error('Failed to fetch events');
			}
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	}

	function openEvent(event) {
		selectedEvent = event;
	}

	function closeModal() {
		selectedEvent = null;
	}

	function closeNewLeaderModal() {
		showNewLeaderModal = false;
	}

	function openNewLeaderModal(e) {
		e.preventDefault();
		showNewLeaderModal = true;
	}

	function dismissBanner(e) {
		e.stopPropagation();
		bannerDismissed = true;
		localStorage.setItem('newLeaderBannerDismissed', 'true');
	}

	async function handleComplete(eventId, markAsComplete) {
		const eventIndex = events.findIndex(e => e.id === eventId);
		if (eventIndex === -1) return;

		const originalEvent = { ...events[eventIndex] };
		
		events[eventIndex] = {
			...events[eventIndex],
			completed: markAsComplete,
			category: markAsComplete ? 'Completed' : events[eventIndex].originalCategory
		};

		try {
			const method = markAsComplete ? 'POST' : 'DELETE';
			const response = await fetch('/api/events/complete', {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventId })
			});

			if (!response.ok) {
				console.error('Failed to update event completion status');
				events[eventIndex] = originalEvent;
			}
		} catch (error) {
			console.error('Error updating event:', error);
			events[eventIndex] = originalEvent;
		}
	}
</script>

<svelte:head>
	<title>Club Leaders Portal</title>
</svelte:head>

<div class="container">
	<header>
		<h1 class="title">Club Leaders Portal</h1>
		<div class="header-buttons">
			{#if data.user}
				<a href="/my-club" class="nav-button">My Club</a>
				{#if data.user.isAdmin}
					<a href="/admin" class="nav-button">Admin</a>
				{/if}
				<form method="POST" action="/logout" style="display: inline;">
					<button type="submit" class="nav-button">Logout</button>
				</form>
			{:else}
				<a href="/email-login" class="nav-button">Sign in with Email</a>
			{/if}
		</div>
	</header>

	{#if !bannerDismissed}
		<div class="banner">
			<button class="banner-content" onclick={openNewLeaderModal}>
				New leader? Click here
			</button>
			<button class="banner-close" onclick={dismissBanner} aria-label="Close banner">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	{:else}
		<button class="help-button" onclick={openNewLeaderModal} aria-label="New leader help">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
				<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
			</svg>
		</button>
	{/if}

	<main>
		<div class="category-bubble webdev">
			<h2 class="section-title">Web development series:</h2>
			<EventGrid {events} category="Webdev" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />
		</div>

		<div class="category-bubble cad">
			<h2 class="section-title">CAD series:</h2>
			<EventGrid {events} category="CAD" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />
		</div>

		<div class="category-bubble other">
			<h2 class="section-title">Other Clubs YSWS:</h2>
			<EventGrid {events} category="Other" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />
		</div>

		{#if hasCompletedEvents}
			<div class="category-bubble completed">
				<h2 class="section-title">Completed YSWS:</h2>
				<EventGrid {events} category="Completed" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />
			</div>
		{/if}
	</main>

	<footer>
		<a href="https://ysws.hackclub.com/" target="_blank" rel="noopener noreferrer" class="footer-button">
			View all YSWS Programs
		</a>
	</footer>
</div>

{#if selectedEvent}
	<EventModal event={selectedEvent} {closeModal} />
{/if}

{#if showNewLeaderModal}
	<NewLeaderModal closeModal={closeNewLeaderModal} />
{/if}

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
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Italic.woff')
			format('woff'),
		url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Italic.woff2')
			format('woff2');
		font-weight: normal;
		font-style: italic;
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
		background-color: #ffffff;
		color: #1f2d3d;
		margin: 0;
		padding: 0;

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

	.title {
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

	.nav-button.secondary {
		background-color: white;
		color: #ec3750;
	}

	.nav-button.secondary:hover {
		background-color: #f9fafc;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}


	.category-bubble {
		padding: 32px;
		border-radius: 24px;
		margin-bottom: 24px;
		transition: transform 0.3s
	}

	.category-bubble:hover {
		transform: translateY(-4px);
	}

	.category-bubble.webdev {
		background: #dbeafe;
		border: 3px solid #3b82f6;
	}

	.category-bubble.cad {
		background: #fef3c7;
		border: 3px solid #f59e0b;
	}

	.category-bubble.other {
		background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
		border: 3px solid #ec4899;
	}

	.category-bubble.completed {
		background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
		border: 3px solid #10b981;
	}

	.section-title {
		color: #1f2d3d;
		font-weight: bold;
		font-size: 32px;
		margin: 0 0 16px 0;
	}

	.banner {
		position: relative;
		display: block;
		width: 100%;
		background-color: #ffeaa7;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.banner-content {
		width: 100%;
		color: #1f2d3d;
		text-align: center;
		padding: 32px;
		font-size: 24px;
		font-weight: 600;
		text-decoration: none;
		border: none;
		background: transparent;
		border-radius: 8px;
		transition: background-color 0.2s;
		cursor: pointer;
		font-family: 'Phantom Sans', sans-serif;
	}

	.banner-content:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.banner-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.banner-close:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.help-button {
		position: fixed;
		bottom: 24px;
		right: 24px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background-color: #ec3750;
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		z-index: 100;
	}

	.help-button:hover {
		background-color: #d63447;
		transform: translateY(-2px);
	}

	@media (max-width: 640px) {
		.help-button {
			width: 48px;
			height: 48px;
			bottom: 16px;
			right: 16px;
		}
	}

	footer {
		text-align: center;
		margin-top: 12px;
	}

	.footer-button {
		display: inline-block;
		padding: 12px 64px;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		font-size: 16px;
		transition: all 0.2s;
		border: 2px solid #ec3750;
		background-color: #ec3750;
		color: white;
	}

	.footer-button:hover {
		background-color: #d62c47;
		border-color: #d62c47;
	}
</style>