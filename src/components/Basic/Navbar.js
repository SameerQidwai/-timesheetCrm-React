import React, { Component } from "react";
import { Menu, Dropdown, Row, Col, Space, message, Tooltip } from "antd";
import { CaretDownOutlined, DownOutlined, SettingOutlined, LogoutOutlined, ProfileOutlined, QuestionOutlined, QuestionCircleOutlined } from "@ant-design/icons"; //Icons
import { Link, Redirect, withRouter } from "react-router-dom";

import "../Styles/Navbar.css";
import { localStore } from "../../service/constant";

const NavItem = [
    {
        text: "Contacts",
        items: [
            { text: "Organisations", link: "/organisations", key: 'ORGANIZATIONS' },
            { text: "Contact", link: "/contacts", key: 'CONTACT_PERSONS' },
        ],
        key: 'CHILDRENS'
    },
    {
        text: "Resources",
        items: [
            { text: "Employees", link: "/Employees", key: "USERS"},
            { text: "Sub Contractors", link: "/sub-contractors", key: "USERS"},
        ],
        key: "CHILDRENS"
    },
    {
        text: "Opportunities",
        link: "/opportunities",
        key: "OPPORTUNITIES"
    },
    {
        text: "Projects",
        link: "/projects",
        key: "PROJECTS"
    },
];

class Navbar extends Component {
    constructor(){
        super()
        this.state ={
            logout: false,
            allowedNavItem: [],
            permissions: {}
        }
    }
    componentDidMount = () =>{
        this.getAllowedItems()
    }
    getAllowedItems = ()=>{
        let permissions = localStore().permissions
        permissions = permissions ? JSON.parse(permissions) : []
        let { allowedNavItem } = this.state
            // allowedNavItem[0] = pageLinks[0]
            NavItem.map(el=>{
                if(el.key === 'CHILDRENS'){
                    let elItems =[]
                    el.items.map(cEl=>{
                        if(permissions[cEl.key]&& permissions[cEl.key]['READ']){
                            elItems.push(cEl)
                        }
                    })
                    if(elItems.length >0){
                        el.items = elItems
                        allowedNavItem.push(el)
                    }
                }else{
                    if(permissions[el.key]&& permissions[el.key]['READ']){
                        allowedNavItem.push(el)
                    }
                }
            })
       this.setState({allowedNavItem, permissions})
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
        const { logout, allowedNavItem, permissions } = this.state
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
                        <Col>{this.getNavMenuItems(allowedNavItem)}</Col>
                        {permissions['ADMIN_OPTIONS'] && permissions['ADMIN_OPTIONS']['READ'] ? <Col xs={{ span: 2 }} md={{ span: 2 }}>
                            <Space size="large">
                                <Link
                                    to={{ pathname:"https://timewize.au/help-centre/"}}
                                    target='_blank'
                                    // className="nav-drop"
                                >
                                    <Tooltip title="Help Centre – Timewize">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Link>
                                <Link
                                    to="/admin/global-settings"
                                    // className="nav-drop"
                                >
                                    <SettingOutlined />
                                </Link>
                                <Dropdown overlay={options} placement="bottomCenter" >
                                    <DownOutlined style={{color: '#1890ff', cursor:'pointer'}}/>
                                </Dropdown>
                            </Space>
                        </Col>: 
                        <Col xs={{ span: 1 }} md={{ span: 1 }}>
                            <Space size="large">
                                <Link
                                    to= {{ pathname:"https://timewize.au/help-centre/"}}
                                    target='_blank'
                                    // className="nav-drop"
                                >
                                    <QuestionCircleOutlined />
                                </Link>
                                <Dropdown overlay={options} placement="bottomCenter" >
                                    <DownOutlined style={{color: '#1890ff', cursor:'pointer'}} />
                                </Dropdown>
                            </Space>
                        </Col>}
                        
                    </Row>
                </div>
                {logout && <Redirect to={{ pathname: '/'}} /> }
            </nav>
        );
    }
}

export default withRouter(Navbar);
