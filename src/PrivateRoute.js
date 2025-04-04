import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const PrivateRoute = ({ permissionCheckUrl, children, scoring_type }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [navigationTarget, setNavigationTarget] = useState(null);
    const { posterId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;

        async function checkAuth() {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/home/validate_token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!ignore) {
                if (response.status === 200) {
                    setIsAuthenticated(true);

                    if (permissionCheckUrl) {
                        const urlWithId = permissionCheckUrl.replace(":id", posterId);

                        const response = await fetch(urlWithId + `/checkforall?scoring_type=${scoring_type}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        });

                        if (response.status === 200) {
                            setIsAuthorized(true);

                        } else {
                            setIsAuthorized(false);
                        }
                    }
                }
                setIsLoading(false);
            }
        }

        checkAuth();
        return () => { ignore = true; };
    }, [permissionCheckUrl, posterId]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                setNavigationTarget('/login');
            } else if (isAuthenticated && !isAuthorized) {
                setNavigationTarget('/');
            }
        }
    }, [isLoading, isAuthenticated, isAuthorized]);

    useEffect(() => {
        if (navigationTarget) {
            navigate(navigationTarget);
        }
    }, [navigationTarget, navigate]);
    console.log({ isLoading, isAuthenticated, isAuthorized });
    // if (isLoading) {
    //     // return <div>Loading...</div>;
    //     return <div></div>;

    // }
    return children;
};

export default PrivateRoute;

