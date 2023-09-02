import { balance_of, set_account_balance } from '../account';
import { ic, match } from 'azle';
import { state } from '../state';
import {
    Account,
    Transaction,
    TransactionKind,
    TransferArgs,
    TransferResult
} from '../types';

export function handle_transfer(args: TransferArgs, from: Account): TransferResult {
    const kind: TransactionKind = {
        Transfer: null
    };

    const fee: bigint = match(args.fee, {
        Some: (actualFee) => actualFee,
        None: () => state.fee
    });
    
    set_account_balance(from, balance_of(from) - args.amount - fee);
    set_account_balance(args.to, balance_of(args.to) + args.amount);

    match(state.minting_account, {
        Some: (mintAcc) => {
            set_account_balance(mintAcc, balance_of(mintAcc) + fee);
        },
        None: () => {} // Do nothing if there's no minting account
    });
    
    state.total_supply -= fee;

    const transaction: Transaction = {
        args: { Some: args},
        fee,
        from: { Some: from },
        kind,
        timestamp: ic.time()
    };

    state.transactions.push(transaction);

    const transfer_result: TransferResult = {
        Ok: args.amount
    };

    return transfer_result;
}