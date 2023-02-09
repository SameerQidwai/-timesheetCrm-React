import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import { PlusCircleOutlined, ClockCircleOutlined, DollarOutlined,CheckCircleOutlined , HomeOutlined, CalendarOutlined , CarryOutOutlined , SolutionOutlined, RestOutlined, CheckSquareOutlined, SnippetsOutlined, DiffOutlined, ApartmentOutlined, ExceptionOutlined, ContainerOutlined, FileDoneOutlined, FileAddOutlined, ContactsOutlined, IdcardOutlined, TeamOutlined, FieldTimeOutlined, FileSearchOutlined  } from "@ant-design/icons"; //Icons

import '../../Styles/Menus.css';
import { localStore } from '../../../service/constant';

const { SubMenu } = Menu;

const listData = [
    {
        text: 'Dashboard',
        icon: <HomeOutlined />,
        link: '/calender',
        key: '/calender',
      },
      {
        text: 'Timesheet Submission',
        icon: <ClockCircleOutlined />,
        link: '/time-sheet',
        key: 'TIMESHEETS',
        permissions: { module: 'TIMESHEETS', key: 'READ' },
      },
      {
        text: 'Timesheet Approval',
        icon: <CheckCircleOutlined />,
        link: '/time-sheet-approval',
        key: 'TIMESHEETS APPROVAl',
        permissions: { module: 'TIMESHEETS', key: 'APPROVAL,UNAPPROVAL' },
      },
      {
        text: 'Milestone Approval',
        icon: <CheckSquareOutlined />,
        link: '/milestones-certificate',
        key: 'MILESTONE APPROVAl',
        permissions: { module: 'TIMESHEETS', key: 'APPROVAL,UNAPPROVAL' },
      },
      {
        text: 'Leave Requests',
        icon: <CalendarOutlined />,
        link: '/leave-request',
        key: 'LEAVE REQUEST',
        permissions: { module: 'LEAVE_REQUESTS', key: 'READ' },
      },
      {
        text: 'Leave Approval',
        icon: <CarryOutOutlined />,
        link: '/approve-request',
        key: 'APPROVE REQUEST',
        permissions: { module: 'LEAVE_REQUESTS', key: 'APPROVAL,UNAPPROVAL' },
      },
      {
        text: 'Training',
        icon: <SolutionOutlined />,
        link: '/training',
        key: 'Training',
        permissions: { module: 'TIMESHEETS', key: 'READ' },
      },
      {
        text: 'Expense Sheet',
        icon: <SnippetsOutlined />,
        link: '/expense-sheets',
        key: 'EXPENSE SHEET ',
        permissions: { module: 'EXPENSES', key: 'READ' },
      },
      {
        text: 'Expense',
        icon: <DiffOutlined />,
        link: '/expense',
        key: 'EXPENSE',
        permissions: { module: 'EXPENSES', key: 'READ' },
      },
      {
        text: 'Expense Approval',
        icon: <SolutionOutlined />,
        link: '/expense-sheet-approval',
        key: 'EXPENSE Approval',
        permissions: { module: 'EXPENSES', key: 'APPROVAL,UNAPPROVAL' },
      },
      // {
      //     text: "Resources on the bench",
      //     icon: <ExceptionOutlined />,
      //     link: "/unallocated-resources",
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
        text: 'REPORTS',
        icon: <ContainerOutlined />,
        key: 'REPORTS',
        permissions: { module: 'ADMIN_OPTIONS', key: 'READ' },
        subMenu: [
          {
            text: 'Unallocated Resources',
            icon: <ExceptionOutlined />,
            link: '/report/unallocated-resources',
            key: 'BENCH',
            permissions: { module: 'BENCH_RESOURCES', key: 'READ' },
          },
          {
            text: 'Workforce Skills',
            icon: <ApartmentOutlined />,
            link: '/report/workforce-skills',
            key: 'WORKFORCE',
            permissions: { module: 'WORK_FORCE_SKILLS', key: 'READ' },
          },
          {
            text: 'Position & Resources',
            icon: <FileDoneOutlined />,
            link: '/report/positions',
            key: 'POSITIONS ',
            permissions: { module: 'POSITIONS', key: 'READ' },
          },
          {
            text: 'Workforce Allocation',
            icon: <FileDoneOutlined />,
            link: '/report/workforce-allocations',
            key: 'ALLOCATIONS ',
            permissions: { module: 'WORK_ALLOCATION', key: 'READ' },
          },
          {
            text: 'FY Project Revenue Analysis',
            icon: <FileDoneOutlined />,
            link: '/report/project-revenue-analysis',
            key: 'PROJECTREVENUE ',
            permissions: { module: 'PROJECT_REVENUE', key: 'READ' },
          },
          {
            text: 'FY Client Revenue Analysis',
            icon: <FileDoneOutlined />,
            link: '/report/client-revenue-analysis',
            key: 'CLIENTREVENUE ',
            permissions: { module: 'CLIENT_REVENUE', key: 'READ' },
          },
          // {
          //     text: "Timesheet Summary",
          //     icon: <FileDoneOutlined />,
          //     link: "/report/timesheet-summary",
          //     key: "ADMIN_OPTIONSUMMARY",
          //     permissions: {module: "ADMIN_OPTIONS", key: 'READ'}
          // },
          {
            text: 'Leave Summary',
            icon: <FileDoneOutlined />,
            link: '/report/leave-summary',
            key: 'LEAVESUMMARY',
            permissions: { module: 'LEAVE_SUMMARY', key: 'READ' },
          },
        ],
      },
    ];
    
