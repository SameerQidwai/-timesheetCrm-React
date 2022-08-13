import React, { Component } from "react";

import { Route, Link } from "react-router-dom"; // Route Library

import { Breadcrumb, Col } from "antd";

import Global from "../Global";
import GlobalVars from "../GlobalVars";
import CalendarHolidays from "../Calendar/CalendarHolidays";
import Calendars from "../Calendar/Calendars";
import HolidayTypes from "../Calendar/HolidayTypes";
import LeaveCategories from "../LeaveCategories";
import LeavePolicies from "../LeavePolicies";
import Roles from "../Role & Permission/Roles";
import Panels from "../Panels/Panels";
import PanelSkills from "../Panels/PanelSkills";
import Levels from "../skill & level/Levels.js";
import Skills from "../skill & level/Skills.js";
import ImportExport from "../ImportExport";

// import check from "../admin-drawer/admin-sidebar";

const pageLinks = [
    // Page link and router
    {
        component: Global,
        link: "/admin/global-settings",
    },
    {
        component: GlobalVars,
        link: "/admin/tax-rates",
    },
    {
        component: HolidayTypes,
        link: "/admin/holiday-types",
    },
    {
        component: Calendars,
        link: "/admin/calendar",
    },
    {
        component: CalendarHolidays,
        link: "/admin/calendar/holidays/:id",
    },
    {
        component: LeaveCategories,
        link: "/admin/leave-categories",
    },
    {
        component: LeavePolicies,
        link: "/admin/leave-policies",
    },
    {
        component: Roles,
        link: "/admin/roles",
    },
    {
        component: Panels,
        link: "/admin/panels",
    },
    {
        component: PanelSkills,
        link: "/admin/panels/skills/:id",
    },
    {
        component: ImportExport,
        link: "/admin/import-export",
    },
    {
        component: Levels,
        link: "/admin/standard-levels",
    },
    {
        component: Skills,
        link: "/admin/skills",
    },
    
];

class AdminContent extends Component {
    state = {
        bread: [],
    };
    getPageLink = () => {
        return pageLinks.map((el, i) => (
            <Route exact path={el.link} component={el.component} key={i} />
        ));
    };
    getbreadcrums = () => {
        let path = this.props.location;
        let location = ''
        path = path.split("/");
        return path.map((item, i) =>
            item !== ""  && isNaN(item) ? (
                <Breadcrumb.Item key={i}>
                    { item }
                </Breadcrumb.Item>
            ) : null
        );
    };
    render() {
        return (
            <>
                <Col>
                    <Breadcrumb
                        style={{ margin: "0px 0px 16px 10px" }}
                        itemRender={this.itemRender}
                        routes={this.routes}
                    >
                        {this.getbreadcrums()}
                    </Breadcrumb>
                </Col>
                <Col span={24}>{this.getPageLink()}</Col>
            </>
        );
    }
}
export default AdminContent;
