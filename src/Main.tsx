import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Me from "./Me";
import Client from "./Client";
import {BottomNavigation, BottomNavigationAction, Box} from "@mui/material";
import {useState} from "react";

type routes = {
    "/me": "/me",
    "/client": "/client",
    "/home": "/home"
}


const routesMap = {
    "/me": "/me",
    "/client": "/client",
    "/home": "/home"
}


export default function Main() {
    const location = useLocation()
    const navigate = useNavigate()
    const [value, setValue] = useState(findSelectedTab())

    function findSelectedTab() {
        const locationPathname = location.pathname
        const nextSlashIndex = locationPathname.indexOf("/", 1)
        if (nextSlashIndex === -1) {
            return locationPathname
        } else {
            return locationPathname.substring(0, nextSlashIndex)
        }
    }

    function onChange(_: any, newValue: keyof routes) {
        setValue(newValue)
        navigate(routesMap[newValue])
    }

    return (
        <>
            <Routes>
                <Route path="/client/*" element={
                    <Client/>
                }/>
                <Route path="/me/*" element={
                    <Me/>
                }/>
                <Route path="/home" element={
                    <Box>
                        Home
                    </Box>
                }/>
                <Route path="*" element={<Navigate to="/home"/>}/>
            </Routes>
            <BottomNavigation
                showLabels
                value={value}
                onChange={onChange}
                color="secondary"
            >
                <BottomNavigationAction
                    label="Home"
                    value={routesMap["/home"]}
                    color="secondary"
                />
                <BottomNavigationAction
                    label="Client"
                    color="secondary"
                    value={routesMap["/client"]}
                />
                <BottomNavigationAction
                    label="Me"
                    color="secondary"
                    value={routesMap["/me"]}
                />
            </BottomNavigation>
        </>
    )
}