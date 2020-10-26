import React, { Component } from "react";

import { Route } from 'react-router-dom' // Route Library

import { Breadcrumb, Col } from "antd";


import Global from '../global'
import CalenderHoldays from '../calender-holidays'
import CalenderList from '../calenders'
import TimeOffs from '../time-offs'
import TimeOffsPolicy from '../time-off-policies'
import Roles from '../../Role & Permission/roles'
import Panels from '../Panels/panels'
import PanelInfo from '../Panels/panel-info'

import check from '../admin-drawer/admin-sidebar'


const pageLinks = [ // Page link and router
    {
        component: Global,
        link: '/admin/global-settings'
    },
    {
        component: CalenderList,
        link: '/admin/calender'
    },
    {
        component: CalenderHoldays,
        link: '/admin/calender/holidays/:id'
    },
    {
        component: TimeOffs,
        link: '/admin/time-offs'
    },
    {
        component: TimeOffsPolicy,
        link: '/admin/time-off-policies'
    },
    {
        component: Roles,
        link: '/admin/roles'
    },
    {
        component: Panels,
        link: '/admin/panels'
    },
    {
        component: PanelInfo,
        link: '/admin/panels/info/:id'
    },
    {
        component: check,
        link: '/admin/check'
    },
]

class AdminContent extends Component {
    state ={
        bread:[]
    }
    getPageLink = () => {
        return (
            pageLinks.map((el,i) => (
                <Route exact path={el.link} component={el.component} key={i}/>
            ))
        );
    }
    getbreadcrums = () =>{
        let path = this.props.location
        path = path.split('/')
        return(
            path.map((item,i) => (
                item !== "" ?<Breadcrumb.Item key={i}>{item}</Breadcrumb.Item>: null
            ))
        );
    }
    render (){
        return (
            <>
                <Col>
                    <Breadcrumb style={{ margin: '0px 0px 16px 10px' }}>
                        {this.getbreadcrums()}
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    {this.getPageLink()}
                </Col>
            </>
        );
    }
};
export default AdminContent;