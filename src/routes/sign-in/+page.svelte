<script lang="ts">
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input, Heading } from 'flowbite-svelte';
	import { MailBoxOutline, LockOpenOutline } from 'flowbite-svelte-icons';
	import { supabase } from '$lib/supabase';
	import { loading } from '$lib/stores';

	let email = '';
	let password = '';
	let error = '';
	let successMessage = '';

	async function signIn() {
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}

		try {
			error = '';
			successMessage = '';
			loading.set(true);

			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (authError) {
				if (authError.message === 'Invalid login credentials') {
					error = 'Invalid email or password. Please try again.';
				} else {
					error = authError.message;
				}
				return;
			}

			if (!data?.user) {
				error = 'Something went wrong. Please try again.';
				return;
			}

			window.location.href = '/';
		} catch (err) {
			console.error('Sign in error:', err);
			error = 'Failed to sign in. Please check your credentials.';
		} finally {
			loading.set(false);
		}
	}
</script>

<svelte:head>
	<title>Sign In</title>
	<meta name="description" content="Sign in to your account" />
</svelte:head>

<Section name="none" sectionClass="p-4">
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
	<Register href="/">
		<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
			<form class="flex flex-col space-y-6" action="/">
				<Heading tag="h1" title="Sign Up">Sign In</Heading>
				<Label class="space-y-2">
					<span>Your email</span>
					<Input
						type="email"
						name="email"
						placeholder="name@company.com"
						required
						bind:value={email}
					/>
				</Label>
				<Label class="space-y-2">
					<span>Your password</span>
					<Input
						type="password"
						name="password"
						placeholder="•••••"
						required
						bind:value={password}
					/>
				</Label>
				<div class="flex items-start">
					<Checkbox>Remember me</Checkbox>
					<a href="/" class="ml-auto text-sm text-primary-600 hover:underline dark:text-primary-500"
						>Forgot password?</a
					>
				</div>
				<Button type="submit">Sign in</Button>
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					Don’t have an account yet? <a
						href="/sign-up"
						class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a
					>
				</p>
			</form>
		</div>
	</Register>
</Section>
