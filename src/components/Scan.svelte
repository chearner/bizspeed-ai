<script lang="ts">
	import History from '$components/History.svelte';
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/auth';
	import Camera from '$components/Camera.svelte';
	import OCRProcessor from '$components/OCRProcessor.svelte';
	import { FileImportOutline, FileCloneOutline } from 'flowbite-svelte-icons';
	import { loading } from '$lib/stores';
	import { Img, P, Heading, Button, Spinner, Modal, Tabs, TabItem } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import Files from '$components/Files.svelte';

	let defaultModal = $state(false);

	const handleCancel = () => {
		alert('Clicked cancel');
	};
	const handleDelete = () => {
		alert('Clicked delete');
	};
	const handleModal = () => {
		defaultModal = true;
	};

	let showCamera = $state(false);
	let showHistory = $state(false);
	let error = $state('');
	let successMessage = $state('');
	let extractedText = $state('');
	let currentPhoto = $state<Blob | null>(null);

	async function handlePhoto(photo: Blob) {
		error = '';

		if (!$user) {
			error = 'Please sign in first';
			showCamera = false;
			return;
		}

		currentPhoto = photo;
		showCamera = true;
	}

	async function handleTextExtracted(text: string) {
		extractedText = text;
	}

	async function handleSave() {
		if (!currentPhoto) return;

		try {
			loading.set(true);
			const fileName = `bol-${Date.now()}.jpg`;
			const { error: uploadError } = await supabase.storage
				.from('bols')
				.upload(fileName, currentPhoto, {
					contentType: 'image/jpeg'
				});

			if (uploadError) throw uploadError;

			successMessage = 'BOL uploaded successfully!';
			currentPhoto = null;
			extractedText = '';
		} catch (err) {
			console.error('Error saving BOL:', err);
			error = 'Failed to save BOL. Please try again.';
		} finally {
			loading.set(false);
			showCamera = false;
		}
	}
</script>

<div class="flex flex-col p-4">
	<Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
		>AI-powered Document Scanner</Heading
	>
	<!--<Img src="./src/lib/images/bol.jpeg" alt="BOL Scan" />-->
	<Tabs tabStyle="underline" contentClass="p-0">
		<TabItem open>
			<span slot="title">BOLs</span>
			<Files />
		</TabItem>
		<TabItem>
			<span slot="title">Receipts</span>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Re:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</TabItem>
		<div class="flex flex-1 justify-end">
			<Button
				class="float-right mb-4"
				color="primary"
				onclick={() => (showCamera = true)}
				disabled={$loading}
			>
				<FileImportOutline class="me-2 h-4 w-4" />
				Scan Document
			</Button>
		</div>
	</Tabs>
	{#if error}
		<div class="alert alert-error mt-4">
			{error}
		</div>
	{/if}
	{#if successMessage}
		<div class="alert alert-success mt-4">
			{successMessage}
		</div>
	{/if}
	{#if $user}
		{#if currentPhoto}
			<OCRProcessor photo={currentPhoto} onTextExtracted={handleTextExtracted} />
			<div class="mt-4">
				<textarea
					class="textarea textarea-bordered w-full"
					rows="4"
					placeholder="Extracted text will appear here..."
					bind:value={extractedText}
				/>
				<div class="mt-4 flex justify-end gap-2">
					<Button
						color="primary"
						onclick={() => {
							currentPhoto = null;
							extractedText = '';
						}}
					>
						Cancel
					</Button>
					<Button color="primary" onclick={handleSave} disabled={$loading}>
						{#if $loading}
							<Spinner />
						{/if}
						Save
					</Button>
				</div>
			</div>
		{/if}
	{:else}
		<div class="alert alert-warning mt-4">Please sign in to scan BOL documents</div>
	{/if}
</div>
{#if showCamera}
	<Camera photo={handlePhoto} close={() => (showCamera = false)} />
{/if}
<Modal title="Delete Item" bind:open={defaultModal} autoclose size="sm" class="w-full">
	<p class="mb-4 text-center text-gray-500 dark:text-gray-300">
		Are you sure you want to delete this item?
	</p>
	<div class="flex items-center justify-center space-x-4">
		<Button color="light" on:click={handleCancel}>No, cancel</Button>
		<Button color="red" on:click={handleDelete}>Yes, I'm sure</Button>
	</div>
</Modal>
