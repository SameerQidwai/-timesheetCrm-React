import React, { Component } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom'; // Route Library

import { Layout } from 'antd';

import Dashboard from '../../../pages/Home/Dashboard';

import Admin from '../../../pages/Admin/admin-drawer/admin-sidebar';
import Organizations from '../../../pages/Contacts/Org & Info/Organizations';
import OrgInfo from '../../../pages/Contacts/Org & Info/OrgInfo';

import Employees from '../../../pages/Employees & Info/Employees';
import EmpInfo from '../../../pages/Employees & Info/EmpInfo';
import EmpBilling from '../../../pages/Employees & Info/EmpBilling';
import NovatedLease from '../../../pages/Employees & Info/NovatedLease';
import Contractors from '../../../pages/Contractors & Info/Contractors';
import ContInfo from '../../../pages/Contractors & Info/ContInfo';
import ContBilling from '../../../pages/Contractors & Info/ContBilling';

import Contact from '../../../pages/Contacts/Contact Person/Contact';
import ContactInfo from '../../../pages/Contacts/Contact Person/ContactInfo';

import TimeSheetProject from '../../../pages/Time Sheet/TimeSheetProject';
import TimeSheetContact from '../../../pages/Time Sheet/TimeSheetContact';
import TimeOff from '../../../pages/Time/TimeOff';
// import Travels from "../../../pages/Travel/Travels";

import Opportunities from '../../../pages/Leads/Opportunities';
import OpportunityInfo from '../../../pages/Leads/OpportunityInfo';
import OpportunityResources from '../../../pages/Leads/Resources';

import Projects from '../../../pages/Project/Projects';
import ProjectInfo from '../../../pages/Project/ProjectInfo';
import ProjectResources from '../../../pages/Project/Resources';
import Schedule from '../../../pages/Schedule/Schedule';
import ResourceHistory from '../../../pages/Project/ResourceHistory';
import PurchaseOrder from '../../../pages/Project/PurchaseOrder';
import OpportunityExpenses from '../../../pages/Project/Expenses';

import LeaveRequest from '../../../pages/Leave Request/LeaveRequest';
import ApproveRequest from '../../../pages/Leave Request/ApproveRequest';

import Milestone from '../../../pages/Milestones/Milestone';
import MileCertificate from '../../../pages/Milestones/MileCertificate';

import Calender from '../../Calender/Calender';

import Profile from '../../../pages/Profiles/Profile';

import Training from '../../../pages/Trainings/Training';

// shahbaz work
// import Expense from '../../../pages/Expenses/ExpenseSheet';

// shahbaz work END
import Expense from '../../../pages/Expenses/Expense';
import ExpenseApproval from '../../../pages/Expenses/ExpenseApproval';
import ExpenseSheet from '../../../pages/Expenses/ExpenseSheet';

// import TimeSheetHTML from "../../Core/TimeSheetHTML"
import { localStore } from '../../../service/constant';
import { BenchResources, Positions, WorkForceAllocation, WorkforceSkills, ProjectRevenueAnalyis } from '../../Core/Reports';

const { Content } = Layout;

