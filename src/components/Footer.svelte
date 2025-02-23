<script lang="ts">
	import { Section } from 'flowbite-svelte-blocks';
	import {
		P,
		Footer,
		FooterCopyright,
		FooterLinkGroup,
		FooterLink,
		FooterBrand,
		FooterIcon
	} from 'flowbite-svelte';
	import { FacebookSolid, GithubSolid, DiscordSolid, TwitterSolid } from 'flowbite-svelte-icons';
	import BizSpeedLogo from '$lib/images/bizspeed-logo.svelte';
	import Page from '../routes/+page.svelte';
</script>

<Footer class="m-4">
	<div class="mx-auto max-w-screen-xl text-center">
		<P class="my-6 text-center text-gray-500 dark:text-gray-400">
			Dispatch & Routing, Fuel, Lubricants & Chemicals Delivery, Tank Forecasting and 3rd Party
			Logistics Software
		</P>
		<FooterLinkGroup
			ulClass="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white"
		>
			<FooterLink href="/about">About</FooterLink>
			<FooterLink href="/privacy">Privacy Policy</FooterLink>
			<FooterLink href="/support">Support</FooterLink>
			<FooterLink href="/contact">Contact</FooterLink>
		</FooterLinkGroup>
		<FooterCopyright href="/" by="BizSpeed" year={2025} />
	</div>
</Footer>
