import React, { Component } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

import { ClockCircleOutlined, CheckCircleOutlined , HomeOutlined, CalendarOutlined , CarryOutOutlined , SolutionOutlined, RestOutlined  } from "@ant-design/icons"; //Icons

import "../../Styles/Menus.css";
import { localStore } from "../../../service/constant";

const { SubMenu } = Menu;

const listData = [
    {
        text: "Dashboard",
        icon: <HomeOutlined />,
        link: "/calender",
        key: "/calender",
    },
    {
        text: "Timesheet Submission",
        icon: <ClockCircleOutlined />,
        link: "/time-sheet",
        key: "TIMESHEETS",
        permissions: {module: "TIMESHEETS", key: 'READ'}
    },
    {
        text: "Timesheet Approval",
        icon: <CheckCircleOutlined  />,
        link: "/time-sheet-approval",
        key: "TIMESHEETS APPROVAl",
        permissions: {module: "TIMESHEETS", key: 'APPROVAL'}
    },
    {
        text: "Leave Requests",
        icon: <CalendarOutlined  />,
        link: "/leave-request",
        key: "LEAVE REQUEST",
        permissions: {module: "LEAVE_REQUESTS", key: 'READ'}
    },
    {
        text: "Leave Approval",
        icon: <CarryOutOutlined  />,
        link: "/approve-request",
        key: "APPROVE REQUEST",
        permissions: {module: "LEAVE_REQUESTS", key: 'APPROVAL'}
    },
    {
        text: "Training",
        icon: <SolutionOutlined  />,
        link: "/training",
        key: "Training",
        permissions: {module: "TIMESHEETS", key: 'READ'}
    },
    {
        text: "Timesheets",
        icon: <ClockCircleOutlined />,
        key: "TIMESHEETS",
        subMenu: [
            {
                text: "Timesheet Entry",
                icon: <ClockCircleOutlined />,
                link: "/time-sheet",
                key: "TIMESHEETS ENTRY",
                // permissions: {module: "TIMESHEETS", key: 'READ'}
            },
            {
                text: "Timesheet Approval",
                icon: <CheckCircleOutlined />,
                link: "/time-sheet-approval",
                key: "TIMESHEETS APPROVAl",
                // permissions: {module: "TIMESHEETS", key: 'APPROVAL'}
            },
        ],
    },
    {
        text: "Leaves",
        icon: <RestOutlined />,
        key: "LEAVES",
        subMenu: [
            {
                text: "Leave Request",
                icon: <CalendarOutlined />,
                link: "/leave-request",
                key: "LEAVE REQUEST",
                // permissions: {module: "LEAVE_REQUESTS", key: 'READ'}
            },
            {
                text: "Leave Approval ",
                icon: <CarryOutOutlined />,
                link: "/approve-request",
                key: "APPROVE REQUEST",
                // permissions: {module: "LEAVE_REQUESTS", key: 'APPROVAL'}
            },
        ],
    },
    // {
    //     text: "Travels",
    //     icon: <DingdingOutlined />,
    //     link: "/travles",
    //     key: "/travles",
    // },
    
];

class Menus extends Component {
    constructor(){
        super()
        this.state = {
            allowedMenu: []
        }
    }
    componentDidMount = () =>{
        this.getAllowedMenu()
        console.log('new name');
    }

    getAllowedMenu = () =>{
        let permissions = localStore().permissions
        permissions = permissions ? JSON.parse(permissions) : []
        let { allowedMenu } = this.state
            // allowedMenu[0] = pageLinks[0]
            listData.map(el=>{
                if (el.subMenu){
                    const subMenu = []
                    el.subMenu.map(sEl => {
                        if((sEl.permissions && permissions[sEl.permissions.module]) && permissions[sEl.permissions.module][sEl.permissions.key]){
                            subMenu.push(sEl)
                        }
                    })
                    if(subMenu.length> 0){
                        el.subMenu = subMenu
                        allowedMenu.push(el)
                    }
                }else if((el.permissions && permissions[el.permissions.module]) && permissions[el.permissions.module][el.permissions.key]){
                    allowedMenu.push(el)
                }
            })
        this.setState({allowedMenu})
    }

    highlightRow(link) {
        const { pathname } = this.props.location
        if (pathname === link ){
            // return 'ant-menu-item-selected'
        }
    }
    onSelect = ({ item, key, keyPath, selectedKeys }) => {
        console.log({item, key, keyPath, selectedKeys});
    }

    MenuRender = () => {
        const { allowedMenu, select = [] } = this.state
        return allowedMenu.map((item, i) =>
            item.subMenu ? (
                <SubMenu  key={item.key} icon={item.icon} title={item.text}>
                    {item.subMenu.map((sub, j) => (
                        <Menu.Item key={sub.key} icon={sub.icon} className={this.highlightRow(sub.link)}>
                            <Link to={sub.link} className="nav-link">
                                {sub.text}
                            </Link>
                        </Menu.Item>
                    ))}
                </SubMenu>
            ) : (
                <Menu.Item key={item.key} icon={item.icon} className={this.highlightRow(item.link)} selectedKeys={select} onSelect={this.onSelect}>
                    <Link to={item.link} className="nav-link" >
                        {item.text}
                    </Link>
                </Menu.Item>
            )
        );
    };
    render() {
        const { location } = this.props;
        return (
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={location.pathname}
            >
                {this.MenuRender()}
            </Menu>
        );
    }
}

export default withRouter(Menus);
