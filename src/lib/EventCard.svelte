<script>
	export let event;
	export let openEvent;
	export let onComplete;
	export let isLoggedIn;

	async function toggleComplete(e) {
		e.stopPropagation();
		await onComplete(event.id, !event.completed);
	}
</script>

<div class="event-card" style="background-color: {event.color};" on:click={() => openEvent(event)} on:keydown={(e) => e.key === 'Enter' && openEvent(event)} role="button" tabindex="0">
	{#if isLoggedIn}
		<button 
			class="complete-button" 
			class:completed={event.completed}
			on:click={toggleComplete}
			aria-label={event.completed ? "Mark as incomplete" : "Mark as complete"}
			title={event.completed ? "Mark as incomplete" : "Mark as complete"}
		>
			✓
		</button>
	{/if}
	<div class="event-compact">
		<img src={event.icon} alt="{event.title} icon" class="event-icon" />
		<h3 style="color: {event.textColor};">{event.title}</h3>
		<span class="type-badge">{event.type}</span>
		<span class="et" style="color: {event.textColor};">Estimated time: {event.et}</span>
	</div>
</div>

<style>
	.event-card {
		border-radius: 12px;
		padding: 16px;
		cursor: pointer;
		transition: all 0.2s ease;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		font-weight: 800;
		position: relative;
	}

	.event-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		transform: translateY(-2px);
	}

	.event-compact {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 100%;
		gap: 8px;
	}

	.event-icon {
		width: 40px;
		height: 40px;
		margin-bottom: 4px;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.event-compact h3 {
		font-size: 16px;
		margin: 0;
		font-weight: 900;
	}

	.type-badge {
		display: inline-block;
		background: #ec3750;
		color: #ffffff;
		padding: 3px 8px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: bold;
		width: fit-content;
	}

	.et {
		font-size: 14px;
		opacity: 0.9;
	}

	.complete-button {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 28px;
		height: 28px;
		border: 2px solid rgba(255, 255, 255, 0.5);
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.2);
		color: transparent;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.complete-button:hover {
		background-color: rgba(255, 255, 255, 0.4);
		border-color: rgba(255, 255, 255, 0.8);
		transform: scale(1.1);
	}

	.complete-button.completed {
		background-color: #33d9b2;
		border-color: #33d9b2;
		color: white;
	}

	.complete-button.completed:hover {
		background-color: #2ecc9d;
		border-color: #2ecc9d;
	}
</style>
