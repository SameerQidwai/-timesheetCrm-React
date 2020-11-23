import React, { Component } from "react";
import { Menu, Dropdown, Row, Col, Space } from "antd";
import {
    CaretDownOutlined,
    DownOutlined,
    SettingOutlined,
} from "@ant-design/icons"; //Icons
import { Link, withRouter } from "react-router-dom";

import "../Styles/Navbar.css";

const NavItem = [
    {
        text: "Contacts",
        items: [
            { text: "Organizations", link: "/organizations" },
            { text: "Contact", link: "/contact" },
            { text: "con-3", link: "/con-3" },
            { text: "con-4", link: "/con-4" },
        ],
    },
    {
        text: "Lead",
        link: "/leads",
    },
    {
        text: "Resources",
        items: [
            { text: "Employees", link: "/Employees" },
            { text: "Contractors", link: "/Contractors" },
            { text: "res-3", link: "/res-3" },
            { text: "res-4", link: "/res-4" },
        ],
    },
    {
        text: "Projects",
        link: "link",
    },
    // {
    //     text:'Admin',
    //     items: [
    //         {text:'Global-Settings',
    //         link: '/admin/global-settings'},
    //         {text:'Calander-list',
    //         link: '/admin/calender'},
    //         {text:'Time Offs',
    //         link: '/admin/time-offs'},
    //         {text:'Time Off Policies',
    //         link: '/admin/time-off-policies'},
    //         {text:'Role & Permissions',
    //         link: '/admin/roles'},
    //     ],
    // }
];

class Navbar extends Component {
    getNavMenuItems = (menusData) => {
        if (!menusData) {
            return [];
        }
        return menusData.map((item, i) => this.getSubMenuOrItem(item, i));
    };

    getDropMenu = (items, i) => {
        return (
            <Menu>
                {items.map((item, j) => (
                    <Menu.Item key={`${j + i}`} icon={item.icon}>
                        <Link to={item.link} className="nav-link">
                            {item.text}
                        </Link>
                    </Menu.Item>
                ))}
            </Menu>
        );
    };
    getSubMenuOrItem = (item, i) => {
        return item.items ? (
            <Dropdown overlay={this.getDropMenu(item.items, i)} key={i}>
                <span className="navItem">
                    {item.text}{" "}
                    <span>
                        <CaretDownOutlined />
                    </span>
                </span>
            </Dropdown>
        ) : (
            <span className="navItem" key={i}>
                <Link to={item.link} className="nav-link">
                    {item.text}
                </Link>
            </span>
        );
    };

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded ">
                <div
                    className="collapse navbar-collapse justify-content-md-center"
                    id="navbarsExample10"
                >
                    <Row justify="space-between">
                        <Col>{this.getNavMenuItems(NavItem)}</Col>
                        <Col xs={{ span: 2 }} md={{ span: 2 }}>
                            <Space size="large">
                                <Link
                                    to="/admin/global-settings"
                                    className="nav-drop"
                                >
                                    <SettingOutlined />
                                </Link>

                                <DownOutlined />
                            </Space>
                        </Col>
                    </Row>
                </div>
            </nav>
        );
    }
}

export default withRouter(Navbar);
