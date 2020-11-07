import React, { Component } from "react";

import { Route } from 'react-router-dom' // Route Library

import { Layout } from "antd";

import Organizations from '../../pages/Contacts/Org & Info/Organizations'
import Admin from '../../pages/Admin/admin-drawer/admin-sidebar'
import OrgInfo from '../../pages/Contacts/Org & Info/OrgInfo'
import Contact from '../../pages/Contacts/Contact'
import Leads from '../../pages/Contacts/Leads'
import TimeSheet from '../../pages/TimeSheet'
import Calender from '../Calender/Calender'
import Login from '../../pages/Login/Login'


const { Content } = Layout;

const pageLinks = [ // Page link and router
    {
        component: Calender,
        link: '/calender'
    },
    // {
    //     component: Froms,
    //     link: '/forms'
    // },
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
        link: '/admin/calender/holidays/:id'
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
        link: '/admin/standard-levels'
    },
    {
        component: Admin,
        link: '/admin/skills'
    },
    {
        component: Admin,
        link: '/admin/panels'
    },
    {
        component: Admin,
        link: '/admin/panels/info/:id'
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
        component: OrgInfo,
        link: '/organizations/info/:id'
    },
    {
        component: Contact,
        link: '/contact'
    },
    {
        component: Leads,
        link: '/leads'
    },
    {
        component: TimeSheet,
        link: '/time-sheet'
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
                    minHeight: '86vh'
                }}
            >
                {this.getPageLink()}   
            </Content>
        );
    }
};
export default content;