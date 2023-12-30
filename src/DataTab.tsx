import {useLocation, useNavigate} from "react-router-dom";
import {memo, useCallback, useEffect, useState} from "react";
import {useStore} from "@tanstack/react-store";
import {useInfiniteQuery} from "@tanstack/react-query";
import {PERSON_STORE} from "./personStore";
import {Api_getAll, FormState} from "./api";

export default memo(DataTab
)

function initState(past: boolean, personId: 1 | 2): FormState {
    if (past) {
        return {
            personId: personId,
            isPast: true
        }
    } else return {
        personId: personId,
        isPast: false
    }
}

function DataTab() {

    const navigate = useNavigate()
    const location = useLocation()
    const personStore = useStore(PERSON_STORE, state => state.person!)
    const personId = personStore.id;
    const queryParams = new URLSearchParams(useLocation().search)
    const [formState, setFormState] = useState(() => initState(queryParams.get("past") === "true", personId))
    const {data, status: apiStatus} = useInfiniteQuery({
        queryKey: ['myData', formState],
        queryFn: fetchSessions,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.page.number + 1
    })
    const things = data?.pages.flatMap(p => p.elements) ?? []
    console.log("DATA TAB: ", formState)

    useEffect(() => {
        if (formState.personId !== personId) {
            setFormState({...formState, personId: personId})
        }
    }, [personId]);

    async function fetchSessions({pageParam}: any) {
        return Api_getAll({size: 12, page: pageParam, filter: formState});
    }

    const onChange = useCallback((formState: FormState) => {
        setFormState(formState)
        navigate(location.pathname + `?past=${formState.isPast}`, {replace: true})
    }, [location])

    function getContent() {
        if (apiStatus === 'pending') {
            return (<p>LOADING...</p>)
        }
        return (<div>{things.map((s) => <p key={s.feKey}>{s.name}</p>)}</div>)
    }

    function onActive() {
        onChange({...formState, isPast: false})
    }

    function onPast() {
        onChange({...formState, isPast: true})
    }

    return (
        <div>
            DATA
            <div>
                <button onClick={onActive}>ACTIVE</button>
                <button onClick={onPast}>PAST</button>
                {getContent()}
            </div>
        </div>
    )
}
