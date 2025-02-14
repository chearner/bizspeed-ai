<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Camera, X } from 'lucide-svelte';
  const dispatch = createEventDispatcher();
  
  let stream: MediaStream;
  let video: HTMLVideoElement;
  let canvas: HTMLCanvasElement;
  
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
      canvas.toBlob(async (blob) => {
        if (blob) {
          dispatch('photo', { photo: blob });
        }
      }, 'image/jpeg', 0.8);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }
  
  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-black z-50 flex flex-col">
  <video
    bind:this={video}
    autoplay
    playsinline
    on:loadedmetadata={() => video.play()}
    class="w-full h-full object-cover"
  ></video>
  
  <canvas bind:this={canvas} class="hidden"></canvas>
  
  <div class="absolute bottom-0 w-full p-4 flex justify-center gap-4">
    <button class="btn btn-circle btn-error" on:click={closeCamera}>
      <X size={24} />
    </button>
    <button class="btn btn-circle btn-primary" on:click={takePhoto}>
      <Camera size={24} />
    </button>
  </div>
</div>

{#if video}
  {startCamera()}
{/if}