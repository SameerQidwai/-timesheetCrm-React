import React, { Component } from "react";
import { Redirect, useLocation } from "react-router-dom"; // Route Library
import { Layout } from "antd";

import { localStore } from "../../../service/constant";
import AdminContent from './AdminContent'
import UserContent from './UserContent'
import { loggedIn } from "../../../service/Login-Apis";

const { Content } = Layout;


// class PrivateRoute extends Component {
function PrivateRoute () {
    const location = useLocation();
    const admin = true
    // console.log('loggedIn()',loggedIn());
    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "16px 16px 10px 16px",
                padding: "24px 24px 10px 24px",
                minHeight: "88vh",
            }}
        >
            { loggedIn()?
                // admin ? <AdminContent />: <UserContent />
                <AdminContent />                
                :
                <Redirect to={{ pathname: '/'}} /> 
            }
        </Content>
    );
}
export default PrivateRoute;

/* 
!{ loggedIn()?
!    admin ? <AdminContent />: <UserContent />                
!    :
!    <Redirect to={{ pathname: '/'}} /> 
!}
*/