import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom"; // Route Library
import { Layout } from "antd";
import AdminContent from './AdminContent'
import { loggedIn } from "../../../service/Login-Apis";
import ActivityCounter from "./Modals/ActivityCounter";
import ActivityLogin from "./Modals/ActivityLogin";
import { refreshToken } from "../../../service/constant-Apis";
import '../../Styles/content.css'

const { Content } = Layout;

// class PrivateRoute extends Component {
function PrivateRoute (props) {
    const [ lastActivity, setLastActivity ] = useState(false)
    const [login, setLogin ] =useState(false)

    useEffect(() => {
            setInterval(() => {
                const lastApiCalledAt = localStorage.getItem('jwtTimer')
                if (new Date().getTime() - parseInt(lastApiCalledAt) > 55*60*1000 && loggedIn() !=='jwtExpired'){
                    setLastActivity(true)
                }
            }, 60 * 1000)
    })


    const refresh = () => {
        refreshToken().then(res=>{
            if(res.success){
                setLastActivity(false)
            }
        })
    }
    
    const ActivityTimeOut = () =>{
        setLogin(true)
        setLastActivity(false)
        setLogin(false)
    }


    const closeLogin = () =>{
        localStorage.removeItem('jwtExpired')
        setLogin(true)
        setLogin(false)
    }

    return (
        <div className="site-layour-frame">
            <Content
                className="site-layout-background layout-content-custom"
            >
            {loggedIn() ==='jwtExpired' || loggedIn() === true ? 
                <AdminContent /> 
                :
                <Redirect to={{ pathname: '/'}} /> }
                {/* {!stopTime&&restActivity()} */}


                {lastActivity && 
                    <ActivityCounter 
                        visible={lastActivity}
                        refresh={()=>refresh()} 
                        timeOut={()=>ActivityTimeOut()}
                    /> 
                }

                {loggedIn() ==='jwtExpired'&&
                    <ActivityLogin 
                        visible={loggedIn() ==='jwtExpired'} 
                        close={()=>{closeLogin()}}
                    /> 
                }
            </Content>
        </div>
    );
}
export default PrivateRoute;
