import React, { Component } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

import { ClockCircleOutlined, CheckCircleOutlined , HomeOutlined, CalendarOutlined , CarryOutOutlined , SolutionOutlined, RestOutlined, CheckSquareOutlined, SnippetsOutlined, DiffOutlined, ApartmentOutlined, ExceptionOutlined, ContainerOutlined, FileDoneOutlined  } from "@ant-design/icons"; //Icons

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
        permissions: {module: "TIMESHEETS", key: 'APPROVAL,UNAPPROVAL'}
    },
    {
        text: "Milestone Approval",
        icon: <CheckSquareOutlined />,
        link: "/milestones-certificate",
        key: "MILESTONE APPROVAl",
        permissions: {module: "TIMESHEETS", key: 'APPROVAL,UNAPPROVAL'}
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
        permissions: {module: "LEAVE_REQUESTS", key: 'APPROVAL,UNAPPROVAL'}
    },
    {
        text: "Training",
        icon: <SolutionOutlined  />,
        link: "/training",
        key: "Training",
        permissions: {module: "TIMESHEETS", key: 'READ'}
    },
    {
        text: "Expense Sheet",
        icon: <SnippetsOutlined/>,
        link: "/expense-sheets",
        key: "EXPENSE SHEET ",
        permissions: {module: "EXPENSES", key: 'READ'}
    },
    {
        text: "Expense",
        icon: <DiffOutlined />,
        link: "/expense",
        key: "EXPENSE",
        permissions: {module: "EXPENSES", key: 'READ'}
    },
    {
        text: "Expense Approval",
        icon: <SolutionOutlined  />,
        link: "/expense-sheet-approval",
        key: "EXPENSE Approval",
        permissions: {module: "EXPENSES", key: 'APPROVAL,UNAPPROVAL'}
    },
    // {
    //     text: "Resources on the bench",
    //     icon: <ExceptionOutlined />,
    //     link: "/bench-resources",
    //     key: "BENCH",
    //     permissions: {module: "TIMESHEETS", key: 'READ'}
    // },
    // {
    //     text: "Workforce Skills",
    //     icon: <ApartmentOutlined />,
    //     link: "/workforce-skills",
    //     key: "WORKFORCE",
    //     permissions: {module: "TIMESHEETS", key: 'READ'}
    // },
    // {
    //     text: "Position & Resources",
    //     icon: <FileDoneOutlined />,
    //     link: "/allocations",
    //     key: "ALLOCATIONS ",
    //     permissions: {module: "TIMESHEETS", key: 'READ'}
    // },
    {
        text: "REPORTS",
        icon: <ContainerOutlined />,
        key: "REPORTS",
        subMenu: [
            {
                text: "Resources on the bench",
                icon: <ExceptionOutlined />,
                link: "/bench-resources",
                key: "BENCH",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
            {
                text: "Workforce Skills",
                icon: <ApartmentOutlined />,
                link: "/workforce-skills",
                key: "WORKFORCE",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
            {
                text: "Position & Resources",
                icon: <FileDoneOutlined />,
                link: "/allocations",
                key: "ALLOCATIONS ",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
        ],
    },
];

const subListData = [
    {
        text: "APPROVALS",
        icon: <ClockCircleOutlined />,
        key: "APPROVALS",
        subMenu: [
            {
                text: "Timesheet Approval",
                icon: <CheckCircleOutlined />,
                link: "/time-sheet-approval",
                key: "TIMESHEETS APPROVAl",
                permissions: {module: "TIMESHEETS", key: 'APPROVAL,UNAPPROVAL'}
            },
            {
                text: "Leave Approval ",
                icon: <CarryOutOutlined />,
                link: "/approve-request",
                key: "APPROVE REQUEST",
                permissions: {module: "LEAVE_REQUESTS", key: 'APPROVAL,UNAPPROVAL'}
            },
            {
                text: "Milestone Approval",
                icon: <CheckSquareOutlined />,
                link: "/milestones-certificate",
                key: "MILESTONE APPROVAl",
                permissions: {module: "TIMESHEETS", key: 'APPROVAL,UNAPPROVAL'}
            },
            {
                text: "Expense Approval",
                icon: <SolutionOutlined  />,
                link: "/expense-sheet-approval",
                key: "EXPENSE Approval",
                permissions: {module: "EXPENSES", key: 'APPROVAL,UNAPPROVAL'}
            },
        ],
    },
    {
        text: "SUBMISSIONS",
        icon: <ClockCircleOutlined />,
        key: "SUBMISSIONS",
        subMenu: [
            {
                text: "Timesheet Entry",
                icon: <ClockCircleOutlined />,
                link: "/time-sheet",
                key: "TIMESHEETS ENTRY",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
            {
                text: "Leave Request",
                icon: <CalendarOutlined />,
                link: "/leave-request",
                key: "LEAVE REQUEST",
                permissions: {module: "LEAVE_REQUESTS", key: 'READ'}
            },
            {
                text: "Expense Sheet",
                icon: <SnippetsOutlined/>,
                link: "/expense-sheets",
                key: "EXPENSE SHEET ",
                permissions: {module: "EXPENSES", key: 'READ'}
            },
        ],
    },
    {
        text: "REPORTS",
        icon: <ContainerOutlined />,
        key: "REPORTS",
        subMenu: [
            {
                text: "Resources on the bench",
                icon: <ExceptionOutlined />,
                link: "/bench-resources",
                key: "BENCH",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
            {
                text: "Workforce Skills",
                icon: <ApartmentOutlined />,
                link: "/workforce-skills",
                key: "WORKFORCE",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
            {
                text: "Position & Resources",
                icon: <FileDoneOutlined />,
                link: "/allocations",
                key: "ALLOCATIONS ",
                permissions: {module: "TIMESHEETS", key: 'READ'}
            },
        ],
    },
    {
        text: "Expense",
        icon: <DiffOutlined />,
        link: "/expense",
        key: "EXPENSE",
        permissions: {module: "EXPENSES", key: 'READ'}
    },
    {
        text: "Training",
        icon: <SolutionOutlined  />,
        link: "/training",
        key: "Training",
        permissions: {module: "TIMESHEETS", key: 'READ'}
    },
]

class Menus extends Component {
    constructor(){
        super()
        this.state = {
            allowedMenu: []
        }
    }
    componentDidMount = () =>{
        this.getAllowedMenu()
    }

    getAllowedMenu = () =>{
        let permissions = localStore().permissions
        permissions = permissions ? JSON.parse(permissions) : []
        let { allowedMenu } = this.state
        listData.map(el=>{
            if (el.subMenu){
                const subMenu = []
                el.subMenu.map((sub)=>{
                    if(permissions?.[sub?.permissions?.module]){
                        const condtion = sub?.permissions?.key?.split(',')
                        for (let cond of condtion){
                            if (permissions[sub?.permissions?.module]?.[cond]){
                                subMenu.push(sub)
                                break;
                            }
                        }
                    }

                })
                if (subMenu.length){
                    el.subMenu = subMenu
                    allowedMenu.push(el)
                    // return el
                }else{
                    delete el.subMenu
                    allowedMenu.push(el)
                    // return el
                }
            }else if(permissions?.[el?.permissions?.module]){
                const condtion = el.permissions.key.split(',')
                for (let cond of condtion){
                    if (permissions[el.permissions.module][cond]){
                        allowedMenu.push(el)
                        // return el
                        break;
                    }
                }
            }
        })
        this.setState({allowedMenu})
    }

    highlightRow(link) {
        const { pathname } = this.props.location
        if (pathname === link ){
            return 'ant-menu-item-selected'
        }
        return ''
    }
    onSelect = ({ item, key, keyPath, selectedKeys }) => {
        console.log({item, key, keyPath, selectedKeys});
    }

    MenuRender = () => {
        const { allowedMenu } = this.state
        return allowedMenu.map((item, i) =>
            item.subMenu ? (
                <SubMenu  key={item.key} icon={item.icon} title={item.text}>
                    {item.subMenu.map((sub, j) => (
                        <Menu.Item key={sub.link} icon={sub.icon}>
                            <Link to={sub.link} className="nav-link">
                                {sub.text}
                            </Link>
                        </Menu.Item>
                    ))}
                </SubMenu>
            ) : (
                // className={this.highlightRow(item.link)}
                <Menu.Item key={item.link} icon={item.icon}  >
                    <Link to={item.link} className="nav-link" >
                        {item.text}
                    </Link>
                </Menu.Item>
            )
        );
    };
    render() {
        return (
            <Menu
                theme="light"
                mode="inline"
                // defaultSelectedKeys={location.pathname}
                selectedKeys={[this.props.activatePath]}
                // onSelect={this.onSelect}
                style={{ fontSize: 12}}
            >
                {this.MenuRender()}
            </Menu>
        );
    }
}

export default withRouter(Menus);
