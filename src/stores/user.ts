import { writable } from 'svelte/store';
import { Principal } from '@dfinity/principal';

export const isAuthenticated = writable(false);
export const userExist = writable(false);
export const userInfo = writable<{ principal: Principal; username: string ; kaliBalance : bigint } | null>(null);
export const principalFromId = writable<Principal | null>(null);
export const allProposals = writable([]);