import React , { useEffect, useState } from 'react';
import '../css-files/app.css';
import axios from 'axios';
import Dashboard from '../template/Dashboard';

import Navbar from '../components/navbar-lp';

function Home() {
    // Loads page from the top
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <Navbar />
            <a href="/edit-job">Sign Up</a>
            <Dashboard/>
        </div>
    )
}

// function Home() {
//     // Loads page from the top
//     useEffect(() => {
//         window.scrollTo(0, 0)
//     }, [])

//     return (
//         <div>
//             <Dashboard />
//         </div>
//     )

//     const urlLink = 'http://127.0.0.1:5000/api/v1/search/users/all';
//     const [data, setData] = useState({message: [] });
//     const [isError, setIsError] = useState(false);

//     useEffect(async () => {
//         const fetchData = async () => {
//         const result = await axios.get(urlLink, { crossorigin:true });
//         console.log(result.data);
//         setData(result.data);
//         };

//         fetchData();
//     }, []);

//     return (
//       <div>
//         <Navbar />
//           <h3>USERS FROM DATABASE</h3>
//           <ul>
//           {data.message.map(item => (
//             <li key={item.name}>
//               {item.email}
//               </li>
//             ))}
//           </ul>
//       </div>
//     );
// }

export default Home;
