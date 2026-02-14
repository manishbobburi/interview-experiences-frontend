import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

export default function ProtectedRoutes() {
    const isAuthenticated = Boolean(localStorage.getItem("token"));
    const context = useOutletContext();
    
    if(!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet context={context}/>
}
