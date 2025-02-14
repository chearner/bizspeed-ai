<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { supabase } from './supabase';
  import { user } from './auth';
  import { X, Download, Trash2 } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  let bols: { name: string, url: string, created_at: string }[] = [];
  let isLoading = true;
  let error = '';
  let deletingBol = '';
  let showConfirmDelete = false;
  let bolToDelete: string | null = null;
  
  async function loadBols() {
    try {
      isLoading = true;
      error = '';
      
      const { data, error: storageError } = await supabase
        .storage
        .from('receipts')
        .list('', {
          limit: 100,
          search: '',
          sortBy: { column: 'created_at', order: 'desc' }
        });
        
      if (storageError) throw storageError;
      
      if (!data) {
        bols = [];
        return;
      }

      // Filter out system files and get signed URLs
      bols = await Promise.all(
        data
          .filter(file => !file.name.startsWith('.')) // Filter out hidden files
          .map(async (file) => {
            const { data: signedUrlData } = await supabase
              .storage
              .from('receipts')
              .createSignedUrl(file.name, 60 * 60); // 1 hour expiry

            return {
              name: file.name,
              url: signedUrlData?.signedUrl || '',
              created_at: new Date(file.created_at).toLocaleString()
            };
          })
      );
        
    } catch (err) {
      console.error('Error loading bills of lading:', err);
      error = 'Failed to load bills of lading. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  function confirmDelete(bolName: string) {
    bolToDelete = bolName;
    showConfirmDelete = true;
  }
  
  function cancelDelete() {
    bolToDelete = null;
    showConfirmDelete = false;
  }
  
  async function deleteBol() {
    if (!bolToDelete || !$user) return;
    
    try {
      deletingBol = bolToDelete;
      error = '';
      showConfirmDelete = false;
      
      // First verify the file exists and belongs to the user
      const { data: files } = await supabase
        .storage
        .from('receipts')
        .list('', {
          limit: 1,
          search: bolToDelete
        });
        
      if (!files?.length) {
        throw new Error('Bill of Lading not found or already deleted');
      }

      const { error: deleteError } = await supabase
        .storage
        .from('receipts')
        .remove([bolToDelete]);

      if (deleteError) {
        if (deleteError.message.includes('Permission denied')) {
          throw new Error('You do not have permission to delete this bill of lading');
        }
        throw new Error(deleteError.message || 'Failed to delete bill of lading');
      }
      
      // Remove the bol from the local array
      bols = bols.filter(bol => bol.name !== bolToDelete);
      
    } catch (err) {
      console.error('Error deleting bill of lading:', err);
      error = err instanceof Error ? err.message : 'Failed to delete bill of lading. Please try again.';
    } finally {
      deletingBol = '';
      bolToDelete = null;
    }
  }
  
  function close() {
    dispatch('close');
  }

  function handleImageError(event: Event, bol: { name: string, url: string }) {
    console.error(`Failed to load image for bill of lading ${bol.name}:`, bol.url);
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
  <div class="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
    <div class="p-4 border-b border-base-300 flex justify-between items-center">
      <h2 class="text-2xl font-bold">Bill of Lading History</h2>
      <button class="btn btn-ghost btn-sm" on:click={close}>
        <X size={20} />
      </button>
    </div>
    
    <div class="flex-1 overflow-auto p-4">
      {#if error}
        <div class="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      {/if}
      
      {#if isLoading}
        <div class="flex justify-center items-center h-32">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      {:else if bols.length === 0}
        <div class="text-center py-8 text-gray-500">
          No BOLs found. Start by scanning one!
        </div>
      {:else}
        <div class="grid gap-4">
          {#each bols as bol}
            <div class="card bg-base-200">
              <div class="card-body p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold">{bol.name}</h3>
                    <p class="text-sm text-gray-500">{bol.created_at}</p>
                  </div>
                  <div class="flex gap-2">
                    {#if bol.url}
                      <img 
                        src={bol.url}
                        alt="Bill of Lading"
                        class="w-32 h-32 object-cover rounded"
                        on:error={(e) => handleImageError(e, bol)}
                      />
                      <div class="flex flex-col gap-2">
                        <a
                          href={bol.url}
                          download={bol.name}
                          class="btn btn-primary btn-sm"
                        >
                          <Download size={16} />
                          Download
                        </a>
                        <button
                          class="btn btn-error btn-sm"
                          on:click={() => confirmDelete(bol.name)}
                          disabled={deletingBol === bol.name}
                        >
                          {#if deletingBol === bol.name}
                            <span class="loading loading-spinner loading-xs"></span>
                          {:else}
                            <Trash2 size={16} />
                            Delete
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
    </div>
  </div>
</div>

{#if showConfirmDelete}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
    <div class="bg-base-100 rounded-lg shadow-xl p-6 max-w-md w-full">
      <h3 class="text-lg font-bold mb-4">Delete Bill of Lading</h3>
      <p class="mb-6">Are you sure you want to permanently delete this bill of lading? This action cannot be undone.</p>
      <div class="flex justify-end gap-2">
        <button class="btn btn-ghost" on:click={cancelDelete}>Cancel</button>
        <button class="btn btn-error" on:click={deleteBol}>
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}

{#if isLoading}
  {loadBols()}
{/if}