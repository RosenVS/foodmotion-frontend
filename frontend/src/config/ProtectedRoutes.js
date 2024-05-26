// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode'; 

// const useAuth = () => {
//     var jwt_token = localStorage.getItem("accessToken");
//     if (jwt_token) {
//         const decodedToken = jwtDecode(jwt_token); 
//         console.log(decodedToken)
//         if (decodedToken) {
//             return {
//                 auth: true,
//                 roles: decodedToken.roles,
//             };
//         }
//     } else {
//         return {
//             auth: false,
//             roles: null,
//         };
//     }
// };

// const ProtectedRoute = (props) => {
//     const { auth, roles } = useAuth();

//     if (props.roleRequired) {
//         return auth ? (
//             roles.includes(props.roleRequired) ? (
//                 <Outlet />
//             ) : (
//                 <Navigate to="/unauthorized" />
//             )
//         ) : (
//             <Navigate to="/login" />
//         );
//     } else {
//         return auth ? <Outlet /> : <Navigate to="/login" />;
//     }
// };

// export default ProtectedRoute;




import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; 

const useAuth = () => {
    var jwt_token = localStorage.getItem("accessToken");
    if (jwt_token) {
        const decodedToken = jwtDecode(jwt_token); 
        console.log(decodedToken);
        if (decodedToken) {
            return {
                auth: true,
                roles: decodedToken.roles,
                subroles: decodedToken.subroles || [],
            };
        }
    } else {
        return {
            auth: false,
            roles: null,
            subroles: [],
        };
    }
};

const ProtectedRoute = (props) => {
    const { auth, roles, subroles } = useAuth();

    if (props.roleRequired || props.subroleRequired) {
        return auth ? (
            (roles.includes(props.roleRequired) || subroles.includes(props.subroleRequired)) ? (
                <Outlet />
            ) : (
                <Navigate to="/unauthorized" />
            )
        ) : (
            <Navigate to="/login" />
        );
    } else {
        return auth ? <Outlet /> : <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
