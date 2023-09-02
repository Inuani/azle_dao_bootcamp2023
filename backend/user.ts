import { 
    $query,
    $update,
    Opt,
    Principal,
    StableBTreeMap,
    Record,
    Vec,
    Result,
    Variant,
    match,
    ic,
    nat
    } from 'azle';
import { TransferArgs, Account} from './token/types';
import { handle_mint } from './token/transfer/mint';
import { handle_transfer } from './token/transfer/transfer';
import { icrc1_balance_of } from './token/api';
import { state } from './token/state';

type User = Record<{
    id: Principal;
    username: string;
    kaliBalance: nat;
}>;

type UserAccount = Record<{
    account: Account;
    balance: nat;
}>;

let dbUsers = new StableBTreeMap<Principal, User>(0, 38, 10_000);
let dbAccounts = new StableBTreeMap<Principal, UserAccount>(1, 38, 10_000);

// function accountExists(principal: Principal): boolean {
//     const accountOpt = dbAccounts.get(principal);
//     return accountOpt !== Opt.None;
// }

    function getAccountByPrincipal(principal: Principal): Opt<UserAccount> {
        return dbAccounts.get(principal);
    }

    $update;
    export function createUser(id: Principal, username: string): User {
        const user: User = {
            id,
            username,
            kaliBalance: 0n
        }

        // Initial amount token logic
        // const existingAccount = getAccountByPrincipal(id);
        // console.log(existingAccount);
        // if (existingAccount === Opt.None)
        // {
            const account4User: UserAccount = {
                account: { 
                    owner: id,
                    subaccount: Opt.None
                },
                balance: 0n
            };

            const kaliAccount: Account  = {
                owner: Principal.fromText(process.env.CANISTER_ID_BACKEND!),
                subaccount: Opt.None
            };

            const mintArgs: TransferArgs = {
                to: kaliAccount,
                fee: Opt.None,
                memo: Opt.None,
                from_subaccount: Opt.None, 
                created_at_time: Opt.Some(ic.time()), 
                amount: 100n
            };

            handle_mint(mintArgs, Opt.None);
            console.log('total supply: ', state.total_supply);
        
            const transferArgs: TransferArgs = {
                to: account4User.account,
                fee: Opt.None,
                memo: Opt.None,
                from_subaccount: Opt.None, 
                created_at_time: Opt.Some(ic.time()), 
                amount: 100n
            };
        
            handle_transfer(transferArgs, kaliAccount);
            account4User.balance = icrc1_balance_of(account4User.account);
            user.kaliBalance = account4User.balance;

            dbAccounts.insert(id, account4User);
        // }
        // else 
        // {
        //     if (existingAccount.Some !== undefined)
        //         user.kaliBalance = existingAccount.Some.balance;
        // }

        dbUsers.insert(user.id, user);
        return user;
    }

    $update;
    export function deleteUser(id: Principal) : Result<User, Variant<{userDoesNotExist: Principal}>> {
        const user = dbUsers.get(id);
        // const userAccount = dbAccounts.get(id);

        return match(user, {
            Some: (user) => {
                dbUsers.remove(user.id);

                dbAccounts.remove(user.id);
                return {
                    Ok: user
                };
            },
            None: () => {
                return {
                    Err: {
                        userDoesNotExist: id
                    }
                }
            }
        });
    }

    $query;
    export function getUserByPrincipal(id: Principal) : Opt<User> {
        return dbUsers.get(id);
    }

    $query;
    export function readUsers(): Vec<User> {
        return dbUsers.values();
    }
    
