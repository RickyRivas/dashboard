<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/Logo.svelte';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import NavigationSettingsDropdown from './NavigationSettingsDropdown.svelte';
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

	let isProtectedRoute = $derived(findRouteInfo(currentPagePath)?.group === 'protected');

	let minimize = $state(true);
</script>

<header id="main-nav" class={navType} class:minimize>
	<div class="container">
		<div class="logo-flag">
			<a id="logo" href="/"> <Logo /> </a>
		</div>

		{#if navType === 'protected' && routes[0] && routes[0].children}
			<nav>
				<ul class:active={isActive}>
					{#each routes[0].children as childRoute}
						{#if childRoute.path === '/app' || childRoute.path === '/settings'}
							<li class:active={currentPagePath === childRoute.path}>
								<a
									id={childRoute.name.toLowerCase().replaceAll(' ', '-')}
									class:active={currentPagePath === childRoute.path}
									href={childRoute.path}
								>
									<svg
										aria-hidden="true"
										role="img"
										class="icon"
										xmlns="http://www.w3.org/2000/svg"
										width="44"
										height="44"
										fill="none"
										viewBox="0 0 44 44"
									>
										{#if childRoute.iconPath}
											<path fill="currentColor" d={childRoute.iconPath} />
										{:else}
											<path
												fill="currentColor"
												d="M23.765 11.774a2.824 2.824 0 1 0-3.53 0l-4.83 7.598a2.26 2.26 0 0 1-3.263.593l-4.201-3.142a2.824 2.824 0 1 0-5.148-1.603 2.826 2.826 0 0 0 2.768 2.824l2.302 15.359a4.52 4.52 0 0 0 4.47 3.848h19.334a4.52 4.52 0 0 0 4.47-3.848l2.302-15.359a2.826 2.826 0 0 0-.056-5.649 2.824 2.824 0 0 0-2.324 4.428l-4.194 3.15a2.26 2.26 0 0 1-3.263-.594l-4.837-7.605Z"
											/>
										{/if}
									</svg>
									<span class="cta">{childRoute.name}</span>
								</a>
							</li>
						{:else}
							<li class:active={currentPagePath.startsWith(childRoute.path)}>
								<a
									id={childRoute.name.toLowerCase().replaceAll(' ', '-')}
									class:active={currentPagePath.startsWith(childRoute.path)}
									href={childRoute.path}
								>
									<svg
										aria-hidden="true"
										role="img"
										class="icon"
										xmlns="http://www.w3.org/2000/svg"
										width="44"
										height="44"
										fill="none"
										viewBox="0 0 44 44"
									>
										{#if childRoute.iconPath}
											<path fill="currentColor" d={childRoute.iconPath} />
										{:else}
											<path
												fill="currentColor"
												d="M23.765 11.774a2.824 2.824 0 1 0-3.53 0l-4.83 7.598a2.26 2.26 0 0 1-3.263.593l-4.201-3.142a2.824 2.824 0 1 0-5.148-1.603 2.826 2.826 0 0 0 2.768 2.824l2.302 15.359a4.52 4.52 0 0 0 4.47 3.848h19.334a4.52 4.52 0 0 0 4.47-3.848l2.302-15.359a2.826 2.826 0 0 0-.056-5.649 2.824 2.824 0 0 0-2.324 4.428l-4.194 3.15a2.26 2.26 0 0 1-3.263-.594l-4.837-7.605Z"
											/>
										{/if}
									</svg>
									<span class="cta">{childRoute.name}</span>
								</a>
							</li>
						{/if}
					{/each}
				</ul>
			</nav>
		{/if}

		<div class="mod">
			{#if navType === 'public'}
				<nav>
					<ul class:active={isActive}>
						{#if session}
							<li>
								<a href="/app" class="btn">Dashboard</a>
							</li>
						{:else}
							<li>
								<a href="/login" class="btn">Log In</a>
							</li>
							<li>
								<a href="/register" class="btn">Register</a>
							</li>
						{/if}
					</ul>
				</nav>
			{/if}

			<!-- if protected, toggle will be in list :) -->
			{#if navType === 'protected'}
				<NavigationSettingsDropdown
					name={page.data.profile.full_name}
					email={page.data.session?.user.email}
					avatarUrl={page.data.profile.avatar_url}
					onlogout={logout}
				/>
				<button
					class="collapse-toggle btn"
					aria-label="collapse/expand menu"
					class:minimize
					onclick={() => (minimize = !minimize)}
				>
				</button>
			{:else}
				<ThemeToggle />
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
