import React, { Component } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

import {
    FieldTimeOutlined,
    CalendarOutlined,
    DingdingOutlined,
    HomeOutlined,
    FileOutlined,
    FileTextOutlined,
} from "@ant-design/icons"; //Icons

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
        text: "Timesheets",
        icon: <CalendarOutlined />,
        link: "/time-sheet",
        key: "TIMESHEETS",
    },
    {
        text: "Time Offs",
        icon: <FieldTimeOutlined />,
        link: "/time-off",
        key: "/time-off",
    },
    // {
    //     text: "Travels",
    //     icon: <DingdingOutlined />,
    //     link: "/travles",
    //     key: "/travles",
    // },
    {
        text: "Reporting",
        icon: <FileTextOutlined />,
        key: "Reporting",
        subMenu: [
            {
                text: "Report 1",
                icon: <FileOutlined />,
                link: "/Report-3",
                key: "/Report-3",
            },
            {
                text: "Report 2",
                icon: <FileOutlined />,
                link: "/Report-1",
                key: "/Report-1",
            },
            {
                text: "TimeOffs",
                icon: <FileOutlined />,
                link: "/Report-2",
                key: "/Report-2",
            },
        ],
    },
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
    }
    getAllowedMenu = () =>{
        let permissions = localStore().permissions
        permissions = permissions && JSON.parse(permissions)
        let { allowedMenu } = this.state
            // allowedMenu[0] = pageLinks[0]
            listData.map(el=>{
                if(permissions[el.key]&& permissions[el.key]['READ']){
                    allowedMenu.push(el)
                }
            })
       this.setState({allowedMenu})
    }

    MenuRender = () => {
        const { allowedMenu } = this.state
        return allowedMenu.map((item, i) =>
            item.subMenu ? (
                <SubMenu key={item.key} icon={item.icon} title={item.text}>
                    {item.subMenu.map((sub, j) => (
                        <Menu.Item key={sub.key} icon={sub.icon}>
                            <Link to={sub.link} className="nav-link">
                                {sub.text}
                            </Link>
                        </Menu.Item>
                    ))}
                </SubMenu>
            ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.link} className="nav-link">
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
                theme="dark"
                mode="inline"
                defaultSelectedKeys={location.pathname}
            >
                {this.MenuRender()}
            </Menu>
        );
    }
}

export default withRouter(Menus);
