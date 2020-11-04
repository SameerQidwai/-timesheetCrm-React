import React, {Component} from 'react'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'

import { FieldTimeOutlined, UserOutlined, CalendarOutlined, GlobalOutlined, AppstoreOutlined, ApartmentOutlined, GoldOutlined } from '@ant-design/icons'; //Icons

// import './Menus.css'

const { SubMenu } = Menu;

const listData= [
    {
        text:'Global Settings',
        icon: <GlobalOutlined />,
        link:"/admin/global-settings",
        key: "/admin/global-settings"
    },
    {
        text:'Calander-list',
        icon: <CalendarOutlined />,
        link:"/admin/calender",
        key: "/admin/calender"
    },
    {
        text:'Time Offs',
        icon: <FieldTimeOutlined />,
        link:"/admin/time-offs",
        key: "/admin/time-offs"
    },
    {
        text:'Time Off Policies',
        icon: <FieldTimeOutlined spin />,
        link: "/admin/time-off-policies",
        key: "/admin/time-off-policies"
    },
    {
        text:'Role & Permissions',
        icon: <UserOutlined />,
        link: "/admin/roles",
        key: "/admin/roles"
    },
    {
        text:'Levels',
        icon: <ApartmentOutlined />,
        link: "/admin/standard-levels",
        key: "/admin/standard-levels"
    },
    {
        text:'Skills',
        icon: <GoldOutlined />,
        link: "/admin/skills",
        key: "/admin/skills"
    },
    {
        text:'Panels',
        icon: <AppstoreOutlined />,
        link: "/admin/panels",
        key: "/admin/panels"
    },
];

class AdminMenus extends Component{
    componentDidMount=()=>{
        console.log(this.props.location.key)
    }
    MenuRender =()=> {
        return (
            listData.map((item,i) => (
            item.subMenu ? 
            // key={`sub${i+1}`} 
                <SubMenu key={item.key} icon={item.icon} title={item.text}>
                {item.subMenu.map((sub,j)=>(
                    // key={`${j+i}`}
                    <Menu.Item  key={sub.key}  icon={sub.icon}>
                        <Link to={sub.link} className="nav-link">
                            {sub.text}
                        </Link>
                    </Menu.Item>
                ))}
                </SubMenu>:
                // key={`${i}`} 
                <Menu.Item key={item.key}  icon={item.icon}>
                 <Link to={item.link} className="nav-link">
                    {item.text}
                </Link>
                </Menu.Item> 
            ))
        );
    }
    render() {
        const { location } = this.props
        const { pathname } = location
        return (
            <Menu theme="light" mode="inline" defaultSelectedKeys={[pathname]} >
                {this.MenuRender()}
            </Menu>
        )
    }
}

export default withRouter(AdminMenus)
