import React, { Component, useState } from 'react';
import {
  Row,
  Col,
  Menu,
  Button,
  Dropdown,
  Descriptions,
  Table,
  Popconfirm,
} from 'antd';
import {
  SettingOutlined,
  DownOutlined,
  FilterOutlined,
} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

import ResModal from './Modals/ResModal';
import {
  getRecord,
  getLeadSkills,
  delLeadSkill,
  delLeadSkillResource,
  selectLeadSkillResource,
} from '../../service/opportunities';

import moment from 'moment';
import {
  formatDate,
  formatCurrency,
  localStore,
  O_STATUS,
  formatFloat,
} from '../../service/constant';
import {
  Filtertags,
  TableModalFilter,
  tableSorter,
  tableTitleFilter,
} from '../../components/Core/Table/TableFilter';
import { getPanelSkills } from '../../service/constant-Apis';
import { generalDelete } from "../../service/delete-Api's";

const { Item } = Descriptions;

class Resources extends Component {
  constructor() {
    super();
    this.columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        ...tableSorter('title', 'string'),
      },
      {
        title: 'Skill',
        dataIndex: ['panelSkill', 'label'],
        key: 'panelSkill',
        ...tableSorter('panelSkill.label', 'string'),
      },
      {
        title: 'Level',
        dataIndex: ['panelSkillStandardLevel', 'levelLabel'],
        key: 'panelSkillStandardLevel',
        ...tableSorter('panelSkillStandardLevel.levelLabel', 'string'),
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (record) => record && formatDate(record, true, true),
        ...tableSorter('startDate', 'Date'),
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (record) => record && formatDate(record, true, true),
        ...tableSorter('endDate', 'Date'),
      },
      {
        title: 'Total Hours',
        dataIndex: 'billableHours',
        key: 'billableHours',
        render: (text)=> formatFloat(text),
        ...tableSorter('billableHours', 'number'),
      },

