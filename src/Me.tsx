import DataTab from "./DataTab";
import {PERSON_STORE, TraineeStore_clear, TraineeStore_putData} from "./personStore";
import {useEffect} from "react";
import {useStore} from "@tanstack/react-store";
import {CircularProgress} from "@mui/material";

export default function Me() {
    const personStore = useStore(PERSON_STORE, state => state.person)

    useEffect(() => {
        if (1 !== personStore?.id) {
            TraineeStore_putData({id : 1})
        }
        return () => {
            TraineeStore_clear()
        }
    }, [])

    return personStore ? <DataTab/> : < CircularProgress/>
}