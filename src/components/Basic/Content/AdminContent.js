import React, { Component } from "react";

import { Route } from "react-router-dom"; // Route Library

import { Layout } from "antd";

import Admin from "../../../pages/Admin/admin-drawer/admin-sidebar";
import Organizations from "../../../pages/Contacts/Org & Info/Organizations";
import OrgInfo from "../../../pages/Contacts/Org & Info/OrgInfo";

import Employees from "../../../pages/Employees & Info/Employees";
import EmpInfo from "../../../pages/Employees & Info/EmpInfo";
import EmpBilling from "../../../pages/Employees & Info/EmpBilling"
import NovatedLease from "../../../pages/Employees & Info/NovatedLease";
import Contractors from "../../../pages/Contractors & Info/Contractors";
import ContInfo from "../../../pages/Contractors & Info/ContInfo";
import ContBilling from "../../../pages/Contractors & Info/ContBilling";
// import Clients from "../../pages/Clients & info/Clients";
// import ClientsInfo from "../../pages/Clients & info/ClientInfo";
import Contact from "../../../pages/Contacts/Contact Person/Contact";
import TimeSheet from "../../../pages/Time Sheet/TimeSheet";
import TimeOff from "../../../pages/Time/TimeOff";
// import Travels from "../../../pages/Travel/Travels";

import Opportunities from "../../../pages/Leads/Opportunities";
import OpportunityInfo from "../../../pages/Leads/OpportunityInfo";
import OpportunityResources from "../../../pages/Leads/Resources";

import Projects from "../../../pages/Project/Projects";
import ProjectInfo from "../../../pages/Project/ProjectInfo";
import ProjectResources from "../../../pages/Project/Resources";
import ResourceHistory from "../../../pages/Project/ResourceHistory";
import PurchaseOrder from "../../../pages/Project/PurchaseOrder";
import Calender from "../../Calender/Calender";

import Profile from "../../../pages/Profiles/Profile"

const { Content } = Layout;

const pageLinks = [
    // Page link and router
    {
        component: Calender,
        link: "/calender",
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
        link: "/admin/leave-categories",
    },
    {
        component: Admin,
        link: "/admin/leave-policies",
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
        link: "/admin/panels/skills/:id",
    },
    {
        component: Admin,
        link: "/check",
    },
    {
        component: Organizations,
        link: "/organisations",
    },
    {
        component: OrgInfo,
        link: "/organisations/:id/info",
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
        link: "/Employees/:id/info",
    },
    {
        component: EmpBilling,
        link: "/Employee/:id/contracts",
    },
    {
        component: NovatedLease,
        link: "/Employee/:id/novated-lease",
    },
    {
        component: Contractors,
        link: "/sub-contractors",
    },
    {
        component: ContInfo,
        link: "/sub-contractors/:id/info",
    },
    {
        component: ContBilling,
        link: "/sub-contractors/:id/contracts",
    },
    {
        component: Opportunities,
        link: "/opportunities",
    },
    {
        component: OpportunityInfo,
        link: "/opportunity/:id/info",
    },
    {
        component: OpportunityResources,
        link: "/opportunity/:id/resources",
    },
    {
        component: Projects,
        link: "/projects",
    },
    {
        component: ProjectInfo,
        link: "/projects/:id/info",
    },
    {
        component: PurchaseOrder,
        link: "/projects/:id/purchase-order",
    },
    {
        component: ProjectResources,
        link: "/projects/:id/resources",
    },
    {
        component: ResourceHistory,
        // link: "/project/:projectId/resources/:resourcesId/rate/:id",
        link: "/projects/:proId/resources/rates/:id",
    },
    {
        component: TimeSheet,
        link: "/time-sheet",
    },
    {
        component: TimeOff,
        link: "/time-off",
    },
    // {
    //     component: Travels,
    //     link: "/travles",
    // },
    {
        component: Profile,
        link: "/profile",
    },
];

class AdminContent extends Component {
    // getPageLink = () => {
    //     return pageLinks.map((el, i) => (
    //         <Route exact path={el.link} component={el.component} key={i} />
    //     ));
    // };

    render() {
        return (
            <div >
                {/* {this.getPageLink()} */}
                {pageLinks.map((el, i) => (
                    <Route exact path={el.link} component={el.component} key={i} />
                ))}
            </div>
        );
    }
}
export default AdminContent;