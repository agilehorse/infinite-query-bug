import DataTab from "./DataTab";
import {PERSON_STORE, TraineeStore_clear, TraineeStore_putData} from "./personStore";
import {useEffect} from "react";
import {useStore} from "@tanstack/react-store";

export default function Client() {
    const personStore = useStore(PERSON_STORE, state => state.person)

    useEffect(() => {
        if (2 !== personStore?.id) {
            TraineeStore_putData({id: 2})
        }
        return () => {
            TraineeStore_clear()
        }
    }, [])

    return personStore ? <DataTab/> : <p>LOADING...</p>
}