import {Box, Card, CircularProgress, List, Theme, Typography} from "@mui/material";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {memo, useCallback, useEffect, useState} from "react";
import {useStore} from "@tanstack/react-store";
import {useInfiniteQuery} from "@tanstack/react-query";
import moment from "moment";
import {PERSON_STORE} from "./personStore";
import {Api_getAll, FormState} from "./api";
import FilterComponent from "./FilterComponent";

export default memo(DataTab
)

function initState(past: boolean, queryParams: URLSearchParams, personId: 1 | 2): FormState {
    if (past) {
        const startingAt = queryParams.get("startingAt")
        const endingAt = queryParams.get("endingAt")
        return {
            personId: personId,
            dateFilter: {
                startingAt: startingAt ? moment(startingAt) : moment().subtract(4, 'weeks'),
                endingAt: endingAt ? moment(endingAt) : moment()
            }
        }
    } else return {
        personId: personId,
        dateFilter: undefined
    }
}

function DataTab() {

    const navigate = useNavigate()
    const location = useLocation()
    const personStore = useStore(PERSON_STORE, state => state.person!)
    const personId = personStore.id;
    const queryParams = new URLSearchParams(useLocation().search)
    const [formState, setFormState] = useState(initState(queryParams.get("pastasd") === "true", queryParams, personId))
    const isShowingPast = formState.dateFilter != null
    const {
        data, status: apiStatus, isFetchingNextPage,
        error, fetchNextPage
    } = useInfiniteQuery({
        queryKey: ['myData', formState],
        queryFn: fetchSessions,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.page.number + 1
    })

    console.log("DATA TAB: ", personId, data)

    async function fetchSessions({pageParam}: any) {
        return Api_getAll({size: 12, page: pageParam, filter: formState});
    }

    const firstPage = data?.pages.at(0);
    const total = firstPage ? firstPage.page?.totalElements : 0
    const things = data?.pages.flatMap(p => p.elements) ?? []

    useEffect(() => {
        document.addEventListener('scroll', onScroll)
        return () => document.removeEventListener('scroll', onScroll)
    }, [])

    const onScroll = useCallback(async () => {
        if (!data) {
            return
        }
        const currentCount = data.pages.map(p => p.elements.length).reduce((acc, val) => acc + val)
        if (ff_getDocHeight() === ff_getScrollXY()[1] + window.innerHeight && total > currentCount) {
            await fetchNextPage()
        }
    }, [total, data, fetchNextPage])

    const onChange = useCallback((formState: FormState) => {
        setFormState(formState)
        let query
        if (formState.dateFilter) {
            const formattedStartingAt = moment(formState.dateFilter.startingAt).format('yyyy-MM-DD')
            const formattedEndingAt = moment(formState.dateFilter.endingAt).format('yyyy-MM-DD')
            query = `?past=true&startingAt=${formattedStartingAt}&endingAt=${formattedEndingAt}`
        } else {
            query = '?past=false'
        }
        navigate(location.pathname + query, {replace: true})
    }, [location])

    const onTypeChange = useCallback((performed: boolean) => {
        onChange(initState(performed, queryParams, personId))
    }, [onChange, queryParams, personId])

    useCallback(() => {
        const dateFilter = formState.dateFilter!
        const previousMonth = moment(dateFilter.startingAt.add(-1, 'months'))
        const newDateFilter = {...dateFilter, startingAt: previousMonth}
        onChange({...formState, dateFilter: newDateFilter})
    }, [formState, onChange]);

    function getContent() {
        if (apiStatus === 'pending' || !data) {
            return (
                <CircularProgress/>
            )
        }
        if (error) {
            return (
                <Box>
                    {error.message}
                </Box>
            )
        }
        if (things.length === 0) {
            return (
                <Typography variant="h6" sx={sx.noData}>
                    No {isShowingPast ? "past" : "active"} data shown
                </Typography>
            )
        }
        return (
            <>
                <List sx={sx.card} component={Card} id="list-card">
                    {things.map((s) =>
                        <Box
                            key={s.feKey}
                        >
                            {s.name}
                        </Box>
                    )}
                </List>
                {isFetchingNextPage &&
                    <CircularProgress/>
                }
            </>
        )
    }

    return (
        <Routes>
            <Route path="/" element={
                <Box sx={sx.listContainer} className="list-container">
                    DATA
                    <Box width="100%" flexGrow={1}>
                        <FilterComponent
                            value={formState}
                            onChange={onChange}
                            onTypeChange={onTypeChange}
                        />
                        {getContent()}
                    </Box>
                </Box>
            }/>
            <Route path="/other" element={
                <Box>
                    Other
                </Box>
            }/>
        </Routes>
    )
}

const sx = {
    listContainer: (t: Theme) => ({
        p: 2,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        [t.breakpoints.up("sm")]: {
            maxWidth: 700,
        },
    }),
    noData: {
        pt: 3,
        textAlign: "center"
    },
    card: (t: Theme) => ({
        width: "100%",
        my: 2,
        py: 0,
        boxShadow: 3,
        [t.breakpoints.up("sm")]: {
            boxShadow: 8,
        },
    })
}

export function ff_getScrollXY() {
    let scrOfX = window.scrollX, scrOfY = window.scrollY
    if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        //DOM compliant
        scrOfY = document.body.scrollTop
        scrOfX = document.body.scrollLeft
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop
        scrOfX = document.documentElement.scrollLeft
    }
    return [scrOfX, scrOfY]
}

export function ff_getDocHeight() {
    const d = document
    return Math.max(
        d.body.scrollHeight, d.documentElement.scrollHeight,
        d.body.offsetHeight, d.documentElement.offsetHeight,
        d.body.clientHeight, d.documentElement.clientHeight
    )
}