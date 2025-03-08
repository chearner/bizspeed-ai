<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Settings" />
</svelte:head>

<Section sectionClass="flex w-full flex-col p-4">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>Settings</Heading
	>
	<P>My settings.</P>
</Section>
