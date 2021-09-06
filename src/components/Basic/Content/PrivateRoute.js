import React, { useState } from "react";
import { Redirect } from "react-router-dom"; // Route Library
import { Layout } from "antd";
import AdminContent from './AdminContent'
import { loggedIn } from "../../../service/Login-Apis";
import ActivityCounter from "./Modals/ActivityCounter";
import ActivityLogin from "./Modals/ActivityLogin";
import { refreshToken } from "../../../service/constant-Apis";

const { Content } = Layout;

// class PrivateRoute extends Component {
function PrivateRoute () {
    let timer, elapsed = true
    const [ lastActivity, setLastActivity ] = useState(false)
    const [ stopTime, setStopTime ] = useState(false)

    const restActivity = () =>{
        if (elapsed){    
            clearTimeout(timer);
            timer = null
            elapsed = false
        }
        if (!stopTime){
            elapsed = true
            timer = setTimeout(() => {
                console.log(timer)
                setLastActivity(true)
                // setStopTime(true)
            //milli * sec * min
            }, 1000 * 60 * 55)
            // }, 10000)
        }   
    }

    const refresh = () => {
        refreshToken().then(res=>{
            if(res.success){
                setLastActivity(false)
                setStopTime(false)
                restActivity()
            }
        })
    }
    
    const ActivityTimeOut = () =>{
        setLastActivity(false)
        setStopTime(true)
    }

    const stopTimeOut = () =>{
        clearTimeout(timer)
        // setLastActivity(false)
        setStopTime(true)
    }

    const closeLogin = () =>{
        setStopTime(false)
        clearTimeout(timer)
        setStopTime(true)
    }

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "16px 16px 10px 16px",
                padding: "24px 24px 10px 24px",
                minHeight: "88vh",
            }}
        >
           {loggedIn() ==='jwtExpired' || loggedIn() === true ? 
            <AdminContent /> 
            :
            <Redirect to={{ pathname: '/'}} /> }
            {!stopTime&&restActivity()}
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
                    stopTimer={()=>{stopTimeOut()}} 
                    close={()=>{closeLogin()}}
                /> 
            }
        </Content>
    );
}
export default PrivateRoute;
