export type FormState = { personId: 1 | 2, isPast: boolean }

export type SearchTrainingSessionsForm = {
    size: number,
    page: number,
    filter: FormState
}

function tef_fillSessionFeKeys(things: Thing[]) {
    for (const thing of things) {
        thing.feKey = Math.abs(Math.random())
    }
}

export async function Api_getAll(form: SearchTrainingSessionsForm) {
    const traineeId = form.filter.personId;

    const things = await getUser(traineeId)
    tef_fillSessionFeKeys(things)
    return {elements: things, page: {number: 0, totalElements: 2}, personId: traineeId}
}

type Thing = {
    id: number,
    feKey: undefined | number
    name: string,
}

let users: Thing[] = [
    {
        id: 1,
        feKey: undefined,
        name: 'apple',
    },
    {
        id: 1,
        feKey: undefined,
        name: 'banana'
    },
    {
        id: 2,
        feKey: undefined,
        name: 'apple'
    },
    {
        id: 2,
        feKey: undefined,
        name: 'drugs'
    },
];

const getUser = (id: 1 | 2): Promise<Thing[]> =>
    new Promise((resolve, reject) => {
        const user = users[id];

        if (!user) {
            return setTimeout(
                () => reject(new Error('User not found')),
                250
            );
        }

        return setTimeout(() => resolve(users.filter(u => u.id === id)), 250);
    });
