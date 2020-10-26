import React, { Component } from 'react'
import { Row, Col, Layout, Avatar } from 'antd'; // antd component
import { MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'; //Icons

import './sidebar.css';
import logo from './logo.png'

// import Calender from '../../Calender/Calender' //Custom component
import Menus from './SideMenu/Menus'
import Navbar from '../Nav/Navbar'
import Pages from '../Content'

const { Header, Sider } = Layout;


class Drawers extends Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
      this.setState({
          collapsed:  !this.state.collapsed,
      })
  }


  render() {
    const {collapsed} =this.state;
      return (
        <Layout className="setMinWidth">
          {/* collapsedWidth={0} prop to hide full sidebar */}
            <Sider 
              trigger={null} 
              collapsible 
              collapsed={collapsed} 
              onBreakpoint={this.toggle} 
              breakpoint="lg"
            >
              <div className="logo">
                  {!collapsed ? (
                      <img src={logo} alt="Logo" style={{width:"60%"}} />
                    ) : (
                      <>
                        <Avatar.Group>
                          <Avatar size="small"  style={{ color: '#ffffff', backgroundColor: '#2051b6' }}>1</Avatar>
                          <Avatar size="small"  style={{ color: '#ffffff', backgroundColor: '#2051b6' }}>LM</Avatar>
                        </Avatar.Group>
                      </>
                   )}
                   {/* <Divider >.</Divider> */}
              </div>
             
            <Menus />
            </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}> {/**Have to set this header here to trigger toggle sidebar */}
            <Row justify="start">
              <span className= 'trigger' onClick={ this.toggle }>
                {collapsed ?<MenuUnfoldOutlined/> : < MenuFoldOutlined />}
              </span>
            <Col flex="auto"> {/*span={22}*/}
                <Navbar/> {/**Navr bar links */}
            </Col>
            </Row>
          </Header>
              <Pages/>  {/**page Content Router Component*/}
        </Layout>
      </Layout>
    );
  }
}

export default Drawers;



