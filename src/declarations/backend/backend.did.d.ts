import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export type PropState = { 'closed' : null } |
  { 'open' : null } |
  { 'rejected' : null } |
  { 'accepted' : null };
export interface Proposal {
  'title' : string,
  'body' : string,
  'state' : PropState,
  'numero' : number,
  'idFrom' : Principal,
  'created_at_time' : bigint,
}
export interface SupportedStandard { 'url' : string, 'name' : string }
export interface Transaction {
  'fee' : bigint,
  'args' : [] | [TransferArgs],
  'from' : [] | [Account],
  'kind' : TransactionKind,
  'timestamp' : bigint,
}
export type TransactionKind = { 'Burn' : null } |
  { 'Mint' : null } |
  { 'Transfer' : null };
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export type TransferError = {
    'GenericError' : _InlineTransferErrorGenericError
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : _InlineTransferErrorBadBurn } |
  { 'Duplicate' : _InlineTransferErrorDuplicate } |
  { 'BadFee' : _InlineTransferErrorBadFee } |
  { 'CreatedInFuture' : _InlineTransferErrorCreatedInFuture } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : _InlineTransferErrorInsufficientFunds };
export type TransferResult = { 'Ok' : bigint } |
  { 'Err' : TransferError };
export interface User {
  'id' : Principal,
  'kaliBalance' : bigint,
  'username' : string,
}
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export type _AzleResult = { 'Ok' : User } |
  { 'Err' : _InlineDeleteUserReturnTypeTypeArg1 };
export type _InlineDeleteUserReturnTypeTypeArg1 = {
    'userDoesNotExist' : Principal
  };
export interface _InlineTransferErrorBadBurn { 'min_burn_amount' : bigint }
export interface _InlineTransferErrorBadFee { 'expected_fee' : bigint }
export interface _InlineTransferErrorCreatedInFuture { 'ledger_time' : bigint }
export interface _InlineTransferErrorDuplicate { 'duplicate_of' : bigint }
export interface _InlineTransferErrorGenericError {
  'message' : string,
  'error_code' : bigint,
}
export interface _InlineTransferErrorInsufficientFunds { 'balance' : bigint }
export interface _SERVICE {
  'add' : ActorMethod<[bigint], bigint>,
  'createProposal' : ActorMethod<[Principal, string, string], Proposal>,
  'createUser' : ActorMethod<[Principal, string], User>,
  'deleteUser' : ActorMethod<[Principal], _AzleResult>,
  'get' : ActorMethod<[], bigint>,
  'getAllProposals' : ActorMethod<[], Array<Proposal>>,
  'getUserByPrincipal' : ActorMethod<[Principal], [] | [User]>,
  'get_transactions' : ActorMethod<
    [[] | [bigint], [] | [bigint]],
    Array<Transaction>
  >,
  'icrc1_balance_of' : ActorMethod<[Account], bigint>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, Value]>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], TransferResult>,
  'inc' : ActorMethod<[], bigint>,
  'readUsers' : ActorMethod<[], Array<User>>,
}
