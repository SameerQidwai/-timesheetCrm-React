import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom"; // Route Library
import { Layout, Modal } from "antd";
import AdminContent from './AdminContent'
import { loggedIn, refreshToken } from "../../../service/Login-Apis";
import ActivityCounter from "./Modals/ActivityCounter";
import ActivityLogin from "./Modals/ActivityLogin";
import '../../Styles/content.css'
import { getCookie, getModulePermissions } from "../../../service/constant";

const { Content } = Layout;
let modaling = null
// class PrivateRoute extends Component {
function PrivateRoute (props) {
    let gstRead = getCookie('gstRead')
    const location = useLocation();
    let redirect = `${location?.pathname ?? ''}${location?.search ?? ''}`;
    const [ lastActivity, setLastActivity ] = useState(false);
    const [login, setLogin ] =useState(false);
    const [openLogin, setOpenLogin ] =useState(false);

    const { modulePermission: {READ: admin = false}} = getModulePermissions('ADMIN_OPTIONS');

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
                setLastActivity(false);
            }else{
                localStorage.clear();
                setLogin(true);
                setOpenLogin(false);
                setLogin(false);
            }
        });
    }
    
    const ActivityTimeOut = () =>{
        setLogin(true);
        setLastActivity(false);
        setOpenLogin(false);
        setLogin(false);
    }


    const closeLogin = () =>{
        localStorage.removeItem('jwtExpired');
        setLogin(true);
        setOpenLogin(false);
        setLogin(false);
    }

    const gstModal = () =>{
        if (!modaling && !gstRead && admin){
            modaling = Modal.info({
                title: `Important Pricing Information`,
                content: 'All prices exclude GST unless explicitly stated otherwise.',
                okText: "Acknowledged",
                onOk: () => {
                    document.cookie = "gstRead=true"
                    modaling.destroy();
                  },
            })
        }
    }

    return (
        <div className="site-layour-frame">
            <Content
                className="site-layout-background layout-content-custom"
            >
            {loggedIn() === 'jwtExpired' || loggedIn() === true ? (
            <AdminContent />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                search:
                  location?.pathname !== '/logout'
                    ? `?redirect=${redirect}`
                    : '',
              }}
            />
          )}
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
            {loggedIn() ==='jwtExpired' || loggedIn() === true && gstModal()}
        </div>
    );
}
export default PrivateRoute;


