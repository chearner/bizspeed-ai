<script lang="ts">
	import { Card, Heading, P } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { ArrowUpRightFromSquareOutline, GiftBoxSolid } from 'flowbite-svelte-icons';
</script>

<svelte:head>
	<title>My Account</title>
	<meta name="description" content="My Account" />
</svelte:head>

<Section name="none" sectionClass="p-4">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>Account</Heading
	>
	<div class="flex flex-col gap-4">
		<Card>
			<GiftBoxSolid class="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400" />
			<a href="/">
				<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
					Images
				</h5>
			</a>
			<p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Manage your imagesf:</p>
			<a
				href="/files?tableName=tbl_images&imageTypeId=1"
				class="inline-flex items-center text-primary-600 hover:underline"
			>
				Image Manager
				<ArrowUpRightFromSquareOutline class="ms-2.5 h-4 w-4" />
			</a>
		</Card>
	</div>
</Section>
