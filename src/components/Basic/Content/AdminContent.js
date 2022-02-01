import React, { Component } from "react";

import { Route, Switch, Redirect } from "react-router-dom"; // Route Library

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

import Contact from "../../../pages/Contacts/Contact Person/Contact";
import TimeSheetProject from "../../../pages/Time Sheet/TimeSheetProject";
import TimeSheetContact from "../../../pages/Time Sheet/TimeSheetContact";
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

import LeaveRequest from "../../../pages/Leave Request/LeaveRequest";
import ApproveRequest from "../../../pages/Leave Request/ApproveRequest";

import Milestone from "../../../pages/Milestones/Milestone";

import Calender from "../../Calender/Calender";

import Profile from "../../../pages/Profiles/Profile"

// import TimeSheetHTML from "../../Core/TimeSheetHTML" 
import { localStore } from "../../../service/constant";

const { Content } = Layout;

const pageLinks = [
    // Page link and router
    {
        component: Profile,
        link: "/profile",
        key: "PROFILE"
    },
    {
        component: Calender,
        link: "/calender",
    },
    {
        component: Admin,
        link: "/admin/global-settings",
        key: 'ADMIN_OPTIONS',
    },
    {
        component: Admin,
        link: "/admin/tax-rates",
        key: 'ADMIN_OPTIONS',
    },
    {
        component: Admin,
        link: "/admin/calenders/holidays/:id",
        key: 'ADMIN_OPTIONS',
    },
    {
        component: Admin,
        link: "/admin/calenders",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/holiday-types",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/leave-categories",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/leave-policies",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/roles",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/standard-levels",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/skills",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/panels",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/admin/panels/skills/:id",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Admin,
        link: "/check",
        key: 'ADMIN_OPTIONS'
    },
    {
        component: Organizations,
        link: "/organisations",
        key: 'ORGANIZATIONS'
    },
    {
        component: OrgInfo,
        link: "/organisations/:id/info",
        key: 'ORGANIZATIONS'
    },
    {
        component: Contact,
        link: "/contact",
        key: 'CONTACT_PERSONS'
    },
    {
        component: Employees,
        link: "/Employees",
        key: "USERS"
    },
    {
        component: EmpInfo,
        link: "/Employees/:id/info",
        key: "USERS"
    },
    {
        component: EmpBilling,
        link: "/Employee/:id/contracts",
        key: "USERS"
    },
    {
        component: NovatedLease,
        link: "/Employee/:id/novated-lease",
        key: "USERS"
    },
    {
        component: Contractors,
        link: "/sub-contractors",
        key: "USERS"
    },
    {
        component: ContInfo,
        link: "/sub-contractors/:id/info",
        key: "USERS"
    },
    {
        component: ContBilling,
        link: "/sub-contractors/:id/contracts",
        key: "USERS"
    },
    {
        component: Opportunities,
        link: "/opportunities",
        key: "OPPORTUNITIES"
    },
    {
        component: OpportunityInfo,
        link: "/opportunities/:proId/info",
        key: "OPPORTUNITIES"
    },
    {
        component: Milestone,
        link: "/opportunities/:proId/milestones",
        key: "OPPORTUNITIES"
    },
    {
        component: OpportunityResources,
        link: "/opportunities/:proId/milestones/:mileId/resources",
        // link: "/opportunities/:id/resources",
        key: "OPPORTUNITIES"
    },
    {
        component: Projects,
        link: "/projects",
        key: "PROJECTS"
    },
    {
        component: ProjectInfo,
        link: "/projects/:proId/info",
        key: "PROJECTS"
    },
    {
        component: PurchaseOrder,
        link: "/projects/:proId/purchase-order",
        key: "PROJECTS"
    },
    {
        component: Milestone,
        link: "/projects/:proId/milestones",
        key: "PROJECTS"
    },
    {
        component: ProjectResources,
        link: "/projects/:proId/milestones/:mileId/resources",
        // link: "/projects/:id/resources",
        key: "PROJECTS"
    },
    {
        component: ResourceHistory,
        link: "/projects/:proId/resources/rates/:id",
        key: "PROJECTS"
    },
    {
        component: TimeSheetContact,
        link: "/time-sheet",
        key: "TIMESHEETS"
    },
    {
        component: TimeSheetProject,
        link: "/time-sheet-approval",
        key: "TIMESHEETS"
    },
    {
        component: TimeOff,
        link: "/time-off",
    },
    {
        component: LeaveRequest,
        link: "/leave-request",
    },
    {
        component: ApproveRequest,
        link: "/approve-request",
    },
    // {
    //     component: Travels,
    //     link: "/travles",
    // },
];

class AdminContent extends Component {
    constructor(props){
        super()
        this.state = {
            allowedRoutes:[]
        }
    }
    componentDidMount = () =>{
        this.getPageLink()
    }
    getPageLink = () => {
        const permissions = JSON.parse(localStore().permissions)
        let { allowedRoutes } = this.state
        allowedRoutes[0] = pageLinks[0]
        pageLinks.map(el=>{
            if(permissions[el.key]&& permissions[el.key]['READ']){
                allowedRoutes.push(el)
            }
       })
       this.setState({allowedRoutes})
    };

    render() {
        const { allowedRoutes } = this.state
        return (
            <Switch >
                {/* {this.getPageLink()} */}
                {pageLinks.map((el, i) => (
                    <Route exact path={el.link} component={el.component} key={i} />
                ))}
                <Redirect to="/profile" />
            </Switch>
        );
    }
}
export default AdminContent;
