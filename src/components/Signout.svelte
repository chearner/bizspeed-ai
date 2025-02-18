<script lang="ts">
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
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

<Section sectionClass="max-w-lg mx-auto">
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
				<h3 class="text-xl text-gray-800 dark:text-gray-100">Sign Out</h3>

				<Button type="submit">Sign out</Button>
			</form>
		</div>
	</Register>
</Section>
