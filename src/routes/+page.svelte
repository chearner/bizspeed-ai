<script lang="ts">
	import { Heading, P, Span, Mark, Img, Select, Label } from 'flowbite-svelte';
	import { Section, HeroHeader, News, FeatureDefault, FeatureItem } from 'flowbite-svelte-blocks';
	import {
		DollarOutline,
		MapPinAltOutline,
		TruckOutline,
		DatabaseOutline,
		PaperPlaneOutline,
		UsersOutline
	} from 'flowbite-svelte-icons';
	let playbackRate = 1.0;
	import CardScanBOL from '$components/CardScanBOL.svelte';
	import CardScanMeter from '$components/CardScanMeter.svelte';
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
	<Section name="none" sectionClass="pb-8">
		<News classA="p-2" href="/scan">
			<span class="relative mr-3 rounded-full bg-primary-600 px-3 py-1 text-sm text-white">
				<span
					class="absolute inset-0 z-[1] animate-[ping_3s_cubic-bezier(0,0,0.1,2)_infinite] rounded-full bg-primary-600 opacity-50"
				></span>
				New
			</span>
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
	<P class="mb-6 px-4 text-lg dark:text-gray-400 lg:px-16 lg:text-xl"
		>Modern cloud-based UI Native iOS and Android mobile apps US-based support</P
	>
	<P class="mb-12 px-4 text-lg dark:text-gray-400 lg:px-16 lg:text-xl">
		Set new standards for customer service and profitability in your market using BizSpeed’s mobile
		software solutions for routing, dispatch, and delivery.
	</P>
	<div class="grid grid-cols-1 place-items-center items-start gap-4 sm:grid-cols-2">
		<CardScanBOL />
		<CardScanMeter />
	</div>
</div>
<Section name="logos">
	<HeroHeader>
		<svelte:fragment slot="h2"
			><Mark>Trusted</Mark> by the nation’s leading distributors.</svelte:fragment
		>
		<div
			class="grid grid-cols-2 gap-8 pb-16 text-gray-500 dark:text-gray-400 sm:gap-12 md:grid-cols-3 lg:grid-cols-6"
		>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/boswell-oil-logo.webp" alt="Boswell Oil" class="max-w-24" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/flyers-energy-logo.webp" alt="Flyers Energy" class="max-w-24" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/jacobus-energy.png" alt="Jacobus Energy" class="max-w-24" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/mcpherson-mop-logo.png" alt="McPherson Mop" class="max-w-24" />
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img
					src="./src/lib/images/tilley-distrib-logo.png"
					alt="Tilley Distribution"
					class="max-w-24"
				/>
			</a>
			<a href="/" class="flex items-center justify-center grayscale">
				<Img src="./src/lib/images/boswell-oil-logo.webp" alt="Boswell Oil" class="max-w-24" />
			</a>
		</div></HeroHeader
	>
</Section>
<Section name="feature">
	<HeroHeader
		class="mx-auto mb-8 max-w-screen-md text-center lg:mb-16"
		h2Class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white w-full"
		pClass="text-gray-500 sm:text-xl dark:text-gray-400"
	>
		<svelte:fragment slot="h2"
			><Mark>Shatter your limitations</Mark> with BizSpeed’s suite of bulk delivery software solutions</svelte:fragment
		>
		<svelte:fragment slot="paragraph"
			>We believe your capacity for success shouldn’t be defined by paper’s limitations. BizSpeed’s
			software gives every fuel, lubricant, and chemical distributor access to the advantages of
			mobile technology.</svelte:fragment
		>
	</HeroHeader>
	<FeatureDefault
		divClass="grid grid-cols-1 gap-8 mx-auto mb-8 max-w-screen-md lg:mb-16 lg:grid-cols-3"
	>
		<FeatureItem class="h-16 w-16 dark:bg-primary-800 lg:h-16 lg:w-16 ">
			<svelte:fragment slot="icon"
				><TruckOutline size="xl" class="text-primary-600 dark:text-primary-100" /></svelte:fragment
			>
			<svelte:fragment slot="h3">goRoam: Dipatch</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Centralize dispatch and hold drivers accountable.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem class="h-16 w-16 dark:bg-primary-800 lg:h-16 lg:w-16 ">
			<svelte:fragment slot="icon"
				><UsersOutline size="xl" class="text-primary-600 dark:text-primary-100" /></svelte:fragment
			>
			<svelte:fragment slot="h3">goRoam: Delivery</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Empower drivers to provide great customer service.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem class="h-16 w-16 dark:bg-primary-800 lg:h-16 lg:w-16 ">
			<svelte:fragment slot="icon"
				><MapPinAltOutline
					size="xl"
					class="text-primary-600 dark:text-primary-100"
				/></svelte:fragment
			>
			<svelte:fragment slot="h3">Route Builder</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Set delivery routes with unparalleled efficiency.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem class="h-16 w-16 dark:bg-primary-800 lg:h-16 lg:w-16">
			<svelte:fragment slot="icon"
				><DatabaseOutline
					size="xl"
					class="text-primary-600 dark:text-primary-100"
				/></svelte:fragment
			>
			<svelte:fragment slot="h3">Tank Forecasting</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Monitor tank levels remotely and improve delivery efficiency by 30% or more.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem class="h-16 w-16 dark:bg-primary-800 lg:h-16 lg:w-16 ">
			<svelte:fragment slot="icon"
				><UsersOutline size="xl" class="text-primary-600 dark:text-primary-100" /></svelte:fragment
			>
			<svelte:fragment slot="h3">3rd Party Logistics (3PL)</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Maintain consistent standards by giving 3rd party carriers access to your software.</svelte:fragment
			>
		</FeatureItem>
	</FeatureDefault>
</Section>

<style>
</style>
