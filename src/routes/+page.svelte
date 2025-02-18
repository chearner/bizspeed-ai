<script lang="ts">
	import { Heading, P, Button, Span, Mark, Img } from 'flowbite-svelte';
	import { Section, HeroHeader, News } from 'flowbite-svelte-blocks';
	let playbackRate = 1.0;
	import Feature from '$components/Feature.svelte';
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

<div class="mx-4 flex flex-col text-center sm:mb-16 lg:mx-32">
	<Section name="feature">
		<News classA="p-2" href="/scan">
			<span class="mr-3 rounded-full bg-primary-600 px-4 py-1.5 text-xs text-white">New</span>
			<span class="text-sm font-medium">BizSpeed AI is now available!</span>
		</News>
	</Section>
	<Heading tag="h1" class="mb-6" customSize="font-extrabold text-4xl md:text-5xl lg:text-6xl"
		>Achieve <Span
			gradient
			gradientClass="text-transparent bg-clip-text bg-gradient-to-r to-primary-900 from-primary-600"
			>maximum efficiency</Span
		> in fuel, lubricant, and chemical distribution.</Heading
	>
	<P class="mb-6 px-4 text-lg lg:px-16 lg:text-xl dark:text-gray-400"
		>Modern cloud-based UI Native iOS and Android mobile apps US-based support</P
	>
	<P class="mb-6 px-4 text-lg lg:px-16 lg:text-xl dark:text-gray-400">
		Set new standards for customer service and profitability in your market using BizSpeed’s mobile
		software solutions for routing, dispatch, and delivery.
	</P>
	<Feature />
</div>
<Section name="logos">
	<HeroHeader>
		<svelte:fragment slot="h2"
			><Mark>Trusted</Mark> by the nation’s leading distributors.</svelte:fragment
		>
		<div
			class="grid grid-cols-2 gap-8 pt-16 text-gray-500 sm:gap-12 md:grid-cols-3 lg:grid-cols-6 dark:text-gray-400"
		>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/boswell-oil-logo.webp" alt="Boswell Oil" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/flyers-energy-logo.webp" alt="Flyers Energy" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/jacobus-energy.png" alt="Jacobus Energy" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/mcpherson-mop-logo.png" alt="McPherson Mop" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/tilley-distrib-logo.png" alt="Tilley Distribution" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/boswell-oil-logo.webp" alt="Boswell Oil" />
			</a>
		</div></HeroHeader
	>
</Section>

<style>
</style>
