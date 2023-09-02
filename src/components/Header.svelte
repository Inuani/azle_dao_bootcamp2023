<script>
    import { navigate } from 'svelte-routing';
    import Login from './Login.svelte';

    const goHome = () => {
        navigate("/");
    }
</script>

<header>
    <div class="header-cont">
        <div class="logo" on:click={goHome}>Kalinu DAO</div>
        <div class="login-cont">
            <Login />
        </div>
    </div>
</header>

<style>

    /* .login-cont {
      position: absolute;
     top: 10px;
     right: 10px; 
    } */

    header {
        padding: 10px;
        background-color: grey;
        color: aliceblue;
    }

    .logo {
        font-size: 1.5em;
        cursor: pointer; /* Change cursor to a pointer when hovering */
        transition: color 0.3s; /* Transition effect for color changes */
    }

    .logo:hover {
        color: rgb(215, 215, 215);
    }

    .header-cont {
        max-width: 1080px;
        margin: 0 auto; /* Centers the container on larger screens */
        display: flex; /* Use flexbox for positioning children */
        justify-content: space-between; /* Space between logo and login button */
        align-items: center; /* Vertically center the items */
  }
</style>
