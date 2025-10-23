import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedAdminRoute = (props) => {
    const [isAdmin, setIsAdmin] = useState(null);
        const { element: Component } = props;
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            setIsAdmin(false);
            return;
        }

        const docRef = doc(db, "admins", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === "admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        });

        return () => unsubscribe();
    }, []);

    if (isAdmin === null) return <p>Loading...</p>;
    return isAdmin ? <Component /> : <Navigate to="/" />;
};

export default ProtectedAdminRoute;
