import React, { Component } from 'react';
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from 'antd';

import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from '@ant-design/icons'; //Icons

import { Link } from 'react-router-dom';

import InfoModal from './Modals/InfoModal';

import { getList, delList } from '../../service/Employees';
import { localStore } from '../../service/constant';
import { Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter, } from '../../components/Core/Table/TableFilter';
import { generalDelete } from "../../service/delete-Api's";
import { Tag_s } from '../../components/Core/Custom/Index';
import { EmployeeAdvaceFilter, EmployeeFilterColumns, EmployeeFilterFields, EmployeeModalUseEffect } from '../../components/Core/Table/';
import { getRoles, getStates } from '../../service/constant-Apis';

const { Title } = Typography;

class Employees extends Component {
  constructor() {
    super();
    this.columns = [
      {
        title: 'Code',
        dataIndex: ['contactPersonOrganization', 'contactPersonId'],
        key: 'contactPersonId',
        wdith: 115,
        render: (record) => {
          return `Emp-00${record}`;
        },
        ...tableSorter(
          'contactPersonOrganization.contactPersonId',
          'number',
          true
        ),
      },
      {
        title: 'First Name',
        dataIndex: ['contactPersonOrganization', 'contactPerson', 'firstName'],
        key: 'firstName',
        render: (text, record) => (
          <Link
            to={{ pathname: `/Employees/${record.id}/info` }}
            className="nav-link"
          >
            {text}
          </Link>
        ),
        ...tableSorter(
          'contactPersonOrganization.contactPerson.firstName',
          'string'
        ),
      },
      {
        title: 'Last Name',
        dataIndex: ['contactPersonOrganization', 'contactPerson', 'lastName'],
        key: 'lastName',
        ...tableSorter(
          'contactPersonOrganization.contactPerson.lastName',
          'string'
        ),
      },
      {
        title: 'Phone',
        dataIndex: [
          'contactPersonOrganization',
          'contactPerson',
          'phoneNumber',
        ],
        key: 'phoneNumber',
      },
      {
        title: 'Email',
        dataIndex: ['contactPersonOrganization', 'contactPerson', 'email'],
        key: 'email',
      },
      {
        title: 'Status',
        dataIndex: "active",
        key: 'status',
        width: '8%',
        render: (text)=>  <Tag_s
          text={`${text}`}
          objName="ACTIVE_STATUS"
          colorName="ACTIVE_STATUS_COLORS"
        />
      },
      {
        title: '...',
        key: 'action',
        align: 'center',
        width: '1%',
        render: (value, record, index) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="Delete"
                  danger
                  disabled={!this?.state?.permissions?.['DELETE']}
                  className="pop-confirm-menu"
                >
                  <Popconfirm
                    title="Are you sure you want to delete ?"
                    onConfirm={() => this.handleDelete(record.id, index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <div> Delete </div>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item
                  key="Edit"
                  onClick={() => {
                    this.setState({ infoModal: true, editEmp: record.id });
                  }}
                  disabled={!this?.state?.permissions?.['UPDATE']}
                >
                  Edit
                </Menu.Item>
                <Menu.Item key="view">
                  <Link
                    to={{
                      pathname: `/Employees/${record.id}/info`,
                    }}
                    className="nav-link"
                  >
                    View
                  </Link>
                </Menu.Item>
                <Menu.Item key="Contract History">
                  <Link
                    to={{
                      pathname: `/Employee/${record.id}/contracts`,
                    }}
                    className="nav-link"
                  >
                    Contract History
                  </Link>
                </Menu.Item>
                <Menu.Item key="Novated lease">
                  <Link
                    to={{
                      pathname: `/Employee/${record.id}/novated-lease`,
                    }}
                    className="nav-link"
                  >
                    Novated Lease
                  </Link>
                </Menu.Item>
              </Menu>
            }
          >
            <Button size="small">
              <SettingOutlined />
            </Button>
          </Dropdown>
        ),
      },
    ];

    this.state = {
      infoModal: false,
      editEmp: false,
      data: [],
      permissions: {},
      filterData: [],
      openSearch: false,
      // will remove if seperate component works fine
      // searchedColumn: {
      //   id: { type: 'Input', value: '', label: 'Code', showInColumn: true },
      //   firstName: {
      //     type: 'Input',
      //     value: '',
      //     label: 'First Name',
      //     showInColumn: true,
      //   },
      //   lastName: {
      //     type: 'Input',
      //     value: '',
      //     label: 'Last Name',
      //     showInColumn: true,
      //   },
      //   phoneNumber: {
      //     type: 'Input',
      //     value: '',
      //     label: 'Phone Number',
      //     showInColumn: true,
      //   },
      //   email: {
      //     type: 'Input',
      //     value: '',
      //     label: 'Personal Email',
      //     showInColumn: true,
      //   },
      //   Action: {
      //     type: 'Input',
      //     value: '',
      //     label: '',
      //     showInColumn: true,
      //     disabled: true,
      //   },
      //   stateId: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'State',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   clearanceLevel: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'clearanceLevel',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   gender: {
      //     type: 'Select',
      //     multi: true,
      //     value: [],
      //     label: 'Gender',
      //     showInColumn: false,
      //   },
      //   address: {
      //     type: 'none',
      //     value: '',
      //     label: 'Residential Address',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   role: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'Role',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   employeeStatus: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'Employee Status',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   leavePloicy: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'Leave Policy',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   contractStartDate: {
      //     type: 'Date',
      //     value: null,
      //     label: 'Contract Start Date',
      //     showInColumn: true,
      //   },
      //   contractEndDate: {
      //     type: 'Date',
      //     value: null,
      //     label: 'Contract End Date',
      //     showInColumn: true,
      //     disabled: true,
      //   },
      //   salary: {
      //     type: 'Input',
      //     value: '',
      //     label: 'Anual Base Salary',
      //     showInColumn: true,
      //   },
      //   payFreuency: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'Pay Frequency',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      //   lineManager: {
      //     type: 'none',
      //     multi: true,
      //     value: [],
      //     label: 'Line Manager',
      //     showInColumn: false,
      //     disabled: false,
      //   },
      // },
      // filterFields: [
      //   {
      //     fieldCol: 12, // this is only label 5
      //     size: 'small',
      //     Placeholder: 'First Name',
      //     type: 'Text',
      //     labelAlign: 'left',
      //   },
      //   {
      //     Placeholder: 'Last Name',
      //     fieldCol: 12, // this is only label 8
      //     size: 'small',
      //     type: 'Text',
      //     labelAlign: 'left',
      //   },
      //   {
      //     object: 'obj', //this is field 7
      //     fieldCol: 12,
      //     key: 'firstName',
      //     size: 'small',
      //     type: 'Input',
      //     labelAlign: 'left',
      //   },
      //   {
      //     object: 'obj', //this is field 9
      //     fieldCol: 12,
      //     key: 'lastName',
      //     size: 'small',
      //     type: 'Input',
      //     labelAlign: 'left',
      //   },
      //   {
      //     Placeholder: 'Phone',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //     labelAlign: 'right',
      //   },
      //   {
      //     fieldCol: 12, // this is only label 4
      //     size: 'small',
      //     Placeholder: 'Personal Email',

      //     type: 'Text',
      //     labelAlign: 'left',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'phoneNumber',
      //     size: 'small',
      //     type: 'input',
      //   },
      //   {
      //     object: 'obj', //this is field 6
      //     fieldCol: 12,
      //     key: 'email',
      //     size: 'small',
      //     type: 'Input',
      //   },
      //   {
      //     Placeholder: 'Gender',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //     labelAlign: 'right',
      //   },
      //   {
      //     Placeholder: 'State For Payroll Tax Purpose',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //     labelAlign: 'right',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'gender',
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     size: 'small',
      //     data: [
      //       { label: 'Male', value: 'M' },
      //       { label: 'Female', value: 'F' },
      //       { label: 'Other', value: 'O' },
      //     ],
      //     type: 'Select',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     key: 'stateId',
      //     size: 'small',
      //     type: 'Select',
      //     data: [],
      //   },
      //   {
      //     Placeholder: 'Role',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //     labelAlign: 'right',
      //   },
      //   {
      //     Placeholder: 'Clearance Level',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     mode: 'multiple',
      //     key: 'role',
      //     customValue: (value, option) => option,
      //     size: 'small',
      //     type: 'Select',
      //     data: [],
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'clearanceLevel',
      //     size: 'small',
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     data: [
      //       { label: 'BV - Baseline Vetting', value: 'BV' },
      //       { label: 'NV1 - Negative Vetting 1', value: 'NV1' },
      //       { label: 'NV2 - Negative Vetting 2', value: 'NV2' },
      //       { label: 'PV - Positive Vetting', value: 'PV' },
      //       { label: 'No clearance', value: 'NC' },
      //     ],
      //     type: 'Select',
      //   },
      //   {
      //     Placeholder: 'Employment Status',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     Placeholder: 'Leave Policy',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'employeeStatus',
      //     size: 'small',
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     data: [
      //       { label: 'Casual', value: 1 },
      //       { label: 'Part Time', value: 2 },
      //       { label: 'Full Time', value: 3 },
      //     ],
      //     type: 'Select',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'leavePloicy',
      //     size: 'small',
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     data: [ ],
      //     type: 'Select',
      //   },
      //   {
      //     Placeholder: 'Contract Start Date',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     Placeholder: 'Contract End Date',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'contractStartDate',
      //     size: 'small',
      //     type: 'RangePicker',
      //     fieldStyle: { width: '100%' },
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'contractEndDate',
      //     size: 'small',
      //     type: 'RangePicker',
      //     fieldStyle: { width: '100%' },
      //   },
      //   {
      //     Placeholder: 'Pay Frequency',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     Placeholder: 'Annual Base Salary',
      //     fieldCol: 12,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'payFreuency',
      //     size: 'small',
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     data: [{ label: 'Hourly', value: 1 },
      //     { label: 'Daily', value: 2 },
      //     { label: 'Weekly', value: 3 },
      //     { label: 'Fortnightly', value: 4 },
      //     { label: 'Monthly', value: 5 }
      //     ],
      //     type: 'Select',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'salary',
      //     size: 'small',
      //     shape: '$',
      //     type: 'InputNumber',
      //     fieldStyle: { width: '100%' },
      //   },
      //   {
      //     Placeholder: 'Employee Manager',
      //     fieldCol: 24,
      //     size: 'small',
      //     type: 'Text',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 12,
      //     key: 'lineManager',
      //     size: 'small',
      //     mode: 'multiple',
      //     customValue: (value, option) => option,
      //     data: [{ label: 'Hourly', value: 1 },
      //     { label: 'Daily', value: 2 },
      //     { label: 'Weekly', value: 3 },
      //     { label: 'Fortnightly', value: 4 },
      //     { label: 'Monthly', value: 5 }
      //     ],
      //     type: 'Select',
      //   },
      //   {
      //     Placeholder: 'Residential Address',
      //     fieldCol: 24,
      //     size: 'small',
      //     type: 'Text',
      //     labelAlign: 'right',
      //   },
      //   {
      //     object: 'obj',
      //     fieldCol: 24,
      //     key: 'address',
      //     size: 'small',
      //     type: 'Input',
      //   },
      // ],
      searchedColumn: EmployeeFilterColumns,
      filterFields: EmployeeFilterFields,
    };
  }
  
  componentDidMount = () => {
    this.getList();
  };

  componentWillUnmount =()=>{
    this.setState({
      searchedColumn: {},
      filterFields: []
    })
  }

  getList = () => {
    const { USERS } = JSON.parse(localStore().permissions);
    getList().then((res) => {
      if (res.success) {
        this.setState({
          data: res.data,
          filterData: res.data,
          infoModal: false,
          editEmp: false,
          permissions: USERS,
        });
      }
    });
  };

  handleDelete = (id, index) => {
    const url = '/employees';
    const { data, filterData } = this.state;
    const { history } = this.props;
    generalDelete(history, url, id, index, filterData, data).then((res) => {
      if (res.success) {
        this.setState({
          data: [...res.data],
          filterData: [...res.filterData],
        });
      }
    });
  };

  closeModal = () => {
    this.setState({ infoModal: false, editEmp: false });
  };

  callBack = (value) => {
    // const { data, editEmp } = this.state;
    this.getList();
  };

  generalFilter = (value) => {
    const { data } = this.state;
    if (value) {
      value = value.replace(/\s+/g, '').toLowerCase()
      this.setState({
        filterData: data.filter((el) => {
          let { firstName: elfirstName, lastName: ellastName, email, phoneNumber, id } =
            el.contactPersonOrganization.contactPerson;
            let firstName = `${elfirstName ? elfirstName : ''} ${ellastName ? ellastName : ''}`
            let lastName = `${ellastName ? ellastName : ''} ${elfirstName ? elfirstName : ''}`
          return (
            `Emp-00${id.toString()}`.replace(/\s+/g, '').includes(value) ||
            (firstName.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase())) ||
            (lastName.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase())) ||
            (email && email.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase())) ||
            (phoneNumber && phoneNumber.startsWith(value))
          );
        }),
      });
    } else {
      this.setState({
        filterData: data,
      });
    }
  };
  // will remove if seperate component works fine
  //summary or modal filter
  advancefilter = (value, column, advSearch) => {
    let { data, searchedColumn: search } = this.state;
    if (column) {
      search[column]['value'] = value; // this will need in column filter
    } else {
      search = advSearch;
    }

    if (
      search['id']['value'] ||
      search['firstName']['value'] ||
      search['lastName']['value'] ||
      search['email']['value'] ||
      search['phoneNumber']['value'] ||
      search['gender']['value'].length > 0 ||
      search['stateId']['value'].length > 0 ||
      search['isActive']['value'].length > 0 ||
      search['address']['value']
      // search['clearanceLevel']['value'].length > 0 ||
      // search['role']['value'].length > 0 ||
      // search['employeeStatus']['value'].length > 0 
    ) {
      this.setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search
          const {
            firstName,
            lastName,
            email,
            phoneNumber,
            id,
            gender,
            stateId,
            address,
            clearanceLevel
          } = el.contactPersonOrganization.contactPerson;
          return (
            `Emp-00${id.toString()}`.includes(search['id']['value']) &&
            `${firstName ?? ''}`
              .toLowerCase()
              .includes(search['firstName']['value'].toLowerCase()) &&
            `${lastName ?? ''}`
              .toLowerCase()
              .includes(search['lastName']['value'].toLowerCase()) &&
            `${email ?? ''}`
              .toLowerCase()
              .includes(search['email']['value'].toLowerCase()) &&
            `${phoneNumber ?? ''}`
              .toLowerCase()
              .includes(search['phoneNumber']['value'].toLowerCase()) &&
            `${address ?? ''}`
              .toLowerCase()
              .includes(search['address']['value'].toLowerCase()) &&
            //Creating an string using reduce of all the String array and searching sting in the function

            //Define  ====  //Reducing and creating the array        // but gotta check if the array is not empty otherwise gender value can't be found in emptySrting
            (search['gender']['value'].length > 0
              ? search['gender']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['gender']['value'].length > 0
                ? [gender]
                : [',']
              ).includes(s.value)
            ) &&
            (search['stateId']['value'].length > 0
              ? search['stateId']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['stateId']['value'].length > 0
                ? [stateId]
                : [',']
              ).includes(s.value)
            ) &&
            (search['role']['value'].length > 0
              ? search['role']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['role']['value'].length > 0
                ? [el.roleId]
                : [',']
              ).includes(s.value)
            ) &&
            (search['isActive']['value'].length > 0
              ? search['isActive']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['isActive']['value'].length > 0
                ? [el.active]
                : [',']
              ).includes(s.value)
            ) &&
            (search['clearanceLevel']['value'].length > 0
              ? search['clearanceLevel']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['clearanceLevel']['value'].length > 0
                ? [clearanceLevel]
                : [',']
              ).includes(s.value)
            )
          );
        }),
        searchedColumn: search,
        openSearch: false,
      });
    } else {
      this.setState({
        searchedColumn: search,
        filterData: data,
        openSearch: false,
      });
    }
  };
