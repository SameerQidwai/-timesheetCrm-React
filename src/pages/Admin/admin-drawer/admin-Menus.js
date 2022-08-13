import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import {
  FieldTimeOutlined,
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  FileProtectOutlined,
  ApartmentOutlined,
  GoldOutlined,
  FileSyncOutlined,
} from '@ant-design/icons'; //Icons

// import './Menus.css'

const { SubMenu } = Menu;

const listData = [
  {
    text: 'Global Settings',
    icon: <GlobalOutlined />,
    link: '/admin/global-settings',
    key: '/admin/global-settings',
  },
  {
    text: 'Holidays Types',
    icon: <CalendarOutlined />,
    link: '/admin/holiday-types',
    key: '/admin/holiday-types',
  },
  {
    text: 'Calendars',
    icon: <CalendarOutlined />,
    link: '/admin/calenders',
    key: '/admin/calenders',
  },
  {
    text: 'Leave Categories',
    icon: <FieldTimeOutlined />,
    link: '/admin/leave-categories',
    key: '/admin/leave-categories',
  },
  {
    text: 'Leave Policies',
    icon: <FileProtectOutlined />,
    link: '/admin/leave-policies',
    key: '/admin/leave-policies',
  },
  {
    text: 'Role & Permissions',
    icon: <UserOutlined />,
    link: '/admin/roles',
    key: '/admin/roles',
  },
  {
    text: 'Standard Levels',
    icon: <ApartmentOutlined />,
    link: '/admin/standard-levels',
    key: '/admin/standard-levels',
  },
  {
    text: 'Standard Skills',
    icon: <GoldOutlined />,
    link: '/admin/skills',
    key: '/admin/skills',
  },
  {
    text: 'Panels',
    icon: <AppstoreOutlined />,
    link: '/admin/panels',
    key: '/admin/panels',
  },
  {
    text: 'Expense Types',
    icon: <AppstoreOutlined />,
    link: '/admin/expense-types',
    key: '/admin/expense-types',
  },
  {
    text: 'Import/Export',
    icon: <FileSyncOutlined />,
    link: '/admin/import-export',
    key: '/admin/import-export',
  },
  // { global Variable commented
  //     text: "Tax Rates",
  //     icon: <CalculatorOutlined />,
  //     link: "/admin/tax-rates",
  //     key: "/admin/tax-rates",
  // },
];

class AdminMenus extends Component {
  componentDidMount = () => {
    // console.log(this.props.location.key);
  };
  MenuRender = () => {
    return listData.map((item, i) =>
      item.subMenu ? (
        // key={`sub${i+1}`}
        <SubMenu key={item.key} icon={item.icon} title={item.text}>
          {item.subMenu.map((sub, j) => (
            // key={`${j+i}`}
            <Menu.Item key={sub.key} icon={sub.icon}>
              <Link to={sub.link} className="nav-link">
                {sub.text}
              </Link>
            </Menu.Item>
          ))}
        </SubMenu>
      ) : (
        // key={`${i}`}
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
    const { pathname } = location;
    return (
      <Menu theme="light" mode="inline" defaultSelectedKeys={[pathname]}>
        {this.MenuRender()}
      </Menu>
    );
  }
}

export default withRouter(AdminMenus);
