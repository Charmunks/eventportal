<script>
	import { onMount } from 'svelte';
	import EventGrid from '$lib/EventGrid.svelte';
	import EventModal from '$lib/EventModal.svelte';

	let { data } = $props();
	let events = $state([]);
	let selectedEvent = $state(null);
	let hasCompletedEvents = $derived(events.some(e => e.completed));

	onMount(async () => {
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
	<title>Clubs Event Portal</title>
</svelte:head>

<div class="container">
	<header>
		<h1 class="title">Clubs Event Portal</h1>
		<div class="header-buttons">
			{#if data.user}
				<a href="/my-club" class="nav-button">My Club</a>
				<form method="POST" action="/logout" style="display: inline;">
					<button type="submit" class="nav-button">Logout</button>
				</form>
			{:else}
				<a href="/club-lookup" class="nav-button secondary">Select Club</a>
				<a href="/login" class="nav-button">Login with Club Dashboard</a>
			{/if}
		</div>
	</header>

	<main>
		<h2 class="section-title">Web development series:</h2>
		
		<EventGrid {events} category="Webdev" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />

		<h2 class="section-title">CAD series:</h2>
		
		<EventGrid {events} category="CAD" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />

		<h2 class="section-title">Other Clubs YSWS:</h2>
		
		<EventGrid {events} category="Other" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />

		{#if hasCompletedEvents}
			<h2 class="section-title">Completed YSWS:</h2>
			
			<EventGrid {events} category="Completed" {openEvent} onComplete={handleComplete} isLoggedIn={!!data.user} />
		{/if}
	</main>
</div>

{#if selectedEvent}
	<EventModal event={selectedEvent} {closeModal} />
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


	.section-title {
		color: #1f2d3d;
		font-weight: bold;
		font-size: 32px;
		margin: 32px 0 16px 0;
	}
</style>