const pageLinks = [
  // Page link and router
  {
    component: Dashboard,
    link: '/dashboard',
    key: 'DASHBOARD',
    permission: 'ALLOWED',
  },
  {
    component: Profile,
    link: '/profile',
    key: 'PROFILE',
    permission: 'ALLOWED',
  },
  {
    component: Calender,
    link: '/calender',
  },
  {
    component: Admin,
    link: '/admin/global-settings',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/tax-rates',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/calendars/holidays/:id',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/calendars',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/holiday-types',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/leave-categories',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/leave-policies',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/roles',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/standard-levels',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/skills',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/panels',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/expense-types',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/panels/skills/:id',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Admin,
    link: '/admin/import-export',
    key: 'ADMIN_OPTIONS',
    permission: 'READ',
  },
  {
    component: Organizations,
    link: '/organisations',
    key: 'ORGANIZATIONS',
    permission: 'READ',
  },
  {
    component: OrgInfo,
    link: '/organisations/:id/info',
    key: 'ORGANIZATIONS',
    permission: 'READ',
  },
  {
    component: Contact,
    link: '/contacts',
    key: 'CONTACT_PERSONS',
    permission: 'READ',
  },
  {
    component: ContactInfo,
    link: '/contacts/:id/info',
    key: 'CONTACT_PERSONS',
    permission: 'READ',
  },
  {
    component: Employees,
    link: '/Employees',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: EmpInfo,
    link: '/Employees/:id/info',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: EmpBilling,
    link: '/Employee/:id/contracts',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: NovatedLease,
    link: '/Employee/:id/novated-lease',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: Contractors,
    link: '/sub-contractors',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: ContInfo,
    link: '/sub-contractors/:id/info',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: ContBilling,
    link: '/sub-contractors/:id/contracts',
    key: 'USERS',
    permission: 'READ',
  },
  {
    component: Opportunities,
    link: '/opportunities',
    key: 'OPPORTUNITIES',
    permission: 'READ',
  },
  {
    component: OpportunityInfo,
    link: '/opportunities/:proId/info',
    key: 'OPPORTUNITIES',
    permission: 'READ',
  },
  {
    component: Milestone,
    link: '/opportunities/:proId/milestones',
    key: 'OPPORTUNITIES',
    permission: 'READ',
  },
  {
    component: OpportunityExpenses,
    link: '/opportunities/:proId/milestones/:mileId/expenses',
    // link: "/projects/:id/resources",
    key: 'OPPORTUNITIES',
    permission: 'READ',
  },
  {
    component: OpportunityResources,
    link: '/opportunities/:proId/milestones/:mileId/resources',
    // link: "/opportunities/:id/resources",
    key: 'OPPORTUNITIES',
    permission: 'READ',
  },
  {
    component: Projects,
    link: '/projects',
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: ProjectInfo,
    link: '/projects/:proId/info',
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: PurchaseOrder,
    link: '/projects/:proId/purchase-order',
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: Milestone,
    link: '/projects/:proId/milestones',
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: Schedule,
    link: '/projects/:proId/schedules',
    // link: "/projects/:id/resources",
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: MileCertificate,
    link: '/milestones-certificate',
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: OpportunityExpenses,
    link: '/projects/:proId/milestones/:mileId/expenses',
    // link: "/projects/:id/resources",
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: ProjectResources,
    link: '/projects/:proId/milestones/:mileId/resources',
    // link: "/projects/:id/resources",
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: ResourceHistory,
    link: '/projects/:proId/resources/rates/:id',
    key: 'PROJECTS',
    permission: 'READ',
  },
  {
    component: TimeSheetContact,
    link: '/time-sheet',
    key: 'TIMESHEETS',
    permission: 'READ',
  },
  {
    component: TimeSheetProject,
    link: '/time-sheet-approval',
    key: 'TIMESHEETS',
    permission: 'APPROVAL,UNAPPROVAL',
  },
  {
    component: TimeOff,
    link: '/time-off',
  },
  {
    component: LeaveRequest,
    link: '/leave-request',
    key: 'LEAVE_REQUESTS',
    permission: 'READ',
  },
  {
    component: ApproveRequest,
    link: '/approve-request',
    key: 'LEAVE_REQUESTS',
    permission: 'APPROVAL,UNAPPROVAL',
  },
  {
    component: Training,
    link: '/training',
    permission: 'ALLOWED',
  },
  {
    component: ExpenseSheet,
    link: '/expense-sheets',
    key: 'EXPENSES',
    permission: 'READ',
  },
  {
    component: Expense,
    link: '/expense',
    key: 'EXPENSES',
    permission: 'READ',
  },
  {
    component: ExpenseApproval,
    link: '/expense-sheet-approval',
    key: 'EXPENSES',
    permission: 'APPROVAL,UNAPPROVAL',
  },
  {
    component: BenchResources,
    link: '/report/bench-resources',
    key: 'REPORTS',
    permission: 'ALLOWED',
  },
  {
    component: Positions,
    link: '/report/positions',
    key: 'REPORTS',
    permission: 'ALLOWED',
  },
  {
    component: WorkforceSkills,
    link: '/report/workforce-skills',
    key: 'REPORTS',
    permission: 'ALLOWED',
  },
  {
    component: WorkForceAllocation,
    link: '/report/workforce-allocations',
    key: 'REPORTS',
    permission: 'ALLOWED',
  },
  {
    component: ProjectRevenueAnalyis,
    link: '/report/project-revenue-analysis',
    key: 'REPORTS',
    permission: 'ALLOWED',
  },
];

class AdminContent extends Component {
  constructor(props) {
    super();
    this.state = {
      allowedRoutes: [],
    };
  }
  // componentDidMount = () =>{
  //     // this.getPageLink()
  // }
  getPageLink = () => {
    let { permissions = `{}` } = localStore();
    permissions = JSON.parse(permissions);
    let { allowedRoutes } = this.state;
    pageLinks.forEach((el) => {
      if (el.permission === 'ALLOWED') {
        allowedRoutes.push(el);
      } else if (permissions?.[el.key]) {
        let loop = el.permission.split(',');
        for (let cond of loop) {
          if (permissions[el.key][cond]) {
            allowedRoutes.push(el);
            break;
          }
        }
      }
    });
    if (allowedRoutes.length === 0) {
      this.setState({ allowedRoutes });
    }
    return allowedRoutes;
  };

  render() {
    const { allowedRoutes } = this.state;
    return (
      <Switch>
        {/* on state change it was taking time and page was redirect to dashboard*/}
        {/* if I am not using state and just a function the loops were running on evey link change*/}
        {/* this condtion checks if state is set once use the variable insted function*/}
        {(allowedRoutes.length > 0 ? allowedRoutes : this.getPageLink()).map(
          (el, i) => (
            <Route exact path={el.link} component={el.component} key={i} />
          )
        )}
        <Redirect to="/dashboard" />
      </Switch>
    );
  }
}
export default AdminContent;
