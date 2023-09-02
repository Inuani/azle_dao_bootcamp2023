<script lang="ts">   
    import { allProposals, userInfo, userExist } from '../stores/user';
    import { onMount } from 'svelte';
    import { Principal } from '@dfinity/principal';

let localUser:{ principal: Principal; username: string ; kaliBalance : bigint } | null;
  
  $: if ($userExist) {
      checkUserInfo();
  }

  onMount( () => {
    checkUserInfo();
});

  function checkUserInfo() {
    localUser = $userInfo;
    console.log(localUser);
  }

    let stateVariant:string = '';

    const getStateVariant = (state: any) => {
        for (let key in state) {
            if (state[key] === null) {
                return key;
            }
        }
        return 'Unknown';
    }; 
    
</script>  

<div class="proposals-cont">
    {#each $allProposals as proposal (proposal.created_at_time)}
        <article>
            <p>Proposal n°{proposal.numero}</p>
            <h2>{proposal.title}</h2>
            <p>{proposal.body}</p>
            <footer>
                <div><strong>State of the proposal: {stateVariant = getStateVariant(proposal.state)}</strong></div>
                    {#if stateVariant === 'open' && $userInfo}
                        <button>Accept</button>
                        <button>Reject</button>
                    {/if}
                <div>By: {proposal.idFrom}</div>
            </footer>
        </article>
    {/each}
</div>

<style>

.proposals-cont {
    margin: 0 20px; 
    
}

article {
    border: 1px solid white;
    padding-bottom: 20px;
    margin-bottom: 10px;
}

</style>