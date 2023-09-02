export const idlFactory = ({ IDL }) => {
  const PropState = IDL.Variant({
    'closed' : IDL.Null,
    'open' : IDL.Null,
    'rejected' : IDL.Null,
    'accepted' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'title' : IDL.Text,
    'body' : IDL.Text,
    'state' : PropState,
    'numero' : IDL.Float64,
    'idFrom' : IDL.Principal,
    'created_at_time' : IDL.Nat,
  });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'kaliBalance' : IDL.Nat,
    'username' : IDL.Text,
  });
  const _InlineDeleteUserReturnTypeTypeArg1 = IDL.Variant({
    'userDoesNotExist' : IDL.Principal,
  });
  const _AzleResult = IDL.Variant({
    'Ok' : User,
    'Err' : _InlineDeleteUserReturnTypeTypeArg1,
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const TransferArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
  });
  const TransactionKind = IDL.Variant({
    'Burn' : IDL.Null,
    'Mint' : IDL.Null,
    'Transfer' : IDL.Null,
  });
  const Transaction = IDL.Record({
    'fee' : IDL.Nat,
    'args' : IDL.Opt(TransferArgs),
    'from' : IDL.Opt(Account),
    'kind' : TransactionKind,
    'timestamp' : IDL.Nat64,
  });
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const _InlineTransferErrorGenericError = IDL.Record({
    'message' : IDL.Text,
    'error_code' : IDL.Nat,
  });
  const _InlineTransferErrorBadBurn = IDL.Record({
    'min_burn_amount' : IDL.Nat,
  });
  const _InlineTransferErrorDuplicate = IDL.Record({
    'duplicate_of' : IDL.Nat,
  });
  const _InlineTransferErrorBadFee = IDL.Record({ 'expected_fee' : IDL.Nat });
  const _InlineTransferErrorCreatedInFuture = IDL.Record({
    'ledger_time' : IDL.Nat64,
  });
  const _InlineTransferErrorInsufficientFunds = IDL.Record({
    'balance' : IDL.Nat,
  });
  const TransferError = IDL.Variant({
    'GenericError' : _InlineTransferErrorGenericError,
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : _InlineTransferErrorBadBurn,
    'Duplicate' : _InlineTransferErrorDuplicate,
    'BadFee' : _InlineTransferErrorBadFee,
    'CreatedInFuture' : _InlineTransferErrorCreatedInFuture,
    'TooOld' : IDL.Null,
    'InsufficientFunds' : _InlineTransferErrorInsufficientFunds,
  });
  const TransferResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferError });
  return IDL.Service({
    'add' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'createProposal' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [Proposal],
        [],
      ),
    'createUser' : IDL.Func([IDL.Principal, IDL.Text], [User], []),
    'deleteUser' : IDL.Func([IDL.Principal], [_AzleResult], []),
    'get' : IDL.Func([], [IDL.Nat], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getUserByPrincipal' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(User)],
        ['query'],
      ),
    'get_transactions' : IDL.Func(
        [IDL.Opt(IDL.Nat64), IDL.Opt(IDL.Nat64)],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'icrc1_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
        ['query'],
      ),
    'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account)], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'inc' : IDL.Func([], [IDL.Nat], []),
    'readUsers' : IDL.Func([], [IDL.Vec(User)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
