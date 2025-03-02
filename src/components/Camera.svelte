<script lang="ts">
	import { CameraPhotoOutline, CloseOutline } from 'flowbite-svelte-icons';
	import { Button, Textarea, Label, Spinner } from 'flowbite-svelte';
	import OCRProcessor from '$components/OCRProcessor.svelte';
	import { loading } from '$lib/stores';
	import { user } from '$lib/auth';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	let { close, tableName, bucketName, imageType, fileType } = $props<{
		close: () => void;
		tableName: string;
		bucketName: string;
		imageType: string;
		fileType: string;
	}>();

	let isCameraOn = $state(false);
	let stream = $state<MediaStream>();
	let video = $state<HTMLVideoElement>();
	let canvas = $state<HTMLCanvasElement>();
	let currentPhoto = $state<Blob | null>(null);
	let extractedText = $state('');
	let error = $state('');
	let successMessage = $state('');
	let imageTypeSelected = $state<{ value: number; name: string }>();

	onMount(() => {
		getImageType(imageType);
		isCameraOn = true;
	});

	async function getImageType(type: string) {
		try {
			const { data, error } = await supabase
				.from('tbl_image_types')
				.select('image_type_id, image_type_name')
				.eq('image_type_name', type)
				.single();

			if (error) {
				throw error;
			}

			if (data) {
				imageTypeSelected = {
					value: data.image_type_id as number,
					name: data.image_type_name as string
				};
			}
		} catch (err) {
			console.error('Error fetching image type:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch image type';
		}
	}

	async function startCamera() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' }
			});
			if (video) {
				video.srcObject = stream;
			}
		} catch (err) {
			console.error('Error accessing camera:', err);
		}
	}

	function takePhoto() {
		if (canvas && video) {
			const context = canvas.getContext('2d');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			context?.drawImage(video, 0, 0, canvas.width, canvas.height);

			canvas.toBlob(
				// Convert base64 to blob for upload
				async (blob) => {
					if (blob) {
						currentPhoto = blob;
						stopCamera();
					}
				},
				'image/jpeg',
				0.8
			);
		}
	}

	async function handleSave() {
		if (!currentPhoto) return;

		try {
			loading.set(true);
			const fileName = `${imageType.toLowerCase()}-${Date.now()}.${fileType}`;

			const { error: bucketError } = await supabase.storage
				.from(bucketName)
				.upload(`${imageType.toLowerCase()}/${fileName}`, currentPhoto, {
					contentType: 'image/jpeg'
				});

			if (bucketError) throw bucketError;

			const {
				data: { publicUrl }
			} = supabase.storage.from(bucketName).getPublicUrl(fileName);

			const bolMatch = extractedText.match(/B\.O\.L\.\s*[#:]?\s*(\S+)/i);
			const textData = bolMatch ? bolMatch[1] : '';

			const { error: insertError } = await supabase.from(tableName).insert({
				image_url: publicUrl,
				text_raw: extractedText,
				text_data: textData,
				file_name: fileName,
				status_type_id: 2,
				image_type_id: imageTypeSelected?.value,
				user_id: (await supabase.auth.getUser()).data.user?.id
			});

			if (insertError) throw insertError;

			successMessage = 'Image uploaded successfully!';
			currentPhoto = null;
			extractedText = '';
		} catch (err) {
			console.error('Error saving image:', err);
			error = 'Failed to save image. Please try again.';
		} finally {
			loading.set(false);
			close();
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		isCameraOn = false;
	}

	async function handleTextExtracted(text: string) {
		extractedText = text;
	}
</script>

{#if isCameraOn}
	<div class="fixed inset-0 z-50 m-4 flex flex-col border-4 border-white bg-black">
		<video
			bind:this={video}
			autoplay
			playsinline
			onloadedmetadata={() => {
				if (video) video.play();
			}}
			class="h-full w-full object-cover"><track kind="captions" label="Camera Feed" /></video
		>
		<canvas bind:this={canvas} class="hidden"></canvas>
		<div class="absolute bottom-0 flex w-full justify-center gap-8 p-8">
			<Button color="green" size="xl" pill={true} class="!p-2" onclick={takePhoto}>
				<CameraPhotoOutline color="white" class="h-8 w-8" />
			</Button>
			<Button color="red" size="xl" pill={true} class="!p-2" onclick={stopCamera}>
				<CloseOutline color="white" class="h-8 w-8" />
			</Button>
		</div>
	</div>
{/if}
{#if currentPhoto}
	<OCRProcessor photo={currentPhoto} onTextExtracted={handleTextExtracted} />
	<form onsubmit={handleSave} class="mt-4">
		<Label for="extractedText" class="mb-2">Scan Data</Label>
		<Textarea
			id="extractedText"
			placeholder="Extracted text will appear here..."
			rows={4}
			name="message"
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
			<Button color="primary" type="submit" disabled={$loading}>
				{#if $loading}
					<Spinner />
				{/if}
				Save
			</Button>
		</div>
	</form>
{/if}
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
{#if video}
	{startCamera()}
{/if}
