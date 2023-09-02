<script lang="ts">
    import { backend } from "../declarations/backend/index.js";
    import { userExist, userInfo, principalFromId } from '../stores/user';
    import { onMount } from 'svelte';

    let title:string = '';
    let proposalBody:string = '';

    const handleProposalSubmit = async () => {
      
          const newProposal = await backend.createProposal($principalFromId, title, proposalBody);
    //       if (newProposal)
    //       {
    //         console.log('new User: ', newUser);
    //         userExist.set(true);
    //         userInfo.set({
    //             principal: $principalFromId,
    //             username: username,
    //             kaliBalance: newUser.kaliBalance
    //         });
    //       }
  
    //   } else {
    //       console.error("Username is required");
    //   }
    };

    onMount(async () => {
        console.table(await backend.getAllProposals());
    });

</script>

<section>
    <div class="form-container">
        <form on:submit|preventDefault={handleProposalSubmit}>
          <label for="title">Title of the proposal:</label>
          <input type="text" id="title" bind:value={title}>
          <label for="proposalBody">Describe your proposal:</label>
          <textarea id="proposalBody" bind:value={proposalBody} rows="5"></textarea>
          <!-- <input type="text" id="proposalBody" bind:value={proposalBody}> -->
          <p>Submit a Proposal costs 5 KLI</p>
          <button type="submit">Submit proposal</button>
        </form>
    </div>
</section>

<style>

textarea#proposalBody {
    /* width: 100%;       */
    height: 120px;     
    padding: 1em;
    resize: vertical;  
}

    section {
      max-width: 1080px;
      margin: 0 auto;
      padding: 2em;
      
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
    }
  
    .form-container {
      display: inline-block;
      
      background-color: #2D2D2D;
      padding: 20px;
  }
</style>