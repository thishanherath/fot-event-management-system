import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";

function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<h1>Home page</h1>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    )
}

export default AppRoutes;