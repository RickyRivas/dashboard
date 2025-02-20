<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/Logo.svelte';
	import { navigationRoutes } from '$lib/navigation';

	interface navProps {
		navType: 'protected' | 'public';
	}

	let isActive = $state(false);
	const toggleNav = () => (isActive = !isActive);
	const logout = async () => await page.data.supabase.auth.signOut();

	const session = $derived(page.data.session);
	let { navType }: navProps = $props();
	let routes =
		navType === 'protected' ? navigationRoutes.protectedRoutes : navigationRoutes.publicRoutes;
</script>

<header id="main-nav">
	<div class="container">
		<a id="logo" href="/"> <Logo /> </a>

		<div class="mod">
			<nav>
				<ul class:active={isActive}>
					{#each routes as route}
						<li>
							<a id={route.name.toLowerCase()} href={route.path}>{route.name}</a>
						</li>
					{/each}
				</ul>
			</nav>

			{#if navType === 'protected'}
				<button onclick={logout} class="btn">Logout</button>
				{#if page.data.profile.avatar_url}
					<div class="small-avatar">
						<img
							src={page.data.profile.avatar_url}
							alt={page.data.profile.full_name}
							width="40"
							height="40"
						/>
					</div>
				{/if}
			{/if}

			{#if navType === 'public'}
				{#if session}
					<a href="/app" class="btn">Dashboard</a>
				{:else}
					<a href="/login" class="btn">Log In</a>
					<span class="divider">|</span>
					<a href="/register" class="btn">Register</a>
				{/if}
			{/if}

			<button
				id="nav-toggle"
				aria-label="Toggle"
				class:active={isActive}
				aria-expanded={isActive}
				onclick={toggleNav}
			>
				<span />
				<span />
				<span />
			</button>
		</div>
	</div>
</header>
