import React, { Component } from 'react';
import {
  Table,
  Menu,
  Dropdown,
  Button,
  Popconfirm,
  Row,
  Col,
  Typography,
  Tag,
} from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  FilterOutlined,
} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

import InfoModal from './Modals/InfoModal';

import { getList, delList } from '../../service/projects';

import moment from 'moment';
import {
  formatDate,
  formatCurrency,
  localStore,
  O_TYPE,
  O_PHASE,
} from '../../service/constant';
import {
  getOrganizations,
  getPanels,
  getStates,
} from '../../service/constant-Apis';
import {
  Filtertags,
  TableModalFilter,
  tableSorter,
  tableTitleFilter,
} from '../../components/Core/Table/TableFilter';
import { generalDelete } from "../../service/delete-Api's";
import { Tag_s } from '../../components/Core/Custom/Index';
const { Title } = Typography;

class Projects extends Component {
  constructor(props) {
    super(props);
    this.proForm = React.createRef();
    this.columns = [
      {
        title: 'Code',
        dataIndex: 'id',
        key: 'id',
        width: '1%',
        render: (record) => `00${record}`,
        ...tableSorter('id', 'number'),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '30%',
        render: (value, record) => (
          <Link
            to={{ pathname: `/projects/${record.id}/info` }}
            className="nav-link"
          >
            {' '}
            {value}{' '}
          </Link>
        ),
        ...tableSorter('title', 'string'),
      },
      {
        title: 'Organisation Name',
        dataIndex: 'organization',
        key: 'organization',
        width: '20%',
        render: (record) => {
          return (
            record && (
              <Link
                to={{ pathname: `/organisations/${record.id}/info` }}
                className="nav-link"
              >
                {record.name}
              </Link>
            )
          );
        },
        ...tableSorter('organization.name', 'string'),
      },
      {
        title: 'Revenue',
        dataIndex: 'value',
        key: 'value',
        render: (record) => `${formatCurrency(record)}`,
        ...tableSorter('value', 'number'),
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (record) => formatDate(record, true, true),
        ...tableSorter('startDate', 'date'),
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDtae',
        render: (record) => formatDate(record, true, true),
        ...tableSorter('endDate', 'date'),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '1%',
        render: (record) => O_TYPE[record],
        ...tableSorter('type', 'number'),
      },
      {
        title: 'Status',
        dataIndex: 'phase',
        key: 'phase',
        width: '1%',
        render: (text) => (
          <Tag_s
            text={`${text}`}
            objName="O_PHASE"
            colorName="O_PHASE_COLORS"
          />
        ),
        ...tableSorter('phase', 'string', true, true),
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
                  key="delete"
                  danger
                  disabled={
                    !this?.state?.permissions?.['DELETE'] || record.phase
                  }
                  className="pop-confirm-menu"
                >
                  <Popconfirm
                    title="Are you sure you want to delete"
                    onConfirm={() => this.handleDelete(record.id, index)}
                  >
                    <div> Delete </div>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item
                  key="update"
                  onClick={() =>
                    this.setState({
                      openModal: true,
                      editPro: {
                        id: record.id,
                        onHold: record.phase === false,
                      },
                    })
                  }
                  disabled={!this?.state?.permissions?.['UPDATE']}
                >
                  Edit
                </Menu.Item>
                <Menu.Item key="order">
                  <Link
                    to={{ pathname: `/projects/${record.id}/purchase-order` }}
                    className="nav-link"
                  >
                    Purchase Order
                  </Link>
                </Menu.Item>
                {record.type === 1 ? ( //if condition
                  <Menu.Item key="milestone">
                    <Link
                      to={{ pathname: `/projects/${record.id}/milestones` }}
                      className="nav-link"
                    >
                      Milestones
                    </Link>
                  </Menu.Item>
                ) : (
                  //else condition
                  <Menu.Item key="position">
                    <Link
                      to={{
                        pathname: `/projects/${record.id}/milestones/${record?.milestones?.[0]?.id}/resources`,
                        // pathname: `/projects/${record.id}/resources`,
                      }}
                      className="nav-link"
                    >
                      Postions
                    </Link>
                  </Menu.Item>
                )}
                <Menu.Item key="view">
                  <Link
                    to={{ pathname: `/projects/${record.id}/info` }}
                    className="nav-link"
                  >
                    View
                  </Link>
                </Menu.Item>
                {record.type === 1 ? (
                  <Menu.Item key={'schedule'}>
                    <Link
                      to={{ pathname: `/projects/${record.id}/schedules` }}
                      className="nav-link"
                    >
                      Schedules
                    </Link>
                  </Menu.Item>
                ) : (
                  ``
                )}
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
      data: [],
      openModal: false,
      editPro: { id: false, onHold: false },
      permissions: {},
      filterData: [],
      openSearch: false,
      searchedColumn: {
        id: { type: 'Input', value: '', label: 'Code', showInColumn: true },
        title: { type: 'Input', value: '', label: 'Title', showInColumn: true },
        organization: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'Organization',
          showInColumn: true,
        },
        panel: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'panel',
          showInColumn: true,
        },
        revenue: {
          type: 'Input',
          value: '',
          label: 'Revenue',
          showInColumn: true,
        },
        startDate: {
          type: 'Date',
          value: null,
          label: 'Start Date',
          showInColumn: true,
        },
        endDate: {
          type: 'Date',
          value: null,
          label: 'End Date',
          showInColumn: true,
          disabled: true,
        },
        entryDate: {
          type: 'Date',
          value: null,
          label: 'Entry Date',
          showInColumn: true,
          disabled: true,
        },
        stage: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'stage',
          showInColumn: true,
        },
        type: { type: 'Select', value: '', label: 'Type', showInColumn: true },
        Action: {
          type: 'Input',
          value: '',
          label: '',
          showInColumn: true,
          disabled: true,
        },
        stateId: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'State',
          showInColumn: false,
          disabled: false,
        },
        address: {
          type: 'Input',
          value: '',
          label: 'Address',
          showInColumn: false,
          disabled: false,
        },
        qualifiedOps: {
          type: 'Select',
          value: '',
          label: 'Qualified Ops',
          showInColumn: false,
          disabled: false,
        },
        phase: {
          type: 'Select',
          value: '',
          label: 'Status',
          showInColumn: true,
        },
      },

      filterFields: [
        {
          Placeholder: 'Panel',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Organisation',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          mode: 'multiple',
          key: 'panel',
          customValue: (value, option) => option,
          size: 'small',
          data: [],
          type: 'Select',
        },
        {
          object: 'obj',
          fieldCol: 12,
          mode: 'multiple',
          key: 'organization',
          customValue: (value, option) => option,
          size: 'small',
          data: [],
          type: 'Select',
        },
        {
          Placeholder: 'Name',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Type',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'title',
          size: 'small',
          type: 'Input',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'type',
          size: 'small',
          data: [
            { label: 'Milestone', value: '1' },
            { label: 'Time & Materials', value: '2' },
          ],
          type: 'Select',
        },
        {
          Placeholder: 'State',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Qualified Ops',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          mode: 'multiple',
          key: 'stateId',
          customValue: (value, option) => option,
          size: 'small',
          data: [],
          type: 'Select',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'qualifiedOps',
          // label: "Qualified Ops",
          size: 'small',
          data: [
            { label: 'True', value: 'True' },
            { label: 'False', value: 'False' },
          ],
          type: 'Select',
        },
        {
          Placeholder: 'Estimated Value',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Start Date',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'revenue',
          size: 'small',
          shape: '$',
          type: 'InputNumber',
          fieldStyle: { width: '100%' },
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'startDate',
          size: 'small',
          type: 'RangePicker',
          fieldStyle: { width: '100%' },
        },
        {
          Placeholder: 'End Date',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Entry Date',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'endDate',
          size: 'small',
          type: 'RangePicker',
          fieldStyle: { width: '100%' },
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'entryDate',
          size: 'small',
          type: 'RangePicker',
          fieldStyle: { width: '100%' },
        },
        {
          Placeholder: 'Status',
          fieldCol: 24,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'phase',
          size: 'small',
          data: [
            { label: 'Open', value: 'true' },
            { label: 'Close', value: 'false' },
          ],
          type: 'Select',
        },
      ],
    };
  }

  componentDidMount = () => {
    this.getList();
  };

  getList = () => {
    const { PROJECTS } = JSON.parse(localStore().permissions);
    getList().then((res) => {
      this.setState({
        data: res.success ? res.data : [],
        filterData: res.success ? res.data : [],
        openModal: false,
        editPro: { id: false, onHold: false },
        permissions: PROJECTS,
      });
    });
  };

  handleDelete = (id, index) => {
    const url = '/projects';
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

  callBack = () => {
    // this will work after I get the Object from the form
    this.getList();
  };

  closeModal = () => {
    this.setState({
      openModal: false,
      editPro: { id: false, onHold: false },
    });
  };

  generalFilter = (value) => {
    let { data } = this.state;
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          const { name: organization } = el.organization;
          return (
            `00${el.id.toString()}`.includes(value) ||
            (el.title &&
              el.title.toLowerCase().includes(value.toLowerCase())) ||
            (organization &&
              organization.toLowerCase().includes(value.toLowerCase())) ||
            (el.value &&
              `${formatCurrency(el.value)}`
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            (el.startDate &&
              `${formatDate(el.startDate, true, true)}`
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            (el.endDate &&
              `${formatDate(el.endDate, true, true)}`
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            (el.type &&
              `${O_TYPE[el.type]}`
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            `${O_PHASE[el.phase]}`.toLowerCase().includes(value.toLowerCase())
          );
        }),
      });
    } else {
      this.setState({
        filterData: data,
      });
    }
  };

  advancefilter = (value, column, advSearch) => {
    let { data, searchedColumn: search } = this.state;
    if (column) {
      search[column]['value'] = value; // this will need in column filter
    } else {
      search = advSearch;
    }
    if (
      search['id']['value'] ||
      search['title']['value'] ||
      search['organization']['value'].length > 0 ||
      search['revenue']['value'] ||
      search['startDate']['value'] ||
      search['endDate']['value'] ||
      search['entryDate']['value'] ||
      search['panel']['value'].length > 0 ||
      search['stage']['value'].length > 0 ||
      search['phase']['value'] ||
      search['type']['value'] ||
      search['stateId']['value'].length > 0
    ) {
      let dummyDates = ['2010-10-19', '2010-10-25'];
      const startDate = search['startDate']['value'] ?? dummyDates;
      const endDate = search['endDate']['value'] ?? dummyDates;
      const entryDate = search['entryDate']['value'] ?? dummyDates;
      this.setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search
          const { id: organization } = el.organization;
          return (
            `00${el.id.toString()}`.includes(search['id']['value']) &&
            `${el.title ?? ''}`
              .toLowerCase()
              .includes(search['title']['value'].toLowerCase()) &&
            `${el.value.toString() ?? ''}`
              .toLowerCase()
              .includes(search['revenue']['value'].toString().toLowerCase()) &&
            `${el.type ?? ''}`
              .toLowerCase()
              .includes(search['type']['value'].toLowerCase()) &&
            `${el.phase ?? ''}`
              .toLowerCase()
              .includes(search['phase']['value'].toLowerCase()) &&
            `${el.qualifiedOps ?? ''}`
              .toLowerCase()
              .includes(search['qualifiedOps']['value'].toLowerCase()) &&
            // multi Select Search

            (search['organization']['value'].length > 0
              ? search['organization']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['organization']['value'].length > 0
                ? [organization]
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
            (search['stage']['value'].length > 0
              ? search['stage']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['stage']['value'].length > 0
                ? [el.stage]
                : [',']
              ).includes(s.value)
            ) &&
            (search['panel']['value'].length > 0
              ? search['panel']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['panel']['value'].length > 0
                ? [el.panelId]
                : [',']
              ).includes(s.value)
            ) &&
            //Start Date Filter
            moment(
              search['startDate']['value']
                ? formatDate(el.startDate, true, 'YYYY-MM-DD')
                : '2010-10-20'
            ).isBetween(startDate[0], startDate[1], undefined, '[]') &&
            //End Date Filter
            moment(
              search['endDate']['value']
                ? formatDate(el.endDate, true, 'YYYY-MM-DD')
                : '2010-10-20'
            ).isBetween(endDate[0], endDate[1], undefined, '[]') &&
            //Entry Date Filter
            moment(
              search['entryDate']['value']
                ? formatDate(el.entryDate, true, 'YYYY-MM-DD')
                : '2010-10-20'
            ).isBetween(entryDate[0], entryDate[1], undefined, '[]')
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
    Promise.all([getPanels(), getOrganizations(), getStates()])
      .then((res) => {
        const { filterFields } = this.state;
        filterFields[2].data = res[0].success ? res[0].data : [];
        filterFields[3].data = res[1].success ? res[1].data : [];
        filterFields[10].data = res[2].success ? res[2].data : [];
        this.setState({ filterFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const {
      data,
      openModal,
      editPro,
      permissions,
      filterData,
      searchedColumn,
      filterFields,
      openSearch,
    } = this.state;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={4}>Projects</Title>
          </Col>
          <Col style={{ textAlign: 'end' }} span={4}>
            <Row justify="space-between">
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
                  size="small"
                  onClick={() => {
                    this.setState({
                      openModal: true,
                      editPro: { id: false, onHold: false },
                    });
                  }}
                  disabled={!permissions['ADD']}
                >
                  <PlusSquareOutlined />
                  Add Project
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
              pagination={{ pageSize: localStore().pageSize }}
              rowKey={(data) => data.id}
              columns={this.columns}
              dataSource={filterData}
              size="small"
              className="fs-small"
              // sticky
              // summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
            />
          </Col>
        </Row>
        {openSearch && (
          <TableModalFilter
            title={'Filter Projects'}
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
            editPro={editPro?.id}
            onHold={editPro?.onHold}
            close={this.closeModal}
            callBack={this.callBack}
          />
        )}
      </>
    );
  }
}

export default Projects;
