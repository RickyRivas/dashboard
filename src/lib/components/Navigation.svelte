<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/Logo.svelte';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import BuildTracker from '$lib/app-components/BuildTracker.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	interface navProps {
		navType: 'protected' | 'public';
		routes: RouteInfo[];
	}

	let isActive = $state(false);
	const toggleNav = () => (isActive = !isActive);
	const logout = async () => await page.data.supabase.auth.signOut();

	const session = $derived(page.data.session);
	let { navType, routes }: navProps = $props();

	let currentPagePath = $derived(page.url.pathname);
	// let protectedRoute = $derived(findRouteInfo(currentPagePath)?.group === 'protected');
</script>

<header id="main-nav">
	<div class="container">
		<a id="logo" href="/"> <Logo /> </a>

		<div class="mod">
			{#if navType === 'protected'}
				<BuildTracker />
			{/if}

			<nav>
				<ul class:active={isActive}>
					{#each routes as route}
						<li class:active={currentPagePath.startsWith(route.path)}>
							<a id={route.name.toLowerCase()} href={route.path}>{route.name}</a>
						</li>
					{/each}
				</ul>
			</nav>

			{#if navType === 'protected'}
				<button onclick={logout} class="btn">Logout</button>
				{#if page.data.profile}
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
			{/if}

			{#if navType === 'public'}
				{#if session}
					<a href="/app" class="btn">Dashboard</a>
				{:else}
					<a href="/login" class="btn">Log In</a>
					<a href="/register" class="btn">Register</a>
				{/if}
			{/if}

			<ThemeToggle />

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
