<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
	import Footer from '../components/Footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Navbar />
<main class="flex justify-center">
	{@render children()}
</main>
<Footer />

<style></style>
