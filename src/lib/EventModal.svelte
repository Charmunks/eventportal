<script>
	export let event;
	export let closeModal;
</script>

<div class="modal-overlay" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0">
	<div class="modal-content" style="background-color: {event.color}; color: {event.textColor};" on:click={(e) => e.stopPropagation()} on:keydown={(e) => e.stopPropagation()} role="dialog" tabindex="0">
		<button class="close-button" on:click={closeModal}>✕</button>
		<div class="modal-header">
			<div class="modal-icon" style="background-color: {event.color};">
				<img src={event.icon} alt="{event.title} icon" class="modal-icon-img" />
			</div>
			<h2 style="color: {event.textColor};">{event.title}</h2>
			<span class="type-badge">{event.type}</span>
		</div>
		<div class="modal-body">
			<div class="detail-row description" style="color: {event.textColor};">
				{event.description}
			</div>
			<div class="detail-row" style="color: {event.textColor};">
			<strong style="color: {event.textColor};">Estimated time:</strong>	{event.et}
			</div>
			<div class="detail-row" style="color: {event.textColor};">
				<strong style="color: {event.textColor};">Difficulty:</strong> {event.difficulty}
			</div>
			<div class="button-row">
				<a href="{event.link}" class="button" style="background-color: {event.buttonColor}; color: {event.buttonTextColor};" target="_blank" rel="noopener noreferrer">Learn more</a>
				<a href="{event.guide}" class="button" style="background-color: {event.buttonColor}; color: {event.buttonTextColor};" target="_blank" rel="noopener noreferrer"> Tutorial Slideshow</a>

			</div>
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
		max-height: 80vh;
		overflow-y: auto;
		position: relative;
		animation: slideUp 0.3s ease;
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
		margin-bottom: 32px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	.modal-icon {
		width: 100px;
		height: 100px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
	}

	.modal-icon-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.modal-header h2 {
		color: #1f2d3d;
		font-size: 36px;
		margin: 0;
		padding-right: 40px;
		font-weight: 900;
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.detail-row {
		font-size: 18px;
		line-height: 1.6;
	}

	.detail-row.description {
		font-weight: 700;
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

	.button-row {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}

	.button {
		display: inline-block;
		flex: 1;
		text-align: center;
		background: #ec3750;
		color: #ffffff;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: bold;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.button:hover {
		background: #d63447;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(236, 55, 80, 0.3);
	}
</style>
