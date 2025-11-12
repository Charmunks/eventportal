<script>
	import EventCard from '$lib/EventCard.svelte';

	export let events;
	export let category;
	export let openEvent;
	export let onComplete;
	export let isLoggedIn;

	$: filteredEvents = category ? events.filter(e => e.category === category) : events;
</script>

<div class="events-grid">
	{#each filteredEvents as event}
		<EventCard {event} {openEvent} {onComplete} {isLoggedIn} />
	{/each}
</div>

<style>
	.events-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
	}
</style>