//  will remove if seperate component works fine
  filterModalUseEffect = () => {
    Promise.all([getStates(), getRoles()])
      .then((res) => {
        const { filterFields } = this.state;
        filterFields[11].data = res[0].success ? res[0].data : [];
        filterFields[14].data = res[1].success ? res[1].data : [];
        this.setState({
          filterFields,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const {
      data,
      infoModal,
      editEmp,
      permissions,
      filterData,
      searchedColumn,
      filterFields,
      openSearch,
    } = this.state;
    const columns = this.columns;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={4}>Employees</Title>
          </Col>
          <Col>
            <Row justify="space-between" gutter={17}>
              <Col>
                <Button
                  type="default"
                  size="small"
                  onClick={() => this.setState({ openSearch: true })}
                >
                  <FilterOutlined />
                  Filter
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ infoModal: true });
                  }}
                  size="small"
                  disabled={!permissions['ADD']}
                >
                  <PlusSquareOutlined />
                  Employees
                </Button>
              </Col>
            </Row>
          </Col>
          <Filtertags
            filters={searchedColumn}
            filterFunction={(value, column)=>this.advancefilter(value, column)}
          />
          <Col span={24}>
            <Table
              title={() => tableTitleFilter(5, this.generalFilter)}
              bordered
              pagination={{ pageSize: localStore().pageSize }}
              rowKey={(data) => data.id}
              columns={columns}
              dataSource={filterData}
              size="small"
              // sticky
              className="fs-small"
              // summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
            />
          </Col>
        </Row>
        {/* //  will remove if seperate component works fine */}
        {openSearch && (
          <TableModalFilter
            title={'Filter Employees'}
            visible={openSearch}
            filters={searchedColumn}
            filterFields={filterFields}
            filterFunction={this.advancefilter}
            effectFunction={this.filterModalUseEffect}
            effectRender={true}
            onClose={() => this.setState({ openSearch: false })}
          />
        )}
        {/* // seperate function for filter.. */}
        {/* {openSearch && (
          <TableModalFilter
            title={'Filter Employees'}
            visible={openSearch}
            filters={searchedColumn}
            filterFields={filterFields}
            filterFunction={(value, column, advSearch)=>EmployeeAdvaceFilter(value, column, this.state, this.setState.bind(this), advSearch)}
            effectFunction={()=>EmployeeModalUseEffect(this.state, this.setState.bind(this))}
            effectRender={true}
            onClose={() => this.setState({ openSearch: false })}
          />
        )} */}
        {infoModal && (
          <InfoModal
            visible={infoModal}
            editEmp={editEmp}
            close={this.closeModal}
            callBack={this.callBack}
          />
        )}
      </>
    );
  }
}

export default Employees;
