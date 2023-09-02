import { 
    Principal,
    StableBTreeMap,
    Record,
    Variant,
    nat,
    $query,
    $update,
    Vec,
    ic
    } from 'azle';

type Proposal = Record<{
    numero: number;
    title: string;
    body: string;
    idFrom: Principal;
    state: PropState;
    created_at_time: nat;
}>;

type PropState = Variant<{
    open: null;
    rejected: null;
    accepted: null;
    closed: null;
}>;

let dbProposals = new StableBTreeMap<number, Proposal>(2, 20, 10_000);

$query;
export function getAllProposals(): Vec<Proposal> {
    return dbProposals.values();
}

$query;
export function getnbProposals(): number {
    return dbProposals.values().length;
}

$update;
export function createProposal(idFrom: Principal, title: string, body: string) : Proposal {
    const newProposal: Proposal = {
        numero: getnbProposals(),
        title,
        body,
        idFrom,
        state: {open : null},
        created_at_time: ic.time()
    };
    console.log('nb of proposals:', getnbProposals());
    dbProposals.insert(getnbProposals(), newProposal);
    return newProposal;
}