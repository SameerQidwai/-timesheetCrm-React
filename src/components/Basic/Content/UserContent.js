import React, { Component } from "react";

import { Route } from "react-router-dom"; // Route Library

import { Layout } from "antd";

import Organizations from "../../../pages/Contacts/Org & Info/Organizations";
import OrgInfo from "../../../pages/Contacts/Org & Info/OrgInfo";

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

const { Content } = Layout;

const pageLinks = [
    // Page link and router
    // {
    //     component: Admin,
    //     link: "/admin/global-settings",
    // },
    {
        component: Contact,
        link: "/contact",
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
];

class UserContent extends Component {
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
export default UserContent;
