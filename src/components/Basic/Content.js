import React, { Component } from "react";

import { Route } from 'react-router-dom' // Route Library

import { Layout } from "antd";


import Calender from '../Calender/Calender'
import Froms from '../Form'
import Login from '../../pages/Login/login-page'
import Organizations from '../../pages/Contacts/organizaion'
import Contact from '../../pages/Contacts/contact'
import Leads from '../../pages/Contacts/leads'

import Admin from '../../pages/Admin/admin-drawer/admin-sidebar'


const { Content } = Layout;

const pageLinks = [ // Page link and router
    {
        component: Calender,
        link: '/calender'
    },
    {
        component: Froms,
        link: '/forms'
    },
    {
        component: Login,
        link: '/login'
    },
    {
        component: Admin,
        link: '/admin/global-settings'
    },
    {
        component: Admin,
        link: '/admin/calender/holidays'
    },
    {
        component: Admin,
        link: '/admin/calender'
    },
    {
        component: Admin,
        link: '/admin/time-offs'
    },
    {
        component: Admin,
        link: '/admin/time-off-policies'
    },
    {
        component: Admin,
        link: '/admin/roles'
    },
    {
        component: Admin,
        link: '/check'
    },
    {
        component: Organizations,
        link: '/organizations'
    },
    {
        component: Contact,
        link: '/contact'
    },
    {
        component: Contact,
        link: '/leads'
    },
]

class content extends Component {

    getPageLink = () => {
        return (
            pageLinks.map((el,i) => (
                <Route exact path={el.link} component={el.component} key={i}/>
            ))
        );
    }

    render (){
        return (
            <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                }}
            >
                {this.getPageLink()}   
            </Content>
        );
    }
};
export default content;