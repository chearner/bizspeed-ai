<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/auth';
	import { onMount } from 'svelte';
	import { loading } from '$lib/stores';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Button,
		Dropdown,
		DropdownItem,
		Checkbox,
		ButtonGroup,
		Modal
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import paginationData from './data.json';
	import {
		ChevronDownOutline,
		FilterSolid,
		ChevronRightOutline,
		ChevronLeftOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import dayjs from 'dayjs';

	let files = $state<{ name: string; url: string; created_at: string }[]>([]);
	let error = $state('');
	let deletingFile = $state('');
	let showConfirmDelete = $state(false);
	let fileToDelete = $state<string | null>(null);
	let modalDeleteOpen = $state(false);
	let modalFileOpen = $state(false);
	let modalFile: { name: string; url: string } = $state({ name: '', url: '' });
	let searchTerm: string = '';
	let currentPosition: number = 0;
	let totalPages: number = 0;
	let pagesToShow: number[] = [];
	let totalItems: number = paginationData.length;
	let startPage: number = 0;
	let endPage: number = 0;

	const itemsPerPage = 10;
	const showPage = 5;

	const updateDataAndPagination = () => {
		const currentPageItems = paginationData.slice(currentPosition, currentPosition + itemsPerPage);
		renderPagination(currentPageItems.length);
	};

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < paginationData.length) {
			currentPosition += itemsPerPage;
			updateDataAndPagination();
		}
	};

	const loadPreviousPage = () => {
		if (currentPosition - itemsPerPage >= 0) {
			currentPosition -= itemsPerPage;
			updateDataAndPagination();
		}
	};

	const renderPagination = (total: number) => {
		totalPages = Math.ceil(files.length / itemsPerPage);
		const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

		startPage = currentPage - Math.floor(showPage / 2);
		startPage = Math.max(1, startPage);
		endPage = Math.min(startPage + showPage - 1, totalPages);

		pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	};

	const goToPage = (pageNumber: number) => {
		currentPosition = (pageNumber - 1) * itemsPerPage;
		updateDataAndPagination();
	};

	onMount(() => {
		loadFiles();
	});

	let startRange = $state(currentPosition + 1);
	let endRange = $state(Math.min(currentPosition + itemsPerPage, totalItems));
	let currentPageItems = $derived(files.slice(currentPosition, currentPosition + itemsPerPage));
	let filteredItems = $derived(
		files.filter((item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
	);

	async function loadFiles() {
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
				files = [];
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
							created_at: dayjs(file.created_at).format('M/D/YYYY @ h:mmA')
						};
					})
			);

			files = processedBols;
			renderPagination(files.length);
		} catch (err) {
			console.error('Error loading files:', err);
			error = 'Failed to load files. Please try again.';
		} finally {
			loading.set(false);
		}
	}

	async function confirmDelete(bolName: string) {
		if (!$user) {
			error = 'You must be signed in to delete documents';
			return;
		}
		fileToDelete = bolName;
		showConfirmDelete = true;
		modalDeleteOpen = true;
	}

	function cancelDelete() {
		fileToDelete = null;
		showConfirmDelete = false;
		error = '';
	}

	async function deleteFile() {
		if (!fileToDelete || !$user) return;

		try {
			deletingFile = fileToDelete;
			error = '';
			showConfirmDelete = false;
			loading.set(true);

			const { data: bols, error: listError } = await supabase.storage.from('bols').list('', {
				limit: 1,
				search: fileToDelete
			});

			if (listError) throw listError;

			if (!bols?.length) {
				throw new Error('File not found or already deleted');
			}

			const { error: deleteError } = await supabase.storage.from('bols').remove([fileToDelete]);

			if (deleteError) {
				if (deleteError.message.includes('Permission denied')) {
					throw new Error('You do not have permission to delete this file');
				}
				throw deleteError;
			}

			files = files.filter((file) => file.name !== fileToDelete);
		} catch (err) {
			console.error('Error deleting BOL:', err);
			error = err instanceof Error ? err.message : 'Failed to delete BOL. Please try again.';
		} finally {
			deletingFile = '';
			fileToDelete = null;
			loading.set(false);
		}
	}

	function handleImageError(event: Event, bol: { name: string; url: string }) {
		console.error(`Failed to load image for BOL ${bol.name}:`, bol.url);
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
	}
</script>

