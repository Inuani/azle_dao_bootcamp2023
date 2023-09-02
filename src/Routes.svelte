<script>
    import { Router, Route } from "svelte-routing";
    import Home from "./Home.svelte"
    import CreateProposalPage from "./components/CreateProposal.svelte";
    import { userExist, isAuthenticated } from './stores/user';
</script>

<Router>
    <Route path="/" component="{Home}" />
    <Route path="/create-proposal">
        {#if $userExist && $isAuthenticated}
            <CreateProposalPage />
        {:else}
            <p>Login or create an account to access this page.</p>
        {/if}
    </Route>
</Router>