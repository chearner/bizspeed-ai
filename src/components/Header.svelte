<script lang="ts">
	import {
		Avatar,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		DarkMode,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Modal
	} from 'flowbite-svelte';
	import { UserCircleOutline, UserSettingsOutline, CogOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import { quintOut, sineIn, sineOut } from 'svelte/easing';
	import BizSpeedLogo from '$lib/images/bizspeed-logo.svelte';
	import { page, navigating } from '$app/state';
	import { user } from '$lib/auth';
	import { onMount } from 'svelte';

	let scrolled = false;
	let logoHeight: number = 31;
	let logoWidth: number = 159;

	let hideNavMenu = $state(true);

	$effect(() => {
		if (navigating.complete) {
			hideNavMenu = true;
		}
	});

	let activeUrl = $derived(page.url.pathname);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > window.innerHeight;
			logoHeight = scrolled ? 31 : 31;
			logoWidth = scrolled ? 159 : 159;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	let modalopen = $state(true);
</script>

<Navbar class="border-b border-gray-300 bg-gray-100 dark:border-gray-500 dark:bg-gray-800">
	<NavBrand href="/" class="flex-1">
		<BizSpeedLogo
			height={scrolled ? logoHeight : logoHeight}
			width={scrolled ? logoWidth : logoWidth}
		/>
	</NavBrand>
	<Avatar
		id="avatar-menu"
		data-name={$user?.email}
		src="./src/lib/images/hobbes.webp"
		border
		class="md:order-last"
	/>
	<Dropdown
		placement="bottom"
		arrow={false}
		transition={fade}
		params={{ delay: 100, duration: 200, easing: quintOut }}
		trigger="click"
		triggeredBy="#avatar-menu"
	>
		<DropdownHeader>
			<div class="text-sm font-bold">Username:</div>
			<div class="truncate text-sm font-medium">{$user?.email}</div>
		</DropdownHeader>
		<DropdownItem class="flex items-center gap-2"
			><UserCircleOutline size="sm" /><a href="/account">Account</a></DropdownItem
		>
		<DropdownItem class="flex items-center gap-2"
			><CogOutline size="sm" /><a href="/account/settings">Settings</a></DropdownItem
		>
		<DropdownItem class="flex items-center gap-2"
			><UserCircleOutline size="sm" /><a href="/account/sign-out">Sign Out</a></DropdownItem
		>
		<DropdownItem class="flex items-center gap-2"
			><DarkMode btnClass="text-sm" size="sm" color="primary" /> Dark Mode</DropdownItem
		>
	</Dropdown>
	<NavHamburger class="" />
	<NavUl class="">
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/solutions">Solutions</NavLi>
		<NavLi href="/industries">Industries</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
</Navbar>

<style></style>
