<script lang="ts">
	let playbackRate = 1.0;
	import Feature from '$lib/Feature.svelte';
</script>

<svelte:head>
	<title>BizSpeed</title>
	<meta
		name="description"
		content="BizSpeed AI - Last Mile Delivery and Distribution Accelerator Platform"
	/>
</svelte:head>

<!--
<video bind:playbackRate muted loop class="fixed bottom-0 left-0 right-0 top-0 z-[-1]">
	<source src="./src/lib/videos/traffic.mp4" type="video/mp4" />
</video>
-->
<div class="flex flex-col items-center">
	<section class="flex w-1/2 flex-row justify-center gap-5 p-10">
		<Feature />
		<Feature />
	</section>
	<section class="flex w-1/2 flex-row justify-center gap-5 p-10">
		<Feature />
		<Feature />
	</section>
</div>

<style>
</style>
