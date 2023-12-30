import moment, {Moment} from "moment";

export type FormState = { personId: 1 | 2, dateFilter: { startingAt: Moment, endingAt: Moment } | undefined }

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
    const dateFilter = form.filter.dateFilter
    const traineeId = form.filter.personId;

    let dto
    if (dateFilter) {
        dto = {
            ...form,
            filter: {
                ...form.filter,
                dateFilter: {
                    startingAt: moment(dateFilter.startingAt).format("yyyy-MM-DD"),
                    endingAt: moment(dateFilter.endingAt).format("yyyy-MM-DD")
                }
            }
        }
    } else {
        dto = form
    }
    const things = await getUser(dto.filter.personId)
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
