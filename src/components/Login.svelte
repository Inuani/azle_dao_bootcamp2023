<script lang="ts">

import { AuthClient } from "@dfinity/auth-client";
import { Principal } from '@dfinity/principal';
import { backend } from "../declarations/backend/index.js";
import { isAuthenticated, userExist, userInfo, principalFromId } from '../stores/user';

let authClient: AuthClient;

    const init = async () => {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        $isAuthenticated = true;
        handleAuthenticated(authClient);
        }
    }

    const logout = async () => {
        $isAuthenticated = false;
        $userExist = false;
        await authClient.logout();
        console.log('logged out!');
    }

    const login = async () => {  
    console.log(process.env.CANISTER_ID_INTERNET_IDENTITY, process.env.DFX_NETWORK);
    await authClient.login({
        identityProvider:
        process.env.DFX_NETWORK === "ic" ?
        "https://identity.ic0.app/#authorize"
        : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943`,
        // : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
        onSuccess: async () => {
        $isAuthenticated = true;
        handleAuthenticated(authClient);
        },
        onError: error => {
        console.error("Login error:", error);
        },
    });
    }

    async function handleAuthenticated(authClient: AuthClient) {
        const identity = await authClient.getIdentity();
        if (identity) {
            principalFromId.set(await authClient.getIdentity().getPrincipal());
            // console.log(principalFromId);
            const userFromBackend = await backend.getUserByPrincipal($principalFromId)
            // console.log('getUserByPrincipal:');
            // console.log(userFromBackend);
            if (userFromBackend && userFromBackend.length > 0) {
                $userInfo = {
                    principal: userFromBackend[0].id,
                    username: userFromBackend[0].username,
                    kaliBalance: userFromBackend[0].kaliBalance
                };
                $userExist = true;
            }
            else {
                $userExist = false;
            }
            console.log("User is authenticated with identity:", identity);
        } else {
            console.log("Failed to retrieve identity");
        }
    }

init();
</script>

{#if !$isAuthenticated}
    <button on:click={login}>
        login with internet identity
    </button>
{:else}
    <p>you are logged in!</p>
    <button on:click={logout}>
        logout
    </button>
{/if}