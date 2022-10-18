import React, { Component } from "react";
import { Row, Col, Layout, Avatar } from "antd"; // antd component
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"; //Icons

import "../../Styles/sidebar.css";

// import Calender from '../../Calender/Calender' //Custom component
import Menus from "./Menus";
import Navbar from "../Navbar";
import PrivateRoute from "../Content/PrivateRoute";
import { Link } from "react-router-dom";

const { Header, Sider } = Layout;

class Drawers extends Component {
    constructor(){
        super()
        this.state = {
            collapsed: true,
        };
    }
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const { collapsed } = this.state;
        console.log(this.props.location.pathname)
        return (
            <Layout className="setMinWidth">
                {/* collapsedWidth={0} prop to hide full sidebar */}
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme="light"
                    // onBreakpoint={()=>this.toggle()}
                    breakpoint="lg"
                >
                    <div className="logo">
                        {/* {!collapsed ? ( */}
                        <Link
                            to={'/dashboard'}
                        >
                            {!collapsed ? 
                                <div style={{height: '64px'}}>
                                    <img
                                        src={"/z-logo.png"  }
                                        alt="Logo"
                                        width={'100%'}
                                        style={{height: '64px'}}
                                    />
                                </div>
                                :
                                <div style={{height: '64px', padding: '12%'}}>
                                    <img
                                        src={"/z-s-avatar.png" }
                                        alt="Logo"
                                        style={{height: '42px'}}
                                    />
                                </div>
                            }
                        </Link>
                        
                        {/* <Divider >.</Divider> */}
                    </div>
                    <Menus activatePath={this.props?.location?.pathname} />
                </Sider>
                <Layout className="site-layout">
                    <Header
                        className="site-layout-background"
                        style={{ padding: 0 }}
                    >
                        {/**Have to set this header here to trigger toggle sidebar */}
                        <Row justify="start">
                            <span className="trigger" onClick={()=>{this.toggle()}}>
                                {collapsed ? (
                                    <MenuUnfoldOutlined />
                                ) : (
                                    <MenuFoldOutlined />
                                )}
                            </span>
                            <Col flex="auto">
                                {/*span={22}*/}
                                <Navbar /> {/**Navr bar links */}
                            </Col>
                        </Row>
                    </Header>
                    <PrivateRoute /> {/**page Content Router Component*/}
                </Layout>
            </Layout>
        );
    }
}

export default Drawers;
