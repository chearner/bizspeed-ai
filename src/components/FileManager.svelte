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
		Modal,
		Spinner,
		Badge
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import {
		ChevronDownOutline,
		FilterSolid,
		ChevronRightOutline,
		ChevronLeftOutline,
		TrashBinOutline,
		EyeOutline,
		FileImportOutline
	} from 'flowbite-svelte-icons';
	import dayjs from 'dayjs';
	import Camera from '$components/Camera.svelte';
	import StatusBadge from '$components/StatusBadge.svelte';
	import ImageBadge from '$components/ImageBadge.svelte';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	interface Image {
		user_id: string;
		image_id: number;
		image_url: string;
		file_name: string;
		text_data: string;
		text_raw: string;
		created_at: string;
		updated_at: string;
		image_type_name: string;
		status_type_name: string;
	}

	interface ModalFile {
		file_name: string;
		file_url: string;
	}

	let showImage = $state(false);
	let { tableName, bucketName, imageType, imageTypeId, fileType } = $props<{
		tableName: string;
		bucketName: string;
		imageType: string;
		imageTypeId: number;
		fileType: string;
	}>();

	const itemsPerPage = 10;
	const showPage = 5;

	let error = $state('');
	let deletingFile = $state<number | null>(null);
	let showConfirmDelete = $state(false);
	let fileToDelete = $state<number | null>(null);

	let modalCameraOpen = $state(false);
	let modalDeleteOpen = $state(false);
	let modalFileOpen = $state(false);
	let modalFile: ModalFile = $state<ModalFile>({
		file_name: '',
		file_url: ''
	});
	let filteredImages: Image[] = $state<Image[]>([]);
	let filteredItems = $derived(
		filteredImages.filter(
			(image) => image.text_raw.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
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
		filteredImages.slice(currentPosition, currentPosition + itemsPerPage)
	);

	const updateDataAndPagination = () => {
		const currentPageItems = filteredImages.slice(currentPosition, currentPosition + itemsPerPage);
		renderPagination(currentPageItems.length);
	};

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < filteredImages.length) {
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
		totalPages = Math.ceil(filteredImages.length / itemsPerPage);
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

	async function loadImages() {
		try {
			loading.set(true);
			error = '';

			const { data: data, error: tableError } = await supabase
				.from(tableName)
				.select(
					`
					*,
					tbl_image_types!inner (
						image_type_name
					),
					tbl_status_types!inner (
						status_type_name
					)
				`
				)
				.eq('tbl_image_types.image_type_id', imageTypeId);

			if (tableError) throw tableError;

			if (!data) {
				return;
			}

			filteredImages =
				data?.map((o: any) => ({
					file_name: o.file_name,
					text_data: o.text_data,
					created_at: o.created_at,
					updated_at: o.updated_at,
					image_url: o.image_url,
					text_raw: o.text_raw,
					user_id: o.user_id,
					image_id: o.image_id,
					image_type_name: o.tbl_image_types?.image_type_name || '',
					status_type_name: o.tbl_status_types?.status_type_name || ''
				})) || [];

			renderPagination(data.length);
		} catch (err) {
			console.error('Error loading images:', err);
			error = 'Failed to load images. Please try again.';
		} finally {
			loading.set(false);
		}
	}

	async function confirmDelete(id: number) {
		if (!$user) {
			error = 'You must be signed in to delete documents';
			return;
		}
		fileToDelete = id;
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

			// Delete the image data from the table
			const { data: data, error: tableError } = await supabase
				.from(tableName)
				.delete()
				.eq('image_id', fileToDelete)
				.select();

			if (tableError) throw tableError;

			if (!data?.length) {
				throw new Error('File not found or already deleted');
			}

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

			filteredImages = filteredImages.filter((image) => image.image_id !== fileToDelete);
		} catch (err) {
			console.error('Error deleting image:', err);
			error = err instanceof Error ? err.message : 'Failed to delete image. Please try again.';
		} finally {
			deletingFile = null;
			fileToDelete = null;
			loading.set(false);
		}
	}

	function handleImageError(event: Event, image: ModalFile) {
		console.error(`Failed to load image for ${image.file_name}:`, image.file_url);
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
	}

	onMount(() => {
		loadImages();
	});
