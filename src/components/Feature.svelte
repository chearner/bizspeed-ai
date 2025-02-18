<script lang="ts">
	import { Heading, P, Button } from 'flowbite-svelte';
	import { InfoCircleOutline, FileLinesOutline } from 'flowbite-svelte-icons';
	import { Section, Cta, News } from 'flowbite-svelte-blocks';
</script>

<div class="mx-4 flex flex-col rounded-lg border-2 px-4 py-4">
	<Section name="cta">
		<Cta class="text-left">
			<Heading tag="h2">Scan and store your BOL documents.</Heading>
			<P class="my-4 font-light text-gray-500 md:text-lg dark:text-gray-400">
				BizSpeed's AI-powered document scanner can instantly and intelligently digitize your BOL
				(Bill of Lading) documents. Simply snap a photo and our solution will automatically extract
				the BOL number and other key information, securely storing it in your account for easy
				access and management. Streamline your documentation process and say goodbye to manual data
				entry.
			</P>
			<div class="flex flex-wrap items-center gap-4">
				<Button href="/scan" color="primary" size="lg"
					><FileLinesOutline class="-ml-1 mr-2" size="sm" />
					Get started
				</Button>
				<Button href="/scan" color="light" size="lg"
					><InfoCircleOutline class="-ml-1 mr-2" size="sm" />
					Learn more
				</Button>
			</div>
		</Cta>
	</Section>
</div>

<style></style>
