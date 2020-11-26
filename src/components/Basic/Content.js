import React, { Component } from "react";

import { Route } from "react-router-dom"; // Route Library

import { Layout } from "antd";

import Login from "../../pages/Login/Login";

import Organizations from "../../pages/Contacts/Org & Info/Organizations";
import OrgInfo from "../../pages/Contacts/Org & Info/OrgInfo";
import Employees from "../../pages/Employees & Info/Employees";
import EmpInfo from "../../pages/Employees & Info/EmpInfo";
import Contractors from "../../pages/Contractors & Info/Contractors";
import ContInfo from "../../pages/Contractors & Info/ContInfo";
import Contact from "../../pages/Contacts/Contact";
import TimeSheet from "../../pages/TimeSheet";
import TimeOff from "../../pages/Time/TimeOff";

import Admin from "../../pages/Admin/admin-drawer/admin-sidebar";
import Leads from "../../pages/Contacts/Leads";
import Calender from "../Calender/Calender";

const { Content } = Layout;

const pageLinks = [
    // Page link and router
    {
        component: Calender,
        link: "/calender",
    },
    // {
    //     component: Froms,
    //     link: '/forms'
    // },
    {
        component: Login,
        link: "/login",
    },
    {
        component: Admin,
        link: "/admin/global-settings",
    },
    {
        component: Admin,
        link: "/admin/calenders/holidays/:id",
    },
    {
        component: Admin,
        link: "/admin/calenders",
    },
    {
        component: Admin,
        link: "/admin/holiday-types",
    },
    {
        component: Admin,
        link: "/admin/time-offs",
    },
    {
        component: Admin,
        link: "/admin/time-off-policies",
    },
    {
        component: Admin,
        link: "/admin/roles",
    },
    {
        component: Admin,
        link: "/admin/standard-levels",
    },
    {
        component: Admin,
        link: "/admin/skills",
    },
    {
        component: Admin,
        link: "/admin/panels",
    },
    {
        component: Admin,
        link: "/admin/panels/info/:id",
    },
    {
        component: Admin,
        link: "/check",
    },
    {
        component: Organizations,
        link: "/organizations",
    },
    {
        component: OrgInfo,
        link: "/organizations/info/:id",
    },
    {
        component: Contact,
        link: "/contact",
    },
    {
        component: Employees,
        link: "/Employees",
    },
    {
        component: EmpInfo,
        link: "/Employees/info/:id",
    },
    {
        component: Contractors,
        link: "/Contractors",
    },
    {
        component: ContInfo,
        link: "/Contractors/info/:id",
    },
    {
        component: Leads,
        link: "/leads",
    },
    {
        component: TimeSheet,
        link: "/time-sheet",
    },
    {
        component: TimeOff,
        link: "/time-off",
    },
];

class content extends Component {
    getPageLink = () => {
        return pageLinks.map((el, i) => (
            <Route exact path={el.link} component={el.component} key={i} />
        ));
    };

    render() {
        return (
            <Content
                className="site-layout-background"
                style={{
                    margin: "16px 16px 10px 16px",
                    padding: "24px 24px 10px 24px",
                    minHeight: "88vh",
                }}
            >
                {this.getPageLink()}
            </Content>
        );
    }
}
export default content;
