<script lang="ts">
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Heading, Checkbox, Label, Input } from 'flowbite-svelte';
	import { MailBoxOutline, LockOpenOutline } from 'flowbite-svelte-icons';
	import { supabase } from '$lib/supabase';
	import { loading } from '$lib/stores';

	let email = '';
	let password = '';
	let error = '';
	let successMessage = '';

	async function signOut() {
		await supabase.auth.signOut();
		email = '';
		password = '';
		window.location.href = '/';
	}
</script>

<svelte:head>
	<title>Sign Out</title>
	<meta name="description" content="Sign Out" />
</svelte:head>

<Section name="none" sectionClass="p-4">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>Sign Out</Heading
	>
	{#if error}
		<div class="alert alert-error mb-4">
			<span>{error}</span>
		</div>
	{/if}
	{#if successMessage}
		<div class="alert alert-success mb-4">
			<span>{successMessage}</span>
		</div>
	{/if}
	<Register href="/" class="bg-yellow-500">
		<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
			<form class="flex flex-col space-y-6" action="/">
				<Button type="submit">Sign out</Button>
			</form>
		</div>
	</Register>
</Section>
