import {Store} from "@tanstack/store";

type PersonStore = {
    person: { id: 1 | 2 } | null
}

export const PERSON_STORE = new Store<PersonStore>({
    person: null,
});

export function TraineeStore_clear() {
    PERSON_STORE.setState(store => ({...store, person: null}))
}

export function TraineeStore_putData(data: { id: 1 | 2 }) {
    PERSON_STORE.setState(store => ({...store, person: data}))
}

