import React , { useEffect } from 'react';

import Navbar from '../components/navbar-lp';

// TODO: Change navbar based on whether logged in or logged out

export default function LandingPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <Navbar />
            ABOUT US
        </div>
    )
}