      {
        title: '...',
        key: 'action',
        align: 'center',
        width: '1%',
        render: (text, record, index) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="delete"
                  danger
                  disabled={!this?.state?.permissions?.['DELETE']}
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
                  key="edit"
                  onClick={() => {
                    this.getSkilldEmployee(
                      true,
                      false,
                      false,
                      record,
                      index,
                      record.panelSkillStandardLevelId
                    );
                  }}
                  disabled={!this?.state?.permissions?.['UPDATE']}
                >
                  Edit Position
                </Menu.Item>
                <Menu.Item
                  key="add"
                  onClick={() => {
                    this.getSkilldEmployee(
                      true,
                      record.id,
                      true,
                      false,
                      index,
                      record.panelSkillStandardLevelId,
                      record.panelSkillStandardLevel
                    );
                  }}
                  disabled={!this?.state?.permissions?.['ADD']}
                >
                  Add Resouce
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
      editRex: false,
      leadId: false,
      data: [],
      desc: {},
      mileDesc: {},
      ceil: {},
      skillId: false,
      levelId: false,
      crud: false,
      mileId: false,
      resource: false,
      permissons: { ADD: true },
      openSearch: false,
      filterData: [],
      searchedColumn: {
        skill: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'Skill',
          showInColumn: true,
        },
        level: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'Level',
          showInColumn: true,
        },
        billableHours: { type: 'Input', value: '', label: 'Billable Hour' },
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
      },
      filterFields: [
        {
          Placeholder: 'Skill',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Total Billable Hours',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          mode: 'multiple',
          key: 'skill',
          customValue: (value, option) => option,
          size: 'small',
          data: [],
          type: 'Select',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'billableHours',
          size: 'small',
          type: 'InputNumber',
          fieldStyle: { width: '100%' },
        },
        {
          Placeholder: 'Start Date',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'End Date',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
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
          object: 'obj',
          fieldCol: 12,
          key: 'endDate',
          size: 'small',
          type: 'RangePicker',
          fieldStyle: { width: '100%' },
        },
      ],
    };
  }

  componentDidMount = () => {
    this.fetchAll();
  };

  fetchAll = () => {
    const { proId, mileId } = this.props.match.params;
    const { url } = this.props.match;
    const { OPPORTUNITIES } = JSON.parse(localStore().permissions);
    Promise.all([getRecord(proId), getLeadSkills(url)])
      .then((res) => {
        this.setState({
          desc: res[0].success ? res[0].data : {},
          mileDesc:
            res[0]?.success && res[0]?.data?.milestones
              ? res[0]?.data?.milestones.filter((el) => el.id == mileId)[0]
              : {},
          editRex: false,
          infoModal: false,
          leadId: proId,
          mileId: mileId,
          crud: url,
          data: res[1].success ? res[1].data : [],
          filterData: res[1].success ? res[1].data : [],
          permissions: OPPORTUNITIES,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getLeadSkills = () => {
    const { crud } = this.state;
    getLeadSkills(crud).then((res) => {
      if (res.success) {
        this.setState({
          data: res.data,
          filterData: res.data,
          editRex: false,
          infoModal: false,
          skillId: false,
          levelId: false,
          tableIndex: false,
          ceil: {},
        });
      }
    });
  };

  getSkilldEmployee = (
    infoModal,
    skillId,
    resource,
    editRex,
    tableIndex,
    levelId,
    panelSkillLevel
  ) => {
    const { startDate, endDate } = this.state.mileDesc;
    this.setState({
      pDates: { startDate, endDate },
      infoModal: infoModal,
      skillId: skillId,
      levelId: levelId,
      resource: resource,
      editRex: editRex,
      tableIndex: tableIndex,
      ceil: panelSkillLevel && {
        short: panelSkillLevel.shortTermCeil,
        long: panelSkillLevel.longTermCeil,
      },
    });
  };

  closeModal = () => {
    this.setState({ infoModal: false, editRex: false, ceil: {} });
  };

  handleDelete = (id, index) => {
    const { crud, data, filterData } = this.state;
    const { history } = this.props;
    generalDelete(history, crud, id, index, filterData, data).then((res) => {
      if (res.success) {
        this.setState({
          data: [...res.data],
          filterData: [...res.filterData],
        });
      }
    });
  };

  callBack = (value) => {
    let { leadId, skillId, editRex, tableIndex } = this.state;
    // // let data = this.state.data;
    // if (editRex){ // edit skill value
    //     data[tableIndex] = value
    // }else if (skillId){ // add new Resource in skill
    //     data[tableIndex].opportunityResourceAllocations = [...data[tableIndex].opportunityResourceAllocations, value]
    // }else{
    //     data = [...data, value]
    // }
    // this.setState({data,editRex: false, infoModal: false, skillId: false})
    this.getLeadSkills(leadId);
  };

  generalFilter = (value) => {
    const { data } = this.state;
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          const { label: skill } = el.panelSkill;
          const { levelLabel: skillLevel } = el.panelSkillStandardLevel;
          return (
            (el.title &&
              el.title.toLowerCase().includes(value.toLowerCase())) ||
            `${skill ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
            `${skillLevel ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
            (el.startDate &&
              `${formatDate(el.startDate, true, true)}`
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            (el.endDate &&
              `${formatDate(el.endDate, true, true)}`
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            `${el.billableHours ?? ''}`
              .toLowerCase()
              .includes(value.toLowerCase())
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
      search['skill']['value'] ||
      search['billableHours']['value'] ||
      search['startDate']['value'] ||
      search['endDate']['value']
    ) {
      const dummyDate = ['2010-10-19', '2010-10-25'];

      const startDate = search['startDate']['value'] ?? dummyDate;
      const endDate = search['endDate']['value'] ?? dummyDate;
      this.setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search

          return (
            `${el.billableHours.toString() ?? ''}`
              .toLowerCase()
              .includes(
                search['billableHours']['value'].toString().toLowerCase()
              ) &&
            // multi Select Search

            (search['skill']['value'].length > 0
              ? search['skill']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['skill']['value'].length > 0
                ? [el.panelSkillId]
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
            ).isBetween(endDate[0], endDate[1], undefined, '[]')
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
    const { desc } = this.state;
    Promise.all([getPanelSkills(desc.panelId)])
      .then((res) => {
        const { filterFields } = this.state;
        filterFields[2].data = res[0].success ? res[0].data : [];
        this.setState({ filterFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const {
      desc,
      filterData,
      data,
      infoModal,
      editRex,
      leadId,
      resource,
      skillId,
      levelId,
      permissions,
      mileId,
      crud,
      openSearch,
      filterFields,
      searchedColumn,
      mileDesc,
      pDates,
      ceil,
    } = this.state;
    return (
      <>
        <Descriptions
          title={'Opportunity Details'}
          size="small"
          bordered
          layout="horizontal"
          // extra={<Button type="primary">Edit</Button>}
        >
          <Item label="Project Name" contentStyle={{ width: '25%' }}>
            {desc.title}
          </Item>
          <Item label="Estimated Value">{`${formatCurrency(desc.value)}`}</Item>
          <Item label="Organisation" contentStyle={{ width: '25%' }}>
            {desc.organization ? (
              <Link
                to={{
                  pathname: `/organisations/${desc.organizationId}/info`,
                }}
                className="nav-link"
              >
                {desc.organization.name}
              </Link>
            ) : (
              'No Organisation'
            )}
          </Item>
          <Item label="Delegate Contact"> {desc.ContactName}</Item>
          <Item label="Start Date">
            {formatDate(desc.startDate, true, true)}{' '}
          </Item>
          <Item label="End Date">{formatDate(desc.endDate, true, true)}</Item>
          <Item label="Bid Date">{formatDate(desc.bidDate, true, true)}</Item>
          <Item label="Status">{desc.status ? O_STATUS[desc.status] : ''}</Item>
        </Descriptions>
        {desc.type === 1 && (
          <Descriptions
            style={{ marginTop: 15 }}
            title={'Milestone Details'}
            size="small"
            bordered
            layout="horizontal"
          >
            <Item label="Milestone Name">{mileDesc.title}</Item>
            <Item label="Start Date">
              {formatDate(mileDesc.startDate, true, true)}{' '}
            </Item>
            <Item label="End Date">
              {formatDate(mileDesc.endDate, true, true)}
            </Item>
          </Descriptions>
        )}
        <Row justify="end" span={4} gutter={[30, 0]}>
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
                this.getSkilldEmployee(true, false, false, false, false, false);
              }}
              disabled={permissions && !permissions['ADD']}
            >
              Add Position
            </Button>
          </Col>
          {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
        </Row>
        <Filtertags
          filters={searchedColumn}
          filterFunction={this.advancefilter}
        />
        <Table
          title={() => tableTitleFilter(5, this.generalFilter)}
          bordered
          pagination={{ pageSize: localStore().pageSize }}
          rowKey={(record) => record.id}
          columns={this.columns}
          size="small"
          className="fs-small"
          dataSource={filterData}
          expandable={{
            rowExpandable: (record) =>
              record.opportunityResourceAllocations.length > 0,
            expandedRowRender: (record) => {
              return (
                <NestedTable
                  data={record.opportunityResourceAllocations}
                  skill={record.id}
                  levelId={record.panelSkillStandardLevelId}
                  leadId={leadId}
                  mileId={mileId}
                  crud={crud}
                  cmRate={desc.cmPercentage ?? 0}
                  history={this.props.history}
                  panelId={desc.panelId}
                  callBack={this.callBack}
                  ceil={{
                    short: record.panelSkillStandardLevel?.shortTermCeil,
                    long: record.panelSkillStandardLevel?.longTermCeil,
                  }}
                  permissions={permissions}
                />
              );
            },
            // rowExpandable: record => record.user.length > 0,
          }}
        />
        {openSearch && (
          <TableModalFilter
            title={'Filter Resources'}
            visible={openSearch}
            filters={searchedColumn}
            filterFields={filterFields}
            filterFunction={this.advancefilter}
            effectFunction={this.filterModalUseEffect}
            effectRender={true}
            onClose={() => this.setState({ openSearch: false })}
          />
        )}
        {infoModal && (
          <ResModal
            visible={infoModal}
            editRex={editRex}
            skillId={skillId}
            levelId={levelId}
            leadId={leadId}
            cmRate={desc.cmPercentage ?? 0}
            mileId={mileId}
            pDates={pDates}
            crud={crud}
            panelId={desc.panelId}
            close={this.closeModal}
            callBack={this.callBack}
            ceil={ceil}
          />
        )}
      </>
    );
  }
}

function NestedTable(props) {
  const [data, setData] = useState(props.data);
  const [visible, setVisible] = useState(false);
  const [editRex, setEditRex] = useState(false);
  // const [selectedRowKeys, setSelectedRowKeys] = useState(props.data ? [props.data.findIndex(el => el.isMarkedAsSelected === true)]: [])
  const [selectedRowKeys, setSelectedRowKeys] = useState(
    props.data //checking data
      ? props.data.length === 1 //checking if data length is one
        ? [props.data[0].id] // this must be selected
        : // console.log(props.data)
        props.data.findIndex((el) => el.isMarkedAsSelected === true) !== -1 // otherwise check if anyone is selected
        ? [props.data[props.data.findIndex((el) => el.isMarkedAsSelected)].id] // get the selected resource
        : []
      : []
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      render: (record) => record && `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Buy Rate (Hourly)',
      dataIndex: 'buyingRate',
      key: 'buyingRate',
      render: (record) => `${formatCurrency(record)}`,
    },
    {
      title: 'Sell Rate (Hourly)',
      dataIndex: 'sellingRate',
      key: 'sellingRate',
      render: (record) => `${formatCurrency(record)}`,
    },
    // { title: 'Billable Hours', dataIndex: 'hours', key: 'hours' },
    {
      title: '...',
      key: 'action',
      align: 'center',
      width: '1%',
      render: (text, record, index) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="delete"
                danger
                disabled={!props?.permissions?.['DELETE']}
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to delete"
                  onConfirm={() => handleDelete(record.id, index)}
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item
                key="update"
                onClick={() => {
                  setEditRex({ ...record, tableIndex: index });
                  setVisible(true);
                }}
                disabled={!props?.permissions?.['UPDATE']}
              >
                Edit Resource
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

  const handleDelete = (id, index) => {
    let { crud, history, skill } = props;
    crud += `/${skill}/allocations`;
    generalDelete(history, crud, id, index, data, false).then((res) => {
      if (res.success) {
        props.callBack();
      }
    });
  };

  const onSelectChange = (selected, Rows) => {
    const { leadId, skill, crud } = props;
    setSelectedRowKeys(selected);
    selectLeadSkillResource(crud, skill, Rows[0].id).then((res) => {
      console.log(res);
    });
    // [data.findIndex(el => el.isMarkedAsSelected === true)]
  };

  const callBack = (value) => {
    setVisible(false);
    // if (editRex){
    //     data[editRex.index] = value
    //     setData(data)
    // }else{
    props.callBack();
    // }
  };

  return (
    <div style={{ paddingRight: 20 }}>
      <Table
        bordered
        size="small"
        key={props.skill}
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={props.data}
        pagination={false}
        className="fs-small"
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
      {visible && (
        <ResModal
          visible={visible}
          editRex={editRex}
          cmRate={props.cmRate}
          skillId={props.skill}
          leadId={props.leadId}
          levelId={props.levelId}
          panelId={props.panelId}
          mileId={props.mileId}
          crud={props.crud}
          ceil={props.ceil}
          close={() => {
            setVisible(false);
          }}
          callBack={callBack}
        />
      )}
    </div>
  );
}

export default Resources;
