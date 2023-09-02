import { State, Account } from './types';
import { Opt, Principal } from 'azle';

let KaliAccount: Account = {
    // owner: Principal.fromText(process.env.CANISTER_ID_BACKEND),
    owner: Principal.fromText('bkyz2-fmaaa-aaaaa-qaaaq-cai'),
    subaccount: Opt.None
};

export let state: State = {
    accounts: {},
    decimals: 8,
    fee: 100n,
    metadata: [],
    minting_account: Opt.Some(KaliAccount),
    name: 'Kali',
    permitted_drift_nanos: Opt.Some(60_000_000_000n),
    supported_standards: [
        {
            name: "ICRC-1", 
            url: "https://github.com/dfinity/ICRC-1"
        }
    ],
    symbol: 'KLI',
    total_supply: 0n,
    transactions: [],
    transaction_window_nanos: Opt.Some(24n * 60n * 60n * 1_000_000_000n)
};