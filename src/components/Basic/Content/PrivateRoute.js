import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom"; // Route Library
import { Layout } from "antd";
import AdminContent from './AdminContent'
import { loggedIn, refreshToken } from "../../../service/Login-Apis";
import ActivityCounter from "./Modals/ActivityCounter";
import ActivityLogin from "./Modals/ActivityLogin";
import '../../Styles/content.css'

const { Content } = Layout;

// class PrivateRoute extends Component {
function PrivateRoute (props) {
    const [ lastActivity, setLastActivity ] = useState(false)
    const [login, setLogin ] =useState(false)
    const [openLogin, setOpenLogin ] =useState(false)

    useEffect(() => {
        // gotta do it to check right after the page is refreshed
        let lastApiCalled = localStorage.getItem('jwtTimer')
        if (new Date().getTime() - parseInt(lastApiCalled) > 60*60*1000 ){
            localStorage.setItem('jwtExpired', true)
            setOpenLogin(true)
        }else{
            setInterval(() => {
                // gotta do it to check every min
                let lastApiCalledAt = localStorage.getItem('jwtTimer')
                if (new Date().getTime() - parseInt(lastApiCalledAt) > 55*60*1000 && loggedIn() !=='jwtExpired'){
                    setLastActivity(true)
                }
            }, 60 * 1000)
        }
    })


    const refresh = () => {
        refreshToken().then(res=>{
            if(res.success){
                setLastActivity(false)
            }else{
                localStorage.clear()
                setLogin(true)
                setOpenLogin(false)
                setLogin(false)
            }
        })
    }
    
    const ActivityTimeOut = () =>{
        setLogin(true)
        setLastActivity(false)
        setOpenLogin(false)
        setLogin(false)
    }


    const closeLogin = () =>{
        localStorage.removeItem('jwtExpired')
        setLogin(true)
        setOpenLogin(false)
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

                {/* {loggedIn() ==='jwtExpired'&& */} {/** if activity login do something fuzzy uncomment this */}
                    <ActivityLogin 
                        visible={loggedIn() ==='jwtExpired' || openLogin} 
                        close={()=>{closeLogin()}}
                    /> 
                {/* } */}
            </Content>
        </div>
    );
}
export default PrivateRoute;
