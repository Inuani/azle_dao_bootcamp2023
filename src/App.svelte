<script lang="ts">
  import Routes from "./Routes.svelte";
  import './App.css';
  import Header from './components/Header.svelte';
  import { onMount } from 'svelte';
  import { backend } from "./declarations/backend/index.js";
  import { allProposals } from './stores/user';

  onMount(async () => {
        const fetchedProposals = await backend.getAllProposals();
        allProposals.set(fetchedProposals);
    });
</script>

<main>
  <Header />
  <Routes />
</main>

<style>

</style>
