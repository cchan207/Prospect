import React , { useEffect, useState } from 'react';
import '../css-files/app.css';
import axios from 'axios';

import Navbar from '../components/navbar-home';

function DefaultHome() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <Navbar />
            JOB DASHBOARD
        </div>
    )
}


function Home() {
  const urlLink = 'http://127.0.0.1:5000/api/v1/search/users/all';
  const [data, setData] = useState({message: [] });
  const [isError, setIsError] = useState(false);

  useEffect(async () => {
    const fetchData = async () => {
      const result = await axios.get(urlLink, { crossorigin:true });
      console.log(result.data);
      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
        <h3>USERS FROM DATABASE</h3>
        <ul>
        {data.message.map(item => (
          <li key={item.name}>
            {item.email}
            </li>
          ))}
        </ul>
    </div>
  );


}

export default DefaultHome;
export { Home };
