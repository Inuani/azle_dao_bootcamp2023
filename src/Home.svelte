<script lang="ts">
    import { navigate } from 'svelte-routing';
    import motokoImage from './assets/motoko_organge_transp.png';
    import { backend } from "./declarations/backend/index.js";
    import { isAuthenticated, userExist, userInfo, principalFromId, allProposals } from './stores/user';
    import { onMount } from 'svelte';
    import DisplayProposals from './components/DisplayProposals.svelte'
    
    let username = '';
    let totalKali: BigInt | null = null;
    let kaliSymbol: string = '';
  
    const handleSubmit = async () => {
      if (username)
      {
          const newUser = await backend.createUser($principalFromId, username);
          if (newUser)
          {
            console.log('new User: ', newUser);
            userExist.set(true);
            userInfo.set({
                principal: $principalFromId,
                username: username,
                kaliBalance: newUser.kaliBalance
            });
          }
  
      } else {
          console.error("Username is required");
      }
    };
  
    const deleteMyProfile = async () => {
      // console.log('Principal: ', principalFromId);
      const tryDeleteUser = await backend.deleteUser($principalFromId);
      userExist.set(false);
    };

    const createProposal = () => {
        navigate("/create-proposal");
    }
  
    // const log = (proposal: any) => {
    //     console.log(proposal);
    // }

    // const getStateString = (state: any) => {
    //     for (let key in state) {
    //         if (state[key] === null) {
    //             return key;
    //         }
    //     }
    //     return 'Unknown';
    // };

    onMount(async () => {
        kaliSymbol = await backend.icrc1_symbol();
        totalKali = await backend.icrc1_total_supply();
        // userBalance = await backend.getUserBalance($principalFromId);
        // console.table(await backend.readUsers());
        // console.table(await backend.icrc1_minting_account());
    });
  
  </script>
  

<section class="flex-container">
      <div class="proposals">
        <div class="title">
          <h1>Proposals</h1>
          <img src={motokoImage} class="motoko-img" alt="image of an orange motoko" >
        </div>
        <DisplayProposals />
      </div>
      <div class="user-info">
        {#if !$userExist && $isAuthenticated}
          <p>Register as a DAO User:</p>
          <div class="form-container">
            <form on:submit|preventDefault={handleSubmit}>
              <label for="username">Enter your username:</label>
              <input type="text" id="username" bind:value={username}>
              <button type="submit">Register</button>
            </form>
          </div>
        {:else if $userExist}
          <p><strong>Welcome {$userInfo.username} !</strong></p>
          <p>Your balance of Kali is:</p>
          <p> {$userInfo.kaliBalance} </p>
          <button on:click={createProposal}>
            Create a proposal
          </button>
          <hr class="white-line">
          <button on:click={deleteMyProfile}>
            Delete my profile
          </button>
        {:else}
          <p>Login with internet ID to enter the DAO!</p>
        {/if}
        <h2>Kali token</h2>
        <p>Total Kali supply in circulation: {totalKali} {kaliSymbol}</p>
      </div>
      
</section>

  
  <style>

   
    section {
      max-width: 1080px;
      margin: 0 auto;
    }

    .flex-container {
      display: flex;
    }
  
    .user-info {
      padding: 20px;
      flex: 1;
      background-color: rgb(99, 99, 99);
    }
  
    .proposals {
      flex: 4;
    }
  
    .title {
      display: flex;
      gap: 25px;
      align-items: center;
      justify-content: center;
    }
  
    .motoko-img {
      max-height: 70px;
  
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
  
  .white-line {
      border: 0;
      height: 1px;
      background-color: white;
      margin: 1em;
  }
  
  @media (max-width: 768px) {
    .flex-container {
      flex-direction: column;
    }
  
    .user-info, .proposals {
      flex: 1;
    }
  
    .user-info {
      margin: 30px;
    }
  }

     
  </style>
  