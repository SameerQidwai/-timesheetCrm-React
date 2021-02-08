import React, { Component } from "react";

import { Route } from "react-router-dom"; // Route Library

import { Layout } from "antd";

import Login from "../../pages/Login/Login";

import Admin from "../../pages/Admin/admin-drawer/admin-sidebar";
import Organizations from "../../pages/Contacts/Org & Info/Organizations";
import OrgInfo from "../../pages/Contacts/Org & Info/OrgInfo";
import Employees from "../../pages/Employees & Info/Employees";
import EmpInfo from "../../pages/Employees & Info/EmpInfo";
import EmpBilling from "../../pages/Employees & Info/EmpBilling"
import Contractors from "../../pages/Contractors & Info/Contractors";
import ContInfo from "../../pages/Contractors & Info/ContInfo";
import ContBilling from "../../pages/Contractors & Info/ContBilling";
// import Clients from "../../pages/Clients & info/Clients";
// import ClientsInfo from "../../pages/Clients & info/ClientInfo";
import Contact from "../../pages/Contacts/Contact Person/Contact";
import TimeSheet from "../../pages/TimeSheet";
import TimeOff from "../../pages/Time/TimeOff";
import Travels from "../../pages/Travel/Travels";

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
        component: EmpBilling,
        link: "/Employee/contracts/:id",
    },
    {
        component: Contractors,
        link: "/sub-contractors",
    },
    {
        component: ContInfo,
        link: "/sub-contractors/info/:id",
    },
    {
        component: ContBilling,
        link: "/sub-contractors/contracts/:id",
    },
    // {
    //     component: Clients,
    //     link: "/clients",
    // },
    // {
    //     component: ClientsInfo,
    //     link: "/clients/info/:id",
    // },
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
    {
        component: Travels,
        link: "/travles",
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
