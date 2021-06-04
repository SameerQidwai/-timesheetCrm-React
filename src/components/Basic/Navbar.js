import React, { Component } from "react";
import { Menu, Dropdown, Row, Col, Space, message } from "antd";
import { CaretDownOutlined, DownOutlined, SettingOutlined, LogoutOutlined, ProfileOutlined } from "@ant-design/icons"; //Icons
import { Link, Redirect, withRouter } from "react-router-dom";

import "../Styles/Navbar.css";

const NavItem = [
    {
        text: "Contacts",
        items: [
            { text: "Organisations", link: "/organisations" },
            { text: "Contact", link: "/contact" },
        ],
    },
    {
        text: "Opportunities",
        link: "/opportunities",
    },
    {
        text: "Resources",
        items: [
            { text: "Employees", link: "/Employees" },
            { text: "Sub Contractors", link: "/sub-contractors" },
        ],
    },
    {
        text: "Projects",
        link: "/projects",
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
    constructor(){
        super()
        this.state ={
            logout: false
        }
    }
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
                    {item.text} <span> <CaretDownOutlined /> </span>
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
    logOut = () =>{
        message.loading({ content: 'Loading...', key: 'logout' })
        localStorage.clear();
        this.setState({
            logout: true
        },()=>{
            message.info({ content: 'Logout successfully!', key: 'logout' })
        })
    }

    render() {
        const { logout } = this.state
        const options = (
            <Menu onClick={this.handleMenuClick}>
              <Menu.Item key="profile">
                  <Link to={"/profile"} className="nav-link">
                    Profile <ProfileOutlined />
                  </Link>
                </Menu.Item>
              <Menu.Item key="logout" onClick={this.logOut}>Logout <LogoutOutlined /></Menu.Item>
            </Menu>
          ); 
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
                                    // className="nav-drop"
                                >
                                    <SettingOutlined />
                                </Link>
                                <Dropdown overlay={options} placement="bottomCenter" >
                                    <Link><DownOutlined /></Link>
                                </Dropdown>
                            </Space>
                        </Col>
                    </Row>
                </div>
                {logout && <Redirect to={{ pathname: '/'}} /> }
            </nav>
        );
    }
}

export default withRouter(Navbar);
