import React, { Component } from 'react';
import {
  Row,
  Col,
  Menu,
  Table,
  Modal,
  Button,
  Dropdown,
  Popconfirm,
  Typography,
  Input,
  Space,
  Switch,
  InputNumber,
} from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  FilterOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons'; //Icons
// import { Link } from 'react-router-dom'
import { Link } from "react-router-dom";

import InfoModal from './InfoModal';
import { getList, delList } from '../../../service/conatct-person';
import { GENDER, localStore } from '../../../service/constant';
import {
  Filtertags,
  TableModalFilter,
  tableSorter,
  tableSummaryFilter,
  tableTitleFilter,
} from '../../../components/Core/Table/TableFilter';
import {
  getOrganizations,
  getStandardSkills,
  getStates,
} from '../../../service/constant-Apis';
import { generalDelete } from "../../../service/delete-Api's";

const { Title } = Typography;

class Contact extends Component {
  constructor(props) {
    super(props);
    this.contactForm = React.createRef();

    this.columns = [
      {
        title: 'Code',
        dataIndex: 'id',
        key: 'id',
        width: 115,
        render: (record) => `00${record}`,
        ...tableSorter('id', 'number', true),
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (text, record) => (
          <Link
            to={{ pathname: `/contacts/${record.id}/info` }}
            className="nav-link"
          >
            {text}
          </Link>
        ),
        ...tableSorter('firstName', 'string'),
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        ...tableSorter('lastName', 'string'),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
        render: (value) => GENDER[value],
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Phone',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 150,
      },
      {
        title: 'Status',
        dataIndex: 'employementStatus',
        key: 'employementStatus',
        render:(text, record)=>(
          employementLink(text, record?.employee?.id)
        ),
        ...tableSorter('employementStatus', 'string')
      },
      {
        title: '...',
        key: 'action',
        align: 'center',
        width: '1%',
        render: (value, record, index) => (
          <Dropdown
            overlay={
              <Menu key={index}>
                <Menu.Item
                  key="delete"
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
                  key="update"
                  onClick={() => {
                    this.setState({ openModal: true, editCP: record.id, status: record.employementStatus });
                  }}
                  disabled={this.state && !this.state.permissions['UPDATE']}
                >
                  Edit
                </Menu.Item>
                <Menu.Item key="View">
                  <Link
                    to={{ pathname: `/contacts/${record.id}/info` }}
                    className="nav-link"
                  >
                    View
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
      openSearch: false,
      filterData: [],
      status: false,
      data: [],
      openModal: false,
      editCP: false,
      permissions: {},
      searchText: '',
      searchedColumn: {
        id: { type: 'Input', value: '', label: 'Code', showInColumn: true },
        firstName: {
          type: 'Input',
          value: '',
          label: 'First Name',
          showInColumn: true,
        },
        lastName: {
          type: 'Input',
          value: '',
          label: 'Last Name',
          showInColumn: true,
        },
        gender: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'Gender',
          showInColumn: true,
          mode: 'multiple',
          options: [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
            { label: 'Other', value: 'O' },
          ],
        },
        email: { type: 'Input', value: '', label: 'Email', showInColumn: true },
        phoneNumber: {
          type: 'Input',
          value: '',
          label: 'Phone Number',
          showInColumn: true,
        },
        Action: {
          type: 'Input',
          value: '',
          label: '',
          showInColumn: true,
          disabled: true,
        },
        stateId: {
          type: 'none',
          multi: true,
          value: [],
          label: 'State',
          showInColumn: false,
          disabled: false,
        },
        address: {
          type: 'none',
          value: '',
          label: 'Address',
          showInColumn: false,
          disabled: false,
        },
        skill: {
          type: 'none',
          multi: true,
          value: [],
          label: 'Skill',
          showInColumn: false,
          disabled: false,
        },
        clearanceLevel: {
          type: 'none',
          multi: true,
          value: [],
          label: 'clearanceLevel',
          showInColumn: false,
          disabled: false,
        },
        association: {
          type: 'none',
          multi: true,
          value: [],
          label: 'Association',
          showInColumn: false,
          disabled: false,
        },
        recruitmentProspect: {
          type: 'none',
          multi: true,
          value: [],
          label: 'Recruitment Prospects',
          showInColumn: false,
          disabled: false,
        },
        recruitmentAvailability: {
          type: 'none',
          multi: true,
          value: [],
          label: 'Availability',
          showInColumn: false,
          disabled: false,
        },
        recruitmentContractType: {
          type: 'none',
          multi: true,
          value: [],
          label: 'Contract Type',
          showInColumn: false,
          disabled: false,
        },
      },

      filterFields: [
        //just here for fun will get shift to contact
        {
          Placeholder: 'First Name',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Last Name',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'firstName',
          size: 'small',
          type: 'input',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'lastName',
          size: 'small',
          type: 'input',
        },
        {
          Placeholder: 'Phone',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Email',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'phoneNumber',
          size: 'small',
          type: 'input',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'email',
          size: 'small',
          type: 'input',
        },
        {
          Placeholder: 'Gender',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'State For Payroll Tax Purpose',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'gender',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
          data: [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
            { label: 'Other', value: 'O' },
          ],
          type: 'Select',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'stateId',
          mode: 'multiple',
          customValue: (value, option) => option,
          size: 'small',
          type: 'Select',
          // data: ,
        },
        {
          Placeholder: 'Clearance Level',
          fieldCol: 24,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'clearanceLevel',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
          data: [
            { label: 'BV - Baseline Vetting', value: 'BV' },
            { label: 'NV1 - Negative Vetting 1', value: 'NV1' },
            { label: 'NV2 - Negative Vetting 2', value: 'NV2' },
            { label: 'PV - Positive Vetting', value: 'PV' },
            { label: 'No clearance', value: 'NC' },
          ],
          type: 'Select',
        },
        {
          Placeholder: 'Skill',
          fieldCol: 24,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'skill',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
          data: [],
          type: 'Select',
        },
        {
          Placeholder: 'Association',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'association',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
          data: [],
          type: 'Select',
        },
        {
          Placeholder: 'Recruitment Prospects',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'recruitmentProspect',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
           data: [
            { label: 'Not Considered', value: 'NCO' },
            { label: 'Do Not Hire', value: 'DNH' },
            { label: 'Prospect', value: 'PRO' },
            { label: 'Assigned To Opportunity', value: 'ATO' },
          ],
          type: 'Select',
        },
        {
          Placeholder: 'Availability',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'recruitmentAvailability',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
          data: [
            { label: 'Immediate', value: 'IMM' },
            { label: 'Within A Month', value: 'WMO' },
            { label: 'Over A Month', value: 'OMO' },
            { label: 'Long-term Propect', value: 'LTP' },
            { label: 'No Clearance', value: 'NCL' },
          ],
          type: 'Select',
        },
        {
          Placeholder: 'Contract Type',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'recruitmentContractType',
          size: 'small',
          mode: 'multiple',
          customValue: (value, option) => option,
          data: [
            { label: 'Part Time', value: 'PTI' },
            { label: 'Full Time', value: 'FTI' },
            { label: 'Casual', value: 'CAS' },
            { label: 'Contractor', value: 'CON' },
          ],
          type: 'Select',
        },
        {
          Placeholder: 'Address',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          key: 'address',
          size: 'small',
          type: 'Input',
        },
      ],
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    const { CONTACT_PERSONS } = JSON.parse(localStore().permissions);
    getList().then((res) => {
      if (res.success) {
        this.setState({
          data: res.data,
          filterData: res.data,
          openModal: false,
          editCP: false,
          status: false,
          permissions: CONTACT_PERSONS,
        });
      }
    });
  };

  handleDelete = (id, index) => {
    console.log({ id, index });
    const url = '/contactpersons';
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

  toggelModal = (status) => {
    this.setState({ openModal: status, editCP: false, status: false });
  };

  Callback = () => {
    this.getData();
  };

  submit = () => {
    this.contactForm.current.refs.contact_form.submit();
  };

  //Title bar filter for evey Coulmn showing
  generalFilter = (value) => {
    const { data } = this.state;
    value = value.replace(/\s+/g, '').toLowerCase()
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          let firstName = `${el.firstName ? el.firstName : ''} ${el.lastName ? el.lastName : ''}`
          let lastName = `${el.lastName ? el.lastName : ''} ${el.firstName ? el.firstName : ''}`
          return (
            `00${el.id.toString()}`.includes(value) ||
            (firstName.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase())) ||
            (lastName.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase())) ||
            (el.email &&
              el.email.toLowerCase().replace(/\s+/g, '').includes(value.toLowerCase())) ||
            (el.gender &&
              GENDER[el.gender].toLowerCase().includes(value.toLowerCase())) ||
            (el.phoneNumber && el.phoneNumber.startsWith(value))
          );
        }),
      });
    } else {
      this.setState({
        filterData: data,
      });
    }
  };

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
      search['address']['value'] ||
      search['skill']['value'].length > 0 ||
      search['clearanceLevel']['value'].length > 0 ||
      search['association']['value'].length > 0 ||
      search['recruitmentProspect']['value'].length > 0 ||
      search['recruitmentAvailability']['value'].length > 0 ||
      search['recruitmentContractType']['value'].length > 0
    ) {

      this.setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search  
          let contactPerson = el.employementStatus === 'Contact Person'
          return (
            `00${el.id.toString()}`.includes(search['id']['value']) &&
            `${el.firstName ?? ''}`
              .toLowerCase()
              .includes(search['firstName']['value'].toLowerCase()) &&
            `${el.lastName ?? ''}`
              .toLowerCase()
              .includes(search['lastName']['value'].toLowerCase()) &&
            `${el.email ?? ''}`
              .toLowerCase()
              .includes(search['email']['value'].toLowerCase()) &&
            `${el.phoneNumber ?? ''}`
              .toLowerCase()
              .includes(search['phoneNumber']['value'].toLowerCase()) &&
            `${el.address ?? ''}`
              .toLowerCase()
              .includes(search['address']['value'].toLowerCase()) &&
            //Creating an string using reduce of all the String array and searching sting in the function

            //Define  ====  //Reducing and creating the array        // but gotta check if the array is not empty otherwise gender value can't be found in emptySrting
            (search['gender']['value'].length > 0
              ? search['gender']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['gender']['value'].length > 0
                ? [el.gender]
                : [',']
              ).includes(s.value)
            ) &&
            (search['stateId']['value'].length > 0
              ? search['stateId']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['stateId']['value'].length > 0
                ? [el.stateId]
                : [',']
              ).includes(s.value)
            ) &&

            (search['clearanceLevel']['value'].length > 0
              ? search['clearanceLevel']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['clearanceLevel']['value'].length > 0
                ? [el.clearanceLevel]
                : [',']
              ).includes(s.value)
            ) &&
                        
            // //searching for skill in skills array
            // giving some function a default array... and search it if not passed
            (search['skill']['value'].length > 0
              ? search['skill']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (el.standardSkillStandardLevels &&
              el.standardSkillStandardLevels.length > 0 &&
              search['skill']['value'].length > 0
                ? el.standardSkillStandardLevels.map((p) => p.standardSkillId)
                : [',']
              ).includes(s.value)
            ) &&
            (search['association']['value'].length > 0
              ? search['association']['value']
              : [{ value: ',' }]
            ).some(
              (s) =>
                ( (el.contactPersonOrganizations &&
                  el.contactPersonOrganizations.length > 0 && search['association']['value'].length > 0)
                  ? el.contactPersonOrganizations.map((p) => p.organizationId)
                  : [',']
                ).includes(s.value)
            ) &&

            (search['recruitmentProspect']['value'].length > 0 && contactPerson
            ? search['recruitmentProspect']['value']
            : [{ value: ',' }]
            ).some((s) =>
              (search['recruitmentProspect']['value'].length > 0
                ? [el.recruitmentProspect]
                : [',']
              ).includes(s.value) 
            ) &&
            
            (search['recruitmentAvailability']['value'].length > 0 && contactPerson
              ? search['recruitmentAvailability']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['recruitmentAvailability']['value'].length > 0
                ? [el.recruitmentAvailability]
                : [',']
              ).includes(s.value) 
            ) &&
            
            (search['recruitmentContractType']['value'].length > 0 && contactPerson
              ? search['recruitmentContractType']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['recruitmentContractType']['value'].length > 0
                ? [el.recruitmentContractType]
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

  filterModalUseEffect = () => {
    Promise.all([getStates(), getStandardSkills(), getOrganizations()])
      .then((res) => {
        const { filterFields } = this.state;
        filterFields[11].data = res[0].success ? res[0].data : [];
        filterFields[15].data = res[1].success ? res[1].data : [];
        filterFields[17].data = res[2].success ? res[2].data : [];
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
      filterData,
      openModal,
      editCP,
      permissions,
      searchedColumn,
      openSearch,
      filterFields,
      status
    } = this.state;
    const columns = this.columns;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={4}>Contacts</Title>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Row justify="end">
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
              <Col offset={1}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.setState({ openModal: true, status:undefined });
                  }}
                  disabled={!permissions['ADD']}
                >
                  <PlusSquareOutlined />
                  Contact Person
                </Button>
              </Col>
            </Row>
          </Col>
          <Filtertags
            filters={searchedColumn}
            filterFunction={this.advancefilter}
          />
          <Col span={24}>
            <Table
              title={() => tableTitleFilter(5, this.generalFilter)}
              bordered
              className="fixed-top fs-small"
              pagination={{ pageSize: localStore().pageSize }}
              rowKey={(data) => data.id}
              columns={columns}
              dataSource={filterData}
              size="small"
              // sticky
              // summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
            />
          </Col>
        </Row>
        {openSearch && (
          <TableModalFilter
            title={'Filter Contact Persons'}
            visible={openSearch}
            filters={searchedColumn}
            filterFields={filterFields}
            filterFunction={this.advancefilter}
            effectFunction={this.filterModalUseEffect}
            effectRender={true}
            onClose={() => this.setState({ openSearch: false })}
          />
        )}
        {openModal && (
          <InfoModal
            visible={openModal}
            editCP={editCP}
            contactStatus={status}
            close={this.toggelModal}
            callBack={this.Callback}
          />
        )}
      </>
    );
  }
}

export default Contact;


//---->HELPER <-----

function employementLink(status, employeeId){
  let endPoint =
    status === 'Employee'
      ? 'Employees'
      : status === 'Sub Contractor'
      ? 'sub-contractors'
      : 'contacts';

  return employeeId ? (
    <Link
      to={{ pathname: `/${endPoint}/${employeeId}/info` }}
      className="nav-link"
    >
      {status}
    </Link>
  ) : (
    status
  );
}