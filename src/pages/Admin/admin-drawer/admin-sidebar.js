import React, { Component  } from "react";

import { Layout, Breadcrumb, Row, Col} from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'; //Icons

import AdminMenus from './admin-Menus'
import AdminContent from './admin-content'

import './sidebar.css'

const { Sider, Content } = Layout;


class AdminSidebar extends Component{
    state = {
        collapsed: true,
    };

    toggle = () => {
      this.setState({
          collapsed:  !this.state.collapsed,
      })
  }

    render(){
        const {collapsed} =this.state;
        return (
            <Layout>
                <Content style={{ padding: '0 0px' }}>
                    <Layout className="site-layout-background" style={{ padding: '0px 0' }}>
                        <Sider 
                            className="site-layout-background" 
                            width={200}
                            trigger={null} 
                            collapsible 
                            collapsed={this.state.collapsed}
                        
                        >
                            <AdminMenus/>
                        </Sider>
                        <Content style={{ padding: '0 0px', minHeight: 640 }}>
                            <Row style={{paddingLeft:'10px'}}>
                                <span className= 'admin-trigger' onClick={ this.toggle }>
                                    {collapsed ?<MenuUnfoldOutlined/> : < MenuFoldOutlined />}
                                </span>
                                <AdminContent location = {this.props.location.pathname}/>
                            </Row>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        )
    }
}
export default AdminSidebar