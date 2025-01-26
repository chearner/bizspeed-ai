<script lang="ts">
	import { page } from '$app/state';
	import BizSpeedLogoBlue from '$lib/images/bizspeed-logo-blue.svelte';
</script>

<header>
	<div class="corner">
		<a href="https://bizspeed.com">
			<BizSpeedLogoBlue />
		</a>
	</div>
	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
		</ul>
	</nav>
</header>

<style></style>
