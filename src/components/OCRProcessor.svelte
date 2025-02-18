<script lang="ts">
	import { createWorker } from 'tesseract.js';
	import { loading } from '$lib/stores';

	let { photo, onTextExtracted } = $props<{
		photo: Blob;
		onTextExtracted: (text: string) => void;
	}>();

	async function processImage() {
		try {
			loading.set(true);
			const worker = await createWorker('eng');

			// Convert blob to base64
			const reader = new FileReader();
			const base64 = await new Promise<string>((resolve) => {
				reader.onload = () => resolve(reader.result as string);
				reader.readAsDataURL(photo);
			});

			// Perform OCR
			const {
				data: { text }
			} = await worker.recognize(base64);

			// Clean up worker
			await worker.terminate();

			// Send extracted text back
			onTextExtracted(text);
		} catch (err) {
			console.error('OCR Error:', err);
		} finally {
			loading.set(false);
		}
	}

	$effect(() => {
		if (photo) {
			processImage();
		}
	});
</script>
