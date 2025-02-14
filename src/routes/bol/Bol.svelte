<script lang="ts">
    import Camera from '$lib/Camera.svelte';
    import History from '$lib/History.svelte';
    import { supabase } from '$lib/supabase';
    import { user } from '$lib/auth';
    import { Camera as CameraIcon, History as HistoryIcon, LogOut, Mail, Lock } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import Navbar from '$components/Navbar.svelte';
    
    let showCamera = false;
    let showHistory = false;
    let error = '';
    let email = '';
    let password = '';
    let isLoading = false;
    let isSignUp = false;
    let successMessage = '';
    let deferredPrompt: any = null;
    let showInstallPrompt = false;
    
    onMount(() => {
      // Handle PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt = true;
      });
  
      // Handle URL parameters for PWA shortcuts
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      if (action === 'scan' && $user) {
        showCamera = true;
      } else if (action === 'history' && $user) {
        showHistory = true;
      }
    });
  
    async function installPWA() {
      if (!deferredPrompt) return;
      
      showInstallPrompt = false;
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome} the PWA installation`);
      deferredPrompt = null;
    }
    
    async function handlePhoto(event: CustomEvent) {
      const { photo } = event.detail;
      error = '';
      
      if (!$user) {
        error = 'Please sign in first';
        showCamera = false;
        return;
      }
      
      try {
        isLoading = true;
        const fileName = `bol-${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, photo, {
            contentType: 'image/jpeg'
          });
          
        if (uploadError) throw uploadError;
        
        showCamera = false;
        successMessage = 'Bill of Lading uploaded successfully!';
      } catch (err) {
        console.error('Error saving bill of lading:', err);
        error = 'Failed to save bill of lading. Please try again.';
      } finally {
        isLoading = false;
      }
    }
  
    async function signIn() {
      if (!email || !password) {
        error = 'Please enter both email and password';
        return;
      }
      
      try {
        error = '';
        successMessage = '';
        isLoading = true;
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          if (authError.message === 'Invalid login credentials') {
            error = 'Invalid email or password. Please try again.';
          } else {
            error = authError.message;
          }
          return;
        }
        
        if (!data?.user) {
          error = 'Something went wrong. Please try again.';
          return;
        }
      } catch (err) {
        console.error('Sign in error:', err);
        error = 'Failed to sign in. Please check your credentials.';
      } finally {
        isLoading = false;
      }
    }
  
    async function signUp() {
      if (!email || !password) {
        error = 'Please enter both email and password';
        return;
      }
      
      if (password.length < 6) {
        error = 'Password must be at least 6 characters long';
        return;
      }
      
      try {
        error = '';
        successMessage = '';
        isLoading = true;
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        
        if (authError) throw authError;
        
        if (data?.user?.identities?.length === 0) {
          error = 'This email is already registered. Please sign in instead.';
          isSignUp = false;
          return;
        }
        
        successMessage = 'Success! Please check your email to confirm your account.';
        isSignUp = false;
      } catch (err) {
        console.error('Sign up error:', err);
        error = 'Failed to sign up. Please try again.';
      } finally {
        isLoading = false;
      }
    }
  
    async function signOut() {
      await supabase.auth.signOut();
      email = '';
      password = '';
      showHistory = false;
    }
  
    function handleSubmit(e: Event) {
      e.preventDefault();
    }
  
    function toggleMode() {
      isSignUp = !isSignUp;
      error = '';
      successMessage = '';
    }
  </script>
  
  <main class="min-h-screen">
    <Navbar />
    <div class="pt-16">
      <div class="hero min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <div class="mb-8">
              <h1 class="text-5xl font-bold">Intelligent Tools</h1>
            </div>
            
            {#if error}
              <div class="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            {/if}
  
            {#if successMessage}
              <div class="alert alert-success mb-4">
                <span>{successMessage}</span>
              </div>
            {/if}
  
            {#if showInstallPrompt}
              <div class="alert alert-info mb-4 flex justify-between items-center">
                <span>Install app for better experience</span>
                <button class="btn btn-sm btn-primary" on:click={installPWA}>
                  Install
                </button>
              </div>
            {/if}
            
            {#if $user}
              <div class="flex flex-col gap-4">
                <button
                  class="btn btn-primary btn-lg"
                  on:click={() => showCamera = true}
                  disabled={isLoading}
                >
                  <CameraIcon size={24} />
                  Scan Bill of Lading
                </button>
                
                <button
                  class="btn btn-outline btn-lg"
                  on:click={() => showHistory = true}
                  disabled={isLoading}
                >
                  <HistoryIcon size={24} />
                  View History
                </button>
  
                <button
                  class="btn btn-ghost btn-sm mt-4"
                  on:click={signOut}
                  disabled={isLoading}
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            {:else}
              <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                  <h2 class="card-title justify-center mb-4">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </h2>
                  <form class="form-control" on:submit={handleSubmit}>
                    <div class="relative mb-2">
                      <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="email"
                        placeholder="Email"
                        class="input input-bordered pl-10 w-full"
                        bind:value={email}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div class="relative mb-4">
                      <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="password"
                        placeholder="Password"
                        class="input input-bordered pl-10 w-full"
                        bind:value={password}
                        disabled={isLoading}
                        minlength="6"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      class="btn btn-primary mb-2"
                      on:click={isSignUp ? signUp : signIn}
                      disabled={isLoading}
                    >
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      class="btn btn-ghost"
                      on:click={toggleMode}
                      disabled={isLoading}
                    >
                      {isSignUp ? 'Already have an account?' : 'Need an account?'}
                    </button>
                  </form>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
      
      {#if showCamera}
        <Camera
          on:photo={handlePhoto}
          on:close={() => showCamera = false}
        />
      {/if}
  
      {#if showHistory}
        <History
          on:close={() => showHistory = false}
        />
      {/if}
    </div>
  </main>