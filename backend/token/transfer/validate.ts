import { balance_of } from '../account';
import { blob, ic, nat, nat64, Opt, Principal, match } from 'azle';
import { state } from '../state';
import { is_minting_account } from '../transfer/mint';
import {
    Account,
    Subaccount,
    TransferArgs,
    ValidateTransferResult
} from '../types';

export function validate_transfer(
    args: TransferArgs,
    from: Account
): ValidateTransferResult {
    const from_is_anonymous = is_anonymous(from.owner);

    if (from_is_anonymous === true) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'anonymous user is not allowed to transfer funds'
                }
            }
        };
    }

    const from_subaccount_is_valid = is_subaccount_valid(args.from_subaccount);

    if (from_subaccount_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'from_subaccount must be 32 bytes in length'
                }
            }
        };
    }

    const to_subaccount_is_valid = is_subaccount_valid(args.to.subaccount);

    if (to_subaccount_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'to.subaccount must be 32 bytes in length'
                }
            }
        };
    }

    const memo_is_valid = is_memo_valid(args.memo);

    if (memo_is_valid === false) {
        return {
            err: {
                GenericError: {
                    error_code: 0n,
                    message: 'memo must be a maximum of 32 bytes in length'
                }
            }
        };
    }

    const created_at_time_is_in_future = is_created_at_time_in_future(
        args.created_at_time
    );

    if (created_at_time_is_in_future === true) {
        return {
            err: {
                CreatedInFuture: {
                    ledger_time: ic.time()
                }
            }
        };
    }

    const created_at_time_too_old = is_created_at_time_too_old(
        args.created_at_time
    );

    if (created_at_time_too_old === true) {
        return {
            err: {
                TooOld: null
            }
        };
    }

    const duplicate_transaction_index = find_duplicate_transaction_index(args, from);

    match(duplicate_transaction_index, {
        Some: (index) => {
            return {
                err: {
                    Duplicate: {
                        duplicate_of: index
                    }
                }
            };
        },
        None: () => {}
    });
    

    const from_is_minting_account = is_minting_account(from.owner);
    
    const fee: bigint = match(args.fee, {
        Some: (actualFee) => actualFee,
        None: () => 0n
    });

    if (from_is_minting_account === true && fee !== 0n) {
        return {
            err: {
                BadFee: {
                    expected_fee: 0n
                }
            }
        };
    }

    const to_is_minting_account = is_minting_account(args.to.owner);

    if (to_is_minting_account === true) {
        if (fee !== 0n) {
            return {
                err: {
                    BadFee: {
                        expected_fee: 0n
                    }
                }
            };
        }

        if (args.amount < state.fee) {
            return {
                err: {
                    BadBurn: {
                        min_burn_amount: state.fee
                    }
                }
            };
        }
    }

    if (!from_is_minting_account && !to_is_minting_account) {
        if ((fee ?? state.fee) !== state.fee) {
            return {
                err: {
                    BadFee: {
                        expected_fee: state.fee
                    }
                }
            };
        }
    }

    const from_balance = balance_of(from);

    if (
        from_is_minting_account === false &&
        from_balance < args.amount + state.fee
    ) {
        return {
            err: {
                InsufficientFunds: {
                    balance: from_balance
                }
            }
        };
    }

    return {
        ok: true
    };
}

function is_anonymous(principal: Principal): boolean {
    return principal.toText() === '2vxsx-fae';
}

export function is_subaccount_valid(subaccount: Opt<Subaccount>): boolean {
    return match (subaccount, {
        Some: (subacc) => subacc.length === 4,
        None: () => true
    })
}

function is_memo_valid(memo: Opt<blob>): boolean {
    return match (memo, {
        Some: (m) => m.length <= 4,
        None: () => true
    });
}

function is_created_at_time_in_future(created_at_time: Opt<nat64>): boolean {
    const now = ic.time();

    // let x = created_at_time.Some;
    // let tx_time;
    // if (x === undefined)
    //     tx_time = now;
    // else
    //     tx_time = created_at_time;

        const tx_time = match(created_at_time, {
            Some: (actualTime) => actualTime,
            None: () => now
        });
        
        const permitted_drift = match(state.permitted_drift_nanos, {
            Some: (actualValue) => actualValue,
            None: () => 0n
        });

    if (tx_time > now && tx_time - now > permitted_drift) {
        return true;
    } else {
        return false;
    }
}

function is_created_at_time_too_old(created_at_time: Opt<nat64>): boolean {
    const now = ic.time();

    const tx_time = match(created_at_time, {
        Some: (actualTime) => actualTime,
        None: () => now
    });
    
    const transaction_window = match(state.transaction_window_nanos, {
        Some: (actualValue) => actualValue,
        None: () => 0n
    });

    const permitted_drift = match(state.permitted_drift_nanos, {
        Some: (actualValue) => actualValue,
        None: () => 0n
    });

    if (
        tx_time < now &&
        now - tx_time > transaction_window + permitted_drift
    ) {
        return true;
    } else {
        return false;
    }
}

function find_duplicate_transaction_index(
    transfer_args: TransferArgs,
    from: Account
): Opt<nat> {
    const now = ic.time();

    const permitted_drift = match(state.permitted_drift_nanos, {
        Some: (actualValue) => actualValue,
        None: () => 0n
    });

    const transaction_window = match(state.transaction_window_nanos, {
        Some: (actualValue) => actualValue,
        None: () => 0n
    });

    for (let i = 0; i < state.transactions.length; i++) {
        const transaction = state.transactions[i];

        if (
            stringify({
                ...transfer_args,
                from
            }) === stringify({
                ...transaction.args,
                from: transaction.from
            }) &&
            transaction.timestamp < now + permitted_drift &&
            now - transaction.timestamp <
            transaction_window + permitted_drift
        ) {
            return { Some: BigInt(i) };
        }
    }
    return { None: null };
}

export function stringify(value: any): string {
    return JSON.stringify(value, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}