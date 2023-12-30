import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Me from "./Me";
import Client from "./Client";
import {useState} from "react";

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

    function onHomeClick() {
        setValue("/home")
        navigate("/home")
    }

    function onClientClick() {
        setValue("/client")
        navigate("/client")
    }

    function onMeClick() {
        setValue("/me")
        navigate("/me")
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
                    <div>
                        Home
                    </div>
                }/>
                <Route path="*" element={<Navigate to="/home"/>}/>
            </Routes>
            <div>
                <button onClick={onHomeClick} style={value === "/home" ? {color: "red"} : undefined}>HOME</button>
                <button onClick={onClientClick} style={value === "/client" ? {color: "red"} : undefined}>CLIENT</button>
                <button onClick={onMeClick} style={value === "/me" ? {color: "red"} : undefined}>ME</button>
            </div>
        </>
    )
}