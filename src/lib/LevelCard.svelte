<script>
	let { currentLevel = 'Bronze', onLevelChange, clubShips} = $props();
	
	const levels = ['level 1', 'level 2', 'level 3'];
	let selectedLevel = $state(currentLevel);
	
	function selectLevel(level) {
		selectedLevel = level;
		if (onLevelChange) {
			onLevelChange(level);
		}
	}
	
	function getLevelIndex(level) {
		return levels.indexOf(level);
	}
	
	function isCurrentLevel(level) {
		return getLevelIndex(level) === getLevelIndex(currentLevel);
	}
	
	function isPastLevel(level) {
		return getLevelIndex(level) < getLevelIndex(currentLevel);
	}

	function shipsLeft(total, level) {
		var amount = total - clubShips
		if (amount < 0 || currentLevel == level){
			return "You have reached this level!"
		} else {
		    return `Ship projects ${amount} more times to reach this level!`
		}
	}
	

</script>

<div class="level-selector">
	<div class="timeline">
		{#each levels as level, index}
			<div class="timeline-item">
				<button 
					class="level-indicator {selectedLevel === level ? 'active' : ''}"
					onclick={() => selectLevel(level)}
					aria-label="Select {level} level"
				>
					<div class="circle"></div>
				</button>
				<span class="level-label">Level {index + 1}</span>
			</div>
			{#if index < levels.length - 1}
				<div class="timeline-line"></div>
			{/if}
		{/each}
	</div>

	<div class="arrow">→</div>

	<div class="perks-box">
	
			<h3 class="perks-title">Club Level: {selectedLevel.split(' ')[1]}</h3>
			<div class="perks-content">
				{#if selectedLevel === 'level 1'}
					<p>This is the base level for clubs. Your club is added to our directory and you are eligible to participate in Hack Club programs or use Hack Club Branding. You also receive support from our team and a weekly emailed newsletter.</p>
				{:else if selectedLevel === 'level 2'}
					<p>The second level for clubs. You receive all the perks offered in level 1, as well as monthly promotional packages containing posters and other items to help promote your club, as well as free stickers to hand out at your club meetings.</p>
					<p class="ships-left">{shipsLeft(4, selectedLevel)}</p>
				{:else if selectedLevel === 'level 3'}
					<p>The third and final club level. You receive all the perks offered in level 1 and 2, as well as more perks (TBD)</p>
					<br>
					<p class="ships-left">{shipsLeft(8, selectedLevel)}</p>

				{/if}
			</div>
	</div>
</div>

<style>
	.level-selector {
		display: flex;
		align-items: center;
		gap: 32px;
		padding: 24px;
		background: #f9fafc;
		border-radius: 12px;
		border: 2px solid #e5e7eb;
		margin-bottom: 24px;
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 120px;
	}

	.timeline-item {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.level-indicator {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		z-index: 2;
	}

	.circle {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 3px solid #6b7280;
		background: white;
		transition: all 0.2s;
	}

	.level-indicator.active .circle {
		background: #10b981;
		border-color: #10b981;
		box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
	}

	.level-indicator:hover .circle {
		border-color: #ec3750;
		transform: scale(1.1);
	}

	.level-indicator.active:hover .circle {
		border-color: #10b981;
	}

	.level-label {
		font-size: 16px;
		font-weight: 600;
		color: #1f2d3d;
	}

	.timeline-line {
		width: 3px;
		height: 40px;
		background: #e5e7eb;
		margin-left: 10px;
	}

	.arrow {
		font-size: 32px;
		color: #6b7280;
		flex-shrink: 0;
	}

	.perks-box {
		flex: 1;
		background: white;
		border: 2px solid #1f2d3d;
		border-radius: 8px;
		padding: 24px;
		min-height: 200px;
		transition: all 0.3s;
	}

	.perks-box.future {
		background: #f3f4f6;
		border-color: #d1d5db;
		opacity: 0.6;
	}

	.locked-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 150px;
		text-align: center;
	}

	.locked-title {
		font-size: 24px;
		font-weight: bold;
		color: #6b7280;
		margin: 0 0 12px 0;
	}

	.locked-text {
		font-size: 16px;
		color: #9ca3af;
		margin: 0;
		font-weight: 500;
	}

	.perks-title {
		font-size: 24px;
		font-weight: bold;
		color: #1f2d3d;
		margin: 0 0 16px 0;
	}

	.perks-subtitle {
		font-size: 18px;
		font-weight: 600;
		color: #1f2d3d;
		margin: 0 0 12px 0;
	}

	.perks-content {
		line-height: 1.6;
	}

	.ships-left {
		margin-top: 24px;
		font-weight: bold;
	}

	.perks-content p {
		margin: 0;
	}

	@media (max-width: 768px) {
		.level-selector {
			flex-direction: column;
			gap: 24px;
		}

		.timeline {
			flex-direction: row;
			min-width: auto;
		}

		.timeline-line {
			width: 40px;
			height: 3px;
			margin-left: 0;
		}

		.arrow {
			transform: rotate(90deg);
		}
	}
</style>
