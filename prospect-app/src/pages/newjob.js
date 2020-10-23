import React , { useEffect } from 'react';

import Navbar from '../components/navbar-lp';

export default function LandingPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <Navbar />
            NEW JOB
        </div>
    )
}