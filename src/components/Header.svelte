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
		DropdownDivider
	} from 'flowbite-svelte';
	import { UserCircleOutline, UserSettingsOutline, CogOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import { sineIn, sineOut } from 'svelte/easing';
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
</script>

<Navbar class="border-b border-gray-300 bg-gray-100 dark:border-gray-500 dark:bg-gray-800">
	<div class="flex w-1/3">
		<NavBrand href="/">
			<BizSpeedLogo
				height={scrolled ? logoHeight : logoHeight}
				width={scrolled ? logoWidth : logoWidth}
			/>
		</NavBrand>
	</div>
	<NavUl
		hidden={hideNavMenu}
		{activeUrl}
		divClass="flex w-1/3 justify-center p-4"
		activeClass="text-primary-800 dark:text-primary-100"
		nonActiveClass="text-gray-800 dark:text-gray-100"
	>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/solutions">Solutions</NavLi>
		<NavLi href="/industries">Industries</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
	<div class="flex w-1/3 justify-end">
		<Avatar
			id="avatar-menu"
			class="md:order-1 md:flex"
			data-name={$user?.email}
			src="./src/lib/images/hobbes.webp"
			border
		/>
		<Dropdown
			placement="bottom"
			arrow={false}
			transition={fade}
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
				><UserCircleOutline size="sm" /><a href="/account/signout">Sign Out</a></DropdownItem
			>
			<DropdownItem class="flex items-center gap-2"
				><DarkMode btnClass="text-sm" size="sm" color="primary" /> Dark Mode</DropdownItem
			>
		</Dropdown>
		<NavHamburger onclick={() => (hideNavMenu = false)} />
	</div>
</Navbar>

<style></style>