<Modal title="Image File" bind:open={modalFileOpen} autoclose size="sm" class="h-fullw-full">
	<img
		src={modalFile.url}
		alt="File"
		class="h-full w-full rounded object-cover"
		onerror={(e) => handleImageError(e, modalFile)}
	/>
	<div class="flex items-center justify-center space-x-4">
		<Button color="light" on:click={cancelDelete}>No, cancel</Button>
		<Button color="red" on:click={deleteFile}>Yes, I'm sure</Button>
	</div>
</Modal>

<Modal title="Delete Item" bind:open={modalDeleteOpen} autoclose size="sm" class="w-full">
	<p class="mb-4 text-center text-gray-500 dark:text-gray-300">
		Are you sure you want to delete this item?
	</p>
	<div class="flex items-center justify-center space-x-4">
		<Button color="light" on:click={cancelDelete}>No, cancel</Button>
		<Button color="red" on:click={deleteFile}>Yes, I'm sure</Button>
	</div>
</Modal>

<Section name="none" sectionClass="mt-0">
	<TableSearch
		placeholder="Search"
		hoverable={true}
		bind:inputValue={searchTerm}
		divClass="dark:bg-gray-800 overflow-hidden m-0"
		innerDivClass="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4"
		searchClass="w-full md:w-1/2 relative"
		svgDivClass="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
		classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 pl-10"
	>
		<div
			slot="header"
			class="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0"
		>
			<Button color="alternative">Actions<ChevronDownOutline class="ml-2 h-3 w-3 " /></Button>
			<Dropdown class="w-44 divide-y divide-gray-100">
				<DropdownItem>Mass Edit</DropdownItem>
				<DropdownItem>Delete all</DropdownItem>
			</Dropdown>
			<Button color="alternative">Filter<FilterSolid class="ml-2 h-3 w-3" /></Button>
			<Dropdown class="w-48 space-y-2 p-3 text-sm">
				<h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Document Status</h6>
				<li>
					<Checkbox>Completed (56)</Checkbox>
				</li>
				<li>
					<Checkbox>Processing (16)</Checkbox>
				</li>
				<li>
					<Checkbox>Rejected (49)</Checkbox>
				</li>
				<li>
					<Checkbox>Error (12)</Checkbox>
				</li>
			</Dropdown>
		</div>
		<TableHead>
			<TableHeadCell padding="px-4 py-3" scope="col">Id</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">File Name</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Image</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Created</TableHeadCell>
			<TableHeadCell padding="px-4 py-3" scope="col">Delete</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#if searchTerm !== ''}
				{#each filteredItems as item (item.name)}
					<TableBodyRow>
						<TableBodyCell tdClass="px-4 py-3">-</TableBodyCell>
						<TableBodyCell tdClass="px-4 py-3">{item.name}</TableBodyCell>
						<TableBodyCell tdClass="px-4 py-3"
							><button
								onclick={() => {
									modalFile = { name: item.name, url: item.url };
									modalFileOpen = true;
								}}
							>
								{item.name}
							</button></TableBodyCell
						>
						<TableBodyCell tdClass="px-4 py-3">{item.created_at}</TableBodyCell>
						<TableBodyCell tdClass="px-4 py-3">
							<Button color="alternative" on:click={() => confirmDelete(item.name)}
								><TrashBinOutline class="h-4 w-4" /></Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			{:else}
				{#each currentPageItems as item (item.name)}
					<TableBodyRow>
						<TableBodyCell tdClass="px-4 py-3">-</TableBodyCell>
						<TableBodyCell tdClass="px-4 py-3">{item.name}</TableBodyCell>
						<TableBodyCell tdClass="px-4 py-3"
							><button
								onclick={() => {
									modalFile = { name: item.name, url: item.url };
									modalFileOpen = true;
								}}
							>
								{item.name}
							</button></TableBodyCell
						>
						<TableBodyCell tdClass="px-4 py-3">{item.created_at}</TableBodyCell>
						<TableBodyCell tdClass="px-4 py-3">
							<Button color="alternative" on:click={() => confirmDelete(item.name)}
								><TrashBinOutline class="h-4 w-4" /></Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
		<div
			slot="footer"
			class="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
			aria-label="Table navigation"
		>
			<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
				Showing
				<span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
				of
				<span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
			</span>
			<ButtonGroup>
				<Button on:click={loadPreviousPage} disabled={currentPosition === 0}
					><ChevronLeftOutline size="xs" class="m-1.5" /></Button
				>
				{#each pagesToShow as pageNumber}
					<Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
				{/each}
				<Button on:click={loadNextPage} disabled={totalPages === endPage}
					><ChevronRightOutline size="xs" class="m-1.5" /></Button
				>
			</ButtonGroup>
		</div>
	</TableSearch>
</Section>