</script>

<Modal
	dialogClass="animate-fadeIn fixed top-0 start-0 end-0 h-modal md:inset-0 md:h-full z-50 w-full p-4 flex"
	title={modalFile.file_name}
	bind:open={modalFileOpen}
	size="sm"
>
	<img
		src={modalFile.file_url}
		alt={modalFile.file_name}
		class="h-full w-full rounded object-cover"
		onerror={(e) => handleImageError(e, modalFile)}
	/>
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

{#if modalCameraOpen}
	<Camera
		{modalCameraOpen}
		{tableName}
		{bucketName}
		{imageType}
		{fileType}
		close={() => (modalCameraOpen = false)}
	/>
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
			<div
				slot="header"
				class="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0"
			>
				<Button color="alternative">Actions<ChevronDownOutline class="ml-2 h-3 w-3 " /></Button>
				<Dropdown class="w-44 divide-y divide-gray-100">
					<DropdownItem>View selected</DropdownItem>
					<DropdownItem>Delete all</DropdownItem>
				</Dropdown>
				<Button color="alternative">Filter<FilterSolid class="ml-2 h-3 w-3" /></Button>
				<Dropdown class="w-48 space-y-2 p-3 text-sm">
					<h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Status</h6>
					<li>
						<Checkbox>Completed (56)</Checkbox>
					</li>
					<li>
						<Checkbox>Pending (16)</Checkbox>
					</li>
					<li>
						<Checkbox>Error (12)</Checkbox>
					</li>
				</Dropdown>
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
				<TableHeadCell padding="px-4 py-3 w-full" scope="col">OCR</TableHeadCell>
				<TableHeadCell padding="px-4 py-3" scope="col">Created</TableHeadCell>
				<TableHeadCell padding="px-4 py-3 text-center" scope="col">Type</TableHeadCell>
				<TableHeadCell padding="px-4 py-3 text-center" scope="col">Status</TableHeadCell>
				<TableHeadCell padding="px-4 py-3 text-center" scope="col"></TableHeadCell>
				<TableHeadCell padding="px-4 py-3 text-center" scope="col"></TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				{#if searchTerm !== ''}
					{#each filteredItems as item (item.image_id)}
						<TableBodyRow>
							<TableBodyCell tdClass="px-4 py-3 text-center"><Checkbox /></TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 w-full">{item.text_raw}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-nowrap"
								>{dayjs(item.created_at).format('MMM D, YYYY h:mm A')}
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center"
								><ImageBadge status={item.image_type_name} /></TableBodyCell
							>
							<TableBodyCell tdClass="px-4 py-3 text-center"
								><StatusBadge status={item.status_type_name} /></TableBodyCell
							>
							<TableBodyCell tdClass="px-4 py-3 text-center"
								><Button
									color="alternative"
									onclick={() => {
										modalFile = { file_name: item.file_name, file_url: item.image_url };
										showImage = true;
										modalFileOpen = true;
									}}
								>
									<EyeOutline class="h-4 w-4" />
								</Button>
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center">
								<Button color="alternative" onclick={() => confirmDelete(item.image_id)}
									><TrashBinOutline class="h-4 w-4" /></Button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{:else}
					{#each currentPageItems as item (item.image_id)}
						<TableBodyRow>
							<TableBodyCell tdClass="px-4 py-3 text-center"><Checkbox /></TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 w-full">{item.text_raw}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-nowrap"
								>{dayjs(item.created_at).format('MMM D, YYYY h:mm A')}
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center"
								><ImageBadge status={item.image_type_name} /></TableBodyCell
							>
							<TableBodyCell tdClass="px-4 py-3 text-center"
								><StatusBadge status={item.status_type_name} /></TableBodyCell
							>
							<TableBodyCell tdClass="px-4 py-3 text-center"
								><Button
									color="alternative"
									onclick={() => {
										modalFile = {
											file_name: item.file_name,
											file_url: item.image_url
										};
										showImage = false;
										modalFileOpen = true;
									}}
								>
									<EyeOutline class="h-4 w-4" />
								</Button>
							</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3 text-center">
								<Button color="alternative" onclick={() => confirmDelete(item.image_id)}
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
