<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/auth';
	import { onMount } from 'svelte';
	import { loading } from '$lib/stores';
	import { slide } from 'svelte/transition';
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
		Modal,
		Spinner,
		Toast
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import Camera from '$components/Camera.svelte';
	import {
		ChevronDownOutline,
		FilterSolid,
		ChevronRightOutline,
		ChevronLeftOutline,
		TrashBinOutline,
		EyeOutline,
		FileImportOutline,
		CheckCircleSolid,
		ExclamationCircleSolid,
		FireOutline,
		CloseCircleSolid
	} from 'flowbite-svelte-icons';
	import dayjs from 'dayjs';
	import StatusBadge from '$components/StatusBadge.svelte';
	import ImageBadge from '$components/ImageBadge.svelte';

	interface BucketFile {
		name: string;
		url: string;
		created_at: string;
	}

	interface ModalFile {
		file_name: string;
		file_url: string;
	}

	let { tableName, bucketName, imageType, fileType } = $props<{
		tableName: string;
		bucketName: string;
		imageType: string;
		fileType: string;
	}>();

	const itemsPerPage = 10;
	const showPage = 5;

	let error = $state('');
	let deletingFile = $state<string | null>(null);
	let fileToDelete = $state<string | null>(null);

	let modalCameraOpen = $state(false);
	let modalDeleteOpen = $state(false);
	let modalFileOpen = $state(false);
	let modalFile: ModalFile = $state<ModalFile>({
		file_name: '',
		file_url: ''
	});
	let filteredFiles: BucketFile[] = $state<BucketFile[]>([]);
	let filteredItems = $derived(
		filteredFiles.filter(
			(image) => image.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
		)
	);
	let searchTerm: string = $state('');
	let currentPosition: number = $state(0);
	let totalPages: number = $state(0);
	let pagesToShow: number[] = $state([]);
	let startPage: number = $state(0);
	let endPage: number = $state(0);
	let startRange = $derived(currentPosition + 1);
	let endRange = $derived(Math.min(currentPosition + itemsPerPage, filteredItems.length));
	let currentPageItems = $derived(
		filteredFiles.slice(currentPosition, currentPosition + itemsPerPage)
	);

	let toastStatus = $state(false);
	let counter = $state(6);

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		toastStatus = false;
	}

	function triggerToast() {
		toastStatus = true;
		timeout();
	}

	const updateDataAndPagination = () => {
		const currentPageItems = filteredFiles.slice(currentPosition, currentPosition + itemsPerPage);
		renderPagination(currentPageItems.length);
	};

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < filteredFiles.length) {
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
		totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
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

	async function loadFiles() {
		try {
			loading.set(true);
			error = '';

			const { data, error: bucketError } = await supabase.storage
				.from(bucketName)
				.list(imageType.toLowerCase(), {
					limit: 100,
					search: '',
					sortBy: { column: 'created_at', order: 'desc' }
				});

			if (bucketError) throw bucketError;

			if (!data) {
				return;
			}

			filteredFiles = await Promise.all(
				data
					.filter((file) => !file.name.startsWith('.'))
					.map(async (file) => {
						const { data: signedUrlData } = await supabase.storage
							.from(bucketName)
							.createSignedUrl(`${imageType.toLowerCase()}/${file.name}`, 60 * 60);

						return {
							name: file.name,
							url: signedUrlData?.signedUrl || '',
							created_at: new Date(file.created_at).toLocaleString()
						};
					})
			);

			renderPagination(data.length);
		} catch (err) {
			console.error('Error loading files:', err);
			error = 'Failed to load files. Please try again.';
		} finally {
			loading.set(false);
		}
	}

	async function confirmDelete(file: string) {
		fileToDelete = file;
		modalDeleteOpen = true;
	}

	function cancelDelete() {
		fileToDelete = null;
		error = '';
	}

	async function deleteFile() {
		if (!fileToDelete || !$user) return;

		try {
			deletingFile = fileToDelete;
			error = '';
			loading.set(true);

			// Delete the image file from the bucket
			const { error: bucketError } = await supabase.storage
				.from(bucketName)
				.remove([`${imageType.toLowerCase()}/${fileToDelete}`]);

			if (bucketError) {
				if (bucketError.message.includes('Permission denied')) {
					throw new Error('You do not have permission to delete this file');
				}
				throw bucketError;
			}

			filteredFiles = filteredFiles.filter((file) => file.name !== fileToDelete);
		} catch (err) {
			console.error('Error deleting file:', err);
			error = err instanceof Error ? err.message : 'Failed to delete file. Please try again.';
		} finally {
			deletingFile = null;
			fileToDelete = null;
			loading.set(false);
			toastStatus = true;
			timeout();
		}
	}

	function handleImageError(event: Event, image: ModalFile) {
		console.error(`Failed to load image for ${image.file_name}:`, image.file_url);
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
	}

	onMount(() => {
		loadFiles();
	});
</script>

<Toast
	color="green"
	dismissable={true}
	transition={slide}
	bind:toastStatus
	position="top-right"
	class="rounded-lg border-2 border-green-800"
>
	<svelte:fragment slot="icon">
		<CheckCircleSolid class="h-5 w-5" />
		<span class="sr-only">Check icon</span>
	</svelte:fragment>
	Item has been deleted.
</Toast>

<Modal
	title={modalFile.file_name}
	bind:open={modalFileOpen}
	autoclose
	size="sm"
	class="h-full w-full"
>
	<img
		src={modalFile.file_url}
		alt="File"
		class="h-full w-full rounded object-cover"
		onerror={(e) => handleImageError(e, modalFile)}
	/>
</Modal>

<Modal title="Delete" bind:open={modalDeleteOpen} autoclose size="sm" class="w-full">
	<p class="mb-4 text-center text-gray-500 dark:text-gray-300">
		Are you sure you want to delete <span class="font-bold">{fileToDelete}</span>?
	</p>
	<div class="flex items-center justify-center space-x-4">
		<Button color="light" on:click={cancelDelete}>No, cancel</Button>
		<Button color="red" on:click={deleteFile}>Yes, I'm sure</Button>
	</div>
</Modal>

<Modal title="Camera" bind:open={modalCameraOpen} autoclose size="sm" class="w-full">
	<div class="flex items-center justify-center space-x-4">
		<Button color="light" on:click={cancelDelete}>No, cancel</Button>
		<Button color="red" on:click={deleteFile}>Yes, I'm sure</Button>
	</div>
</Modal>

{#if modalCameraOpen}
	<Camera {tableName} {bucketName} {imageType} {fileType} close={() => (modalCameraOpen = false)} />
{/if}

<Section name="none" sectionClass="mt-0">
	{#if $loading}
		<div class="w-full p-8 text-center">
			<Spinner />
		</div>
	{:else}
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
			<div slot="header" class="flex flex-col justify-end">
				<Button
					class="float-right"
					color="primary"
					onclick={() => (modalCameraOpen = true)}
					disabled={$loading}
				>
					<FileImportOutline class="me-2 h-4 w-4" />
					New {imageType} Scan
				</Button>
			</div>
			<TableHead>
				<TableHeadCell padding="px-4 py-3 text-center" scope="col"></TableHeadCell>
				<TableHeadCell padding="px-4 py-3 w-full" scope="col">File Name</TableHeadCell>
				<TableHeadCell padding="px-4 py-3" scope="col">Created</TableHeadCell>
				<TableHeadCell padding="px-4 py-3" scope="col"></TableHeadCell>
				<TableHeadCell padding="px-4 py-3" scope="col"></TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				{#if searchTerm !== ''}
					{#each filteredItems as item (item.name)}
						<TableBodyRow>
							<TableBodyCell tdClass="px-4 py-3 text-center"><Checkbox /></TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 w-full">{item.name}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-nowrap"
								>{dayjs(item.created_at).format('MMM D, YYYY h:mm A')}
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center max-w-max">
								<Button
									color="alternative"
									onclick={() => {
										modalFile = { file_name: item.name, file_url: item.url };
										modalFileOpen = true;
									}}
								>
									<EyeOutline class="h-4 w-4" />
								</Button>
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center max-w-max">
								<Button color="alternative" onclick={() => confirmDelete(item.name)}
									><TrashBinOutline class="h-4 w-4" /></Button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{:else}
					{#each currentPageItems as item (item.name)}
						<TableBodyRow>
							<TableBodyCell tdClass="px-4 py-3 text-center"><Checkbox /></TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 w-full">{item.name}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-nowrap"
								>{dayjs(item.created_at).format('MMM D, YYYY h:mm A')}
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center max-w-fit"
								><Button
									color="alternative"
									onclick={() => {
										modalFile = { file_name: item.name, file_url: item.url };
										modalFileOpen = true;
									}}
								>
									<EyeOutline class="h-4 w-4" />
								</Button>
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center max-w-fit">
								<Button color="alternative" onclick={() => confirmDelete(item.name)}
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
					<span class="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span>
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
	{/if}
</Section>
