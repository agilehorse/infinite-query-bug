import {Moment} from "moment";
import * as React from "react";
import {useEffect, useState} from "react";
import {OverridableStringUnion} from "@mui/types";
import {Box, TextFieldPropsSizeOverrides} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment/moment"

type Props = {
    startText?: React.ReactNode,
    endText?: React.ReactNode,
    startingDate: Moment,
    endingDate: Moment,
    minDate?: Moment,
    maxDate?: Moment,
    onChange: (startingDate: Moment, endingDate: Moment) => void,
    shouldDisableStartingDate?: (startingDate: Moment) => boolean,
    shouldDisableEndingDate?: (endingDate: Moment) => boolean,
    disableFuture?: boolean,
    size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>
}

export default function MyDateRangePicker({
                                              startText,
                                              endText,
                                              startingDate,
                                              endingDate,
                                              minDate,
                                              maxDate,
                                              onChange,
                                              shouldDisableStartingDate,
                                              shouldDisableEndingDate,
                                              disableFuture,
                                              size
                                          }: Readonly<Props>) {

    const [internalStartDate, setInternalStartDate] = useState(startingDate)
    const [internalEndDate, setInternalEndDate] = useState(endingDate)
    const localMinDate = minDate ?? moment(new Date(2020, 0, 1))

    useEffect(() => {
        if (startingDate !== internalStartDate) {
            setInternalStartDate(startingDate)
        }
    }, [startingDate])

    useEffect(() => {
        if (endingDate !== internalEndDate) {
            setInternalEndDate(endingDate)
        }
    }, [endingDate])

    function onInternalStartDateChange(value: Moment | null) {
        if (!value) {
            return
        }
        setInternalStartDate(value)
        if (value.isValid() &&
            value.isSameOrAfter(localMinDate) &&
            value.isSameOrBefore(internalEndDate) &&
            !value.isSame(startingDate)) {

            onChange(value, internalEndDate)
        }
    }

    function onInternalEndDateChange(value: Moment | null) {
        if (!value) {
            return
        }
        setInternalEndDate(value)
        if (value.isValid() &&
            value.isSameOrAfter(internalStartDate) &&
            !value.isSame(endingDate)) {

            onChange(internalStartDate, value)
        }
    }

    return (
        <Box>
            <DatePicker
                label={startText ?? "Starting Date"}
                format='DD.MM.YYYY'
                slotProps={{
                    textField: {
                        size: size,
                        margin: "dense",
                        fullWidth: true,
                        color: "secondary"
                    },
                }}
                onChange={onInternalStartDateChange}
                value={internalStartDate}
                minDate={localMinDate}
                maxDate={internalEndDate}
                disableFuture={disableFuture}
                shouldDisableDate={shouldDisableStartingDate}
            />
            <DatePicker
                label={endText ?? "Ending Date"}
                format='DD.MM.YYYY'
                slotProps={{
                    textField: {
                        size: size,
                        margin: "dense",
                        fullWidth: true,
                        color: "secondary"
                    },
                }}
                onChange={onInternalEndDateChange}
                value={internalEndDate}
                minDate={internalStartDate}
                maxDate={maxDate}
                disableFuture={disableFuture}
                shouldDisableDate={shouldDisableEndingDate}
            />
        </Box>
    )
}