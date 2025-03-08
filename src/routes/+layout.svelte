<script lang="ts">
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import '../app.css';
	import { user } from '$lib/auth';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { loading } from '$lib/stores';
	import { BullhornOutline } from 'flowbite-svelte-icons';
	import { Breadcrumb, BreadcrumbItem, Spinner, Banner } from 'flowbite-svelte';

	let showCamera = false;
	let showHistory = false;
	let showInstallPrompt = false;
	let deferredPrompt: any = null;
	let { children } = $props();
	let breadcrumbSegments = $derived(page.url.pathname.split('/').filter(Boolean));

	$effect(() => {
		if (breadcrumbSegments) {
			//console.log(breadcrumbSegments);
		}
	});

	onMount(() => {
		// Handle PWA install prompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstallPrompt = true;
		});

		// Handle URL parameters for PWA shortcuts
		const params = new URLSearchParams(window.location.search);
		const action = params.get('action');
		if (action === 'scan' && $user) {
			showCamera = true;
		} else if (action === 'history' && $user) {
			showHistory = true;
		}
	});

	async function installPWA() {
		if (!deferredPrompt) return;

		showInstallPrompt = false;
		deferredPrompt.prompt();

		const { outcome } = await deferredPrompt.userChoice;
		console.log(`User ${outcome} the PWA installation`);
		deferredPrompt = null;
	}
</script>

<Header />
<main class="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-800">
	<Breadcrumb class="m-4" aria-label="Default breadcrumb example">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		{#if breadcrumbSegments.length}
			{#each breadcrumbSegments as segment}
				<BreadcrumbItem href={`/${segment}`} class="capitalize"
					>{segment.replace(/-/g, ' ')}</BreadcrumbItem
				>
			{/each}
		{/if}
	</Breadcrumb>
	{#if showInstallPrompt}
		<div class="alert alert-info mb-4 flex items-center justify-between">
			<span>Install app for better experience</span>
			<button class="btn btn-primary btn-sm" onclick={installPWA}> Install </button>
		</div>
	{/if}
	{@render children()}
</main>
<Footer />

<Banner id="bottom-banner" position="sticky" bannerType="bottom">
	<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
		<span class="me-3 inline-flex rounded-full bg-gray-200 p-1 dark:bg-gray-600">
			<BullhornOutline class="h-3 w-3 text-gray-500 dark:text-gray-400" />
			<span class="sr-only">Light bulb</span>
		</span>
		<span>
			MobileHub classic user can migrate to MobileHub 2.0! <a
				href="https://bizspeed.com"
				class="inline font-medium text-primary-600 underline decoration-solid decoration-2 underline-offset-2 hover:no-underline dark:text-primary-500 dark:decoration-1"
			>
				Contact us for more information
			</a>
		</span>
	</p>
</Banner>

<style></style>
