<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/auth';
	import { onMount } from 'svelte';
	import { loading } from '$lib/stores';
	import { Spinner } from 'flowbite-svelte';
	let { close } = $props();

	let bols = $state<{ name: string; url: string; created_at: string }[]>([]);
	let error = $state('');
	let deletingBol = $state('');
	let showConfirmDelete = $state(false);
	let bolToDelete = $state<string | null>(null);

	onMount(() => {
		loadBols();
	});

	async function loadBols() {
		try {
			loading.set(true);
			error = '';

			const { data, error: storageError } = await supabase.storage.from('bols').list('', {
				limit: 100,
				search: '',
				sortBy: { column: 'created_at', order: 'desc' }
			});

			if (storageError) throw storageError;

			if (!data) {
				bols = [];
				return;
			}

			const processedBols = await Promise.all(
				data
					.filter((file) => !file.name.startsWith('.'))
					.map(async (file) => {
						const { data: signedUrlData } = await supabase.storage
							.from('bols')
							.createSignedUrl(file.name, 60 * 60);

						return {
							name: file.name,
							url: signedUrlData?.signedUrl || '',
							created_at: new Date(file.created_at).toLocaleString()
						};
					})
			);

			bols = processedBols;
		} catch (err) {
			console.error('Error loading BOLs:', err);
			error = 'Failed to load BOLs. Please try again.';
		} finally {
			loading.set(false);
		}
	}

	async function confirmDelete(bolName: string) {
		if (!$user) {
			error = 'You must be signed in to delete documents';
			return;
		}
		bolToDelete = bolName;
		showConfirmDelete = true;
	}

	function cancelDelete() {
		bolToDelete = null;
		showConfirmDelete = false;
		error = '';
	}

	async function deleteBol() {
		if (!bolToDelete || !$user) return;

		try {
			deletingBol = bolToDelete;
			error = '';
			showConfirmDelete = false;
			loading.set(true);

			const { data: files, error: listError } = await supabase.storage.from('bols').list('', {
				limit: 1,
				search: bolToDelete
			});

			if (listError) throw listError;

			if (!files?.length) {
				throw new Error('BOL not found or already deleted');
			}

			const { error: deleteError } = await supabase.storage.from('bols').remove([bolToDelete]);

			if (deleteError) {
				if (deleteError.message.includes('Permission denied')) {
					throw new Error('You do not have permission to delete this BOL');
				}
				throw deleteError;
			}

			bols = bols.filter((bol) => bol.name !== bolToDelete);
		} catch (err) {
			console.error('Error deleting BOL:', err);
			error = err instanceof Error ? err.message : 'Failed to delete BOL. Please try again.';
		} finally {
			deletingBol = '';
			bolToDelete = null;
			loading.set(false);
		}
	}

	function handleImageError(event: Event, bol: { name: string; url: string }) {
		console.error(`Failed to load image for BOL ${bol.name}:`, bol.url);
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
	}
</script>

<div class="bg-base-100 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg shadow-xl">
	<div class="flex-1 overflow-auto p-4">
		{#if error}
			<div class="alert alert-error mb-4">
				<span>{error}</span>
			</div>
		{/if}
		{#if $loading}
			<Spinner />
		{:else}
			{#key bols}
				{#if bols.length === 0}
					<div class="py-8 text-center text-gray-500">
						No BOL documents found. Start by scanning one!
					</div>
				{:else}
					<div class="grid gap-4">
						{#each bols as bol}
							<div class="card bg-base-200">
								<div class="card-body p-4">
									<div class="flex items-start justify-between">
										<div>
											<h3 class="font-semibold">{bol.name}</h3>
											<p class="text-sm text-gray-500">{bol.created_at}</p>
										</div>
										<div class="flex gap-2">
											{#if bol.url}
												<img
													src={bol.url}
													alt="Bill of Lading"
													class="h-32 w-32 rounded object-cover"
													onerror={(e) => handleImageError(e, bol)}
												/>
												<div class="flex flex-col gap-2">
													<a href={bol.url} download={bol.name} class="btn btn-primary btn-sm">
														icon Download
													</a>
													<button
														class="btn btn-error btn-sm"
														onclick={() => confirmDelete(bol.name)}
														disabled={deletingBol === bol.name}
													>
														{#if deletingBol === bol.name}
															<span class="loading loading-spinner loading-xs"></span>
														{:else}
															icon Delete
														{/if}
													</button>
												</div>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/key}
		{/if}
	</div>
</div>
{#if showConfirmDelete}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
		<div class="bg-base-100 w-full max-w-md rounded-lg p-6 shadow-xl">
			<h3 class="mb-4 text-lg font-bold">Delete BOL Document</h3>
			<p class="mb-6">
				Are you sure you want to permanently delete this bill of lading? This action cannot be
				undone.
			</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-ghost" onclick={cancelDelete}>Cancel</button>
				<button class="btn btn-error" onclick={deleteBol}> icon Delete </button>
			</div>
		</div>
	</div>
{/if}