const subListData = [ //FundOutlined
    {
        text: 'SUBMISSIONS',
        icon: <PlusCircleOutlined />,
        key: 'SUBMISSIONS',
        subMenu: [
        {
            text: 'Timesheet Entry',
            icon: <ClockCircleOutlined />,
            link: '/time-sheet',
            key: 'TIMESHEETS ENTRY',
            permissions: { module: 'TIMESHEETS', key: 'READ' },
        },
        {
            text: 'Leave Request',
            icon: <CalendarOutlined />,
            link: '/leave-request',
            key: 'LEAVE REQUEST',
            permissions: { module: 'LEAVE_REQUESTS', key: 'READ' },
        },
        {
            text: 'Expense Line',
            icon: <DollarOutlined />,
            link: '/expense',
            key: 'EXPENSE',
            permissions: { module: 'EXPENSES', key: 'READ' },
        },
        {
            text: 'Expense Sheet',
            icon: <FileAddOutlined />,
            link: '/expense-sheets',
            key: 'EXPENSE SHEET ',
            permissions: { module: 'EXPENSES', key: 'READ' },
        },
        ],
    },
    {
    text: 'APPROVALS',
    icon: <CheckCircleOutlined />,
    key: 'APPROVALS',
    subMenu: [
        {
        text: 'Timesheet Approval',
        icon: <ClockCircleOutlined />,
        link: '/time-sheet-approval',
        key: 'TIMESHEETS APPROVAl',
        permissions: { module: 'TIMESHEETS', key: 'APPROVAL,UNAPPROVAL' },
        },
        {
        text: 'Leave Approval ',
        icon: <CalendarOutlined />,
        link: '/approve-request',
        key: 'APPROVE REQUEST',
        permissions: { module: 'LEAVE_REQUESTS', key: 'APPROVAL,UNAPPROVAL' },
        },
        {
            text: 'Expense Approval',
            icon: <FileAddOutlined />,
            link: '/expense-sheet-approval',
            key: 'EXPENSE Approval',
            permissions: { module: 'EXPENSES', key: 'APPROVAL,UNAPPROVAL' },
        },
        {
        text: 'Milestone Approval',
        icon: <CheckSquareOutlined />,
        link: '/milestones-certificate',
        key: 'MILESTONE APPROVAl',
        permissions: { module: 'TIMESHEETS', key: 'APPROVAL,UNAPPROVAL' },
        },
    ],
    },
    {
    text: 'REPORTS',
    icon: <ContainerOutlined />,
    key: 'REPORTS',
    // permissions: { module: 'ADMIN_OPTIONS', key: 'READ' },
    subMenu: [
        {
          text: 'Unallocated Resources',
          icon: <ContactsOutlined />,
          link: '/report/unallocated-resources',
          key: 'BENCH_RESOURCES',
          permissions: { module: 'BENCH_RESOURCES', key: 'READ' },
        },
        {
          text: 'Workforce Skills',
          icon: <IdcardOutlined />,
          link: '/report/workforce-skills',
          key: 'WORK_FORCE_SKILLS',
          permissions: { module: 'WORK_FORCE_SKILLS', key: 'READ' },
        },
        {
          text: 'Position & Resources',
          icon: <TeamOutlined />,
          link: '/report/positions',
          key: 'POSITIONS ',
          permissions: { module: 'POSITIONS', key: 'READ' },
        },
        {
          text: 'Workforce Allocation',
          icon: <FieldTimeOutlined />,
          link: '/report/workforce-allocations',
          key: 'WORK_ALLOCATION ',
          permissions: { module: 'WORK_ALLOCATION', key: 'READ' },
        },
        {
          text: 'FY Project Revenue Analysis',
          icon: <FileSearchOutlined />,
          link: '/report/project-revenue-analysis',
          key: 'PROJECT_REVENUE ',
          permissions: { module: 'PROJECT_REVENUE', key: 'READ' },
        },
        {
          text: 'FY Client Revenue Analysis',
          icon: <SolutionOutlined />,
          link: '/report/client-revenue-analysis',
          key: 'CLIENT_REVENUE ',
          permissions: { module: 'CLIENT_REVENUE', key: 'READ' },
        },
        {
          text: "Timesheet Summary",
          icon: <ClockCircleOutlined />,
          link: "/report/timesheet-summary",
          key: "TIMESHEET_SUMMARY",
          permissions: {module: "TIMESHEET_SUMMARY", key: 'READ'}
        },
        {
          text: 'Leave Summary',
          icon: <CarryOutOutlined />,
          link: '/report/leave-summary',
          key: 'LEAVESUMMARY',
          permissions: { module: 'LEAVE_SUMMARY', key: 'READ' },
        },
        {
          text: 'Forecast Work In Hands',
          icon: <CarryOutOutlined />,
          link: '/report/work-in-hand',
          key: 'FORECASTING',
          permissions: { module: 'FORECASTING', key: 'READ' },
        },
      ],
    },
    {
      text: 'Training',
      icon: <SolutionOutlined />,
      link: '/training',
      key: 'Training',
      permissions: { module: 'TIMESHEETS', key: 'READ' },
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

  getAllowedMenu = () => {
    let permissions = localStore().permissions;
    permissions = permissions ? JSON.parse(permissions) : [];
    let { allowedMenu } = this.state;
    subListData.map((el) => {
      if (el.subMenu) {
        const subMenu = [];
        el.subMenu.map((sub) => {
          if (permissions?.[sub?.permissions?.module]) {
            const condtion = sub?.permissions?.key?.split(',');
            for (let cond of condtion) {
              if (permissions[sub?.permissions?.module]?.[cond]) {
                subMenu.push(sub);
                break;
              }
            }
          }
        });
        if (subMenu.length) {
          el.subMenu = subMenu;
          allowedMenu.push(el);
          // return el
        } else {
          delete el.subMenu;
          // allowedMenu.push(el);
          // return el
        }
      } else if (permissions?.[el?.permissions?.module]) {
        const condtion = el.permissions.key.split(',');
        for (let cond of condtion) {
          if (permissions[el.permissions.module][cond]) {
            allowedMenu.push(el);
            // return el
            break;
          }
        }
      }
    });
    this.setState({ allowedMenu });
  };

  highlightRow(link) {
    const { pathname } = this.props.location;
    if (pathname === link) {
      return 'ant-menu-item-selected';
    }
    return '';
  }
  onSelect = ({ item, key, keyPath, selectedKeys }) => {
    console.log({ item, key, keyPath, selectedKeys });
  };

  MenuRender = () => {
    const { allowedMenu } = this.state;
    return allowedMenu.map((item, i) =>
      item.subMenu ? (
        <SubMenu key={item.key} icon={item.icon} title={item.text}>
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
        <Menu.Item key={item.link} icon={item.icon}>
          <Link to={item.link} className="nav-link">
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
        style={{ fontSize: 12 }}
      >
        {this.MenuRender()}
      </Menu>
    );
  }
}

export default withRouter(Menus);
