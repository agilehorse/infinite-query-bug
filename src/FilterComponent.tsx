import moment from "moment/moment";
import {Box, Card, Chip} from "@mui/material";
import MyDateRangePicker from "./MyDateRangePicker";
import {Moment} from "moment";
import {FormState} from "./api";

type Props = {
    value: FormState,
    onChange: (value: FormState) => void,
    onTypeChange: (performed: boolean) => void,
}

export default function FilterComponent({value, onChange, onTypeChange}: Readonly<Props>) {

    const dateFilter = value.dateFilter

    async function onPastClick() {
        onTypeChange(true)
    }

    async function onActiveClick() {
        onTypeChange(false)
    }

    async function onDatesChange(s: Moment, e: Moment) {
        onChange({...value, dateFilter: {startingAt: s, endingAt: e}})
    }

    return (
        <Card sx={sx.card}>
            <Box sx={sx.toolbar}>
                <Chip
                    sx={sx.chip}
                    label="Active" color="secondary"
                    variant={dateFilter ? "outlined" : "filled"}
                    onClick={onActiveClick}
                />
                <Chip
                    sx={sx.chip}
                    label="Past" color="secondary"
                    variant={dateFilter ? "filled" : "outlined"}
                    onClick={onPastClick}
                />
            </Box>
            {dateFilter &&
                <Box sx={sx.dateRangePicker}>
                    <MyDateRangePicker
                        startingDate={dateFilter.startingAt}
                        endingDate={dateFilter.endingAt}
                        maxDate={moment().endOf('day')}
                        onChange={onDatesChange}
                        size="medium"
                    />
                </Box>
            }
        </Card>
    )
}

const sx = {
    card: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    toolbar: {
        p: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    chip: {
        fontSize: "1.1rem",
        flexGrow: 1,
        mx: 0.5,
        maxWidth: 200
    },
    dateRangePicker: {
        px: 1,
        pb: 0.5
    }
}