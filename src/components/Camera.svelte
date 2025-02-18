<script lang="ts">
	import { CameraPhotoOutline, CloseOutline } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';

	let { photo, close } = $props<{
		photo: (blob: Blob) => void;
		close: () => void;
	}>();

	let stream = $state<MediaStream>();
	let video = $state<HTMLVideoElement>();
	let canvas = $state<HTMLCanvasElement>();

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

			// Convert base64 to blob for upload
			canvas.toBlob(
				async (blob) => {
					if (blob) {
						photo(blob);
						closeCamera(); // Close camera after taking photo
					}
				},
				'image/jpeg',
				0.8
			);
		}
	}

	function closeCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		close();
	}
</script>

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
		<Button color="red" size="xl" pill={true} class="!p-2" onclick={closeCamera}>
			<CloseOutline color="white" class="h-8 w-8" />
		</Button>
	</div>
</div>

{#if video}
	{startCamera()}
{/if}
