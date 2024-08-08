import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"

export const Dashboard = () => {

    const [userBalance , setUserBalance] = useState(100);

    useEffect(()=>{

        const getUserBalance= async ()=>
        {

            const token = localStorage.getItem('token');
            // console.log(token);
    
            // Set up the headers with the token
            const config = {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            };
    
            const res = await axios.get("http://localhost:3000/api/v1/account/balance",config);

            setUserBalance( res.data.balance);

        }

        getUserBalance();

    },[])
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={userBalance} />
            <Users />
        </div>
    </div>
}