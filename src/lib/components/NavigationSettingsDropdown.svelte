<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';

	let { name, email, avatarUrl, onlogout } = $props();
	let active = $state(false);
</script>

<div class="settings-dropdown" class:active>
	<button
		class="settings-dropdown-toggle"
		onclick={() => (active = !active)}
		aria-label="click to view options"
		aria-expanded={active}
	>
		<div class="avatar">
			<img src={avatarUrl} alt={name} width="40" height="40" />
		</div>
		<div class="info">
			<span class="name">{name}</span>
			<span class="email">{email}</span>
		</div>
	</button>
	<div class="settings-dropdown-list">
		<ul>
			<li>
				<ThemeToggle />
			</li>
			<li>
				<a href="/settings/profile" class="btn">Profile Settings</a>
			</li>
			<li>
				<a href="/settings/billing" class="btn">Billing Settings</a>
			</li>
			<li>
				<button class="btn" onclick={onlogout}>Log Out</button>
			</li>
		</ul>
	</div>
</div>

<style lang="less">
	.settings-dropdown {
		position: relative;
		display: block;
		width: 100%;
		z-index: 100;

		&-toggle {
			background: none;
			display: flex;
			align-items: center;
			width: 100%;
			text-align: left;
			font: inherit;
			border: none;
			padding: 0;
			margin: 0;
			color: var(--text);
			// background-color: slateblue;
			gap: 10px;
			background-color: transparent;
			border: 1px solid transparent;
			border-radius: var(--border-radius);
			padding: 0.25em 0.25em;
			overflow: hidden;
			transition:
				background-color 0.33s ease-in-out,
				border-color 0.33s ease-in-out;

			.info {
				transition: opacity 0.33s ease-in-out;
			}
			.name,
			.email {
				display: none;
				text-overflow: ellipsis;
				font-size: 12px;
				line-height: 16px;
				width: 100%;

				@media only screen and (min-width: 1024px) {
					display: block;
				}
			}

			.name {
				font-weight: bold;
				font-size: 13px;
			}
			.avatar {
				width: 27px;
				height: 27px;
				border: 1px solid transparent;
				flex-shrink: 0;
				position: relative;
				border-radius: 50%;
				overflow: hidden;
				transition:
					border-color 0.33s ease-in-out,
					transform 0.1s ease-in-out;

				img {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					width: 100%;
					object-fit: cover;
				}
			}

			&:hover {
				border-color: var(--primary);
				background-color: var(--secondary);
				.avatar {
					border-color: var(--text);
				}
			}
		}

		&-list {
			position: absolute;
			top: calc(100% + 0.5em);
			right: 0;
			background-color: var(--secondary);
			padding: 1em;
			width: auto;
			transition:
				transform 0.33s ease-in-out,
				opacity 0.33s ease-in-out;
			border-radius: var(--border-radius);
			border: 1px solid var(--primary);

			opacity: 0;
			pointer-events: none;
			transform: translate(0, -10px);
			visibility: hidden;

			@media only screen and (min-width: 1024px) {
				bottom: calc(100% + 0.5em);
				top: auto;
				right: auto;
				width: 100%;
			}

			ul {
				margin: 0;
				list-style: none;
				display: flex;
				flex-direction: column;
				gap: 0.5em;

				button,
				a {
					text-align: left;
					width: 100%;
					white-space: nowrap;
				}
			}
		}

		&.active {
			.settings-dropdown-toggle {
				border-color: var(--primary);
				background-color: var(--secondary);
			}
			.settings-dropdown-list {
				opacity: 1;
				pointer-events: all;
				transform: translate(0, 0px);
				visibility: visible;
			}
			.avatar {
				border-color: var(--text);
			}
		}
	}
</style>
