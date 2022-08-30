import React, { Component } from 'react';
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
  PlusSquareOutlined,
} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

import { getRecord, getMilestoneExpenses } from '../../service/projects';

import moment from 'moment';
import {
  formatDate,
  formatCurrency,
  localStore,
  formatPercent,
} from '../../service/constant';
import {
  Filtertags,
  TableModalFilter,
  tableSorter,
  tableTitleFilter,
} from '../../components/Core/Table/TableFilter';
import { generalDelete } from "../../service/delete-Api's";
import { getMilestone } from '../../service/Milestone-Apis';
import AuthError from '../../components/Core/AuthError';
import ExpenseModal from './Modals/ExpenseModal';
import { getListAlt as getExpenseList } from '../../service/expenseType-Apis';

const { Item } = Descriptions;

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'Expense',
        dataIndex: ['expenseType', 'label'],
        key: 'label',
        ...tableSorter('label', 'string'),
      },
      {
        title: 'Buy Rate',
        dataIndex: 'buyingRate',
        key: 'buyingRate',
        render: (record) => record && formatCurrency(record),
        ...tableSorter('buyingRate', 'number'),
      },
      {
        title: 'Sell Rate',
        dataIndex: 'sellingRate',
        key: 'sellingRate',
        render: (record) => record && formatCurrency(record),
        ...tableSorter('sellingRate', 'number'),
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
                  key="update"
                  onClick={() => this.openModal(record.id)}
                  disabled={!this?.state?.permissions?.['UPDATE']}
                >
                  Edit Expense
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
      proId: false,
      mileId: false,
      crud: false,
      proDesc: {},
      mileDesc: {},
      permissions: {},
      openSearch: false,
      filterData: [],
      searchedColumn: {
        label: {
          type: 'Select',
          multi: true,
          value: [],
          label: 'Expense',
          showInColumn: true,
        },
        buyingRate: { type: 'Input', value: '', label: 'Buy Rate' },
        sellingRate: { type: 'Input', value: '', label: 'Sell Rate' },
      },

      filterFields: [
        {
          Placeholder: 'Expense',
          fieldCol: 24,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 24,
          mode: 'multiple',
          key: 'label',
          customValue: (value, option) => option,
          size: 'small',
          data: [],
          type: 'Select',
          fieldStyle: { width: '50%' },
        },
        {
          Placeholder: 'Buy Rate',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Sell Rate',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'buyingRate',
          shape: '$',
          size: 'small',
          type: 'InputNumber',
          fieldStyle: { width: '100%' },
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'sellingRate',
          shape: '$',
          size: 'small',
          type: 'InputNumber',
          fieldStyle: { width: '100%' },
        },
      ],
      notAuth: false,
    };
  }

  componentDidMount = () => {
    this.fetchAll();
  };

  fetchAll = (id) => {
    const { OPPORTUNITIES } = JSON.parse(localStore().permissions);
    const { url } = this.props.match;
    const { proId, mileId } = this.props.match.params;
    Promise.all([getRecord(proId), getMilestoneExpenses(url, id)])
      .then((res) => {
        this.setState({
          proDesc: res[0]?.success ? res[0].data : {},
          mileDesc:
            res[0]?.success && res[0]?.data?.milestones
              ? res[0]?.data?.milestones.filter((el) => el.id == mileId)[0]
              : {},
          editRex: false,
          proId: proId,
          crud: url,
          mileId: mileId,
          infoModal: false,
          data: res[1]?.success ? res[1].data : [],
          filterData: res[1]?.success ? res[1].data : [],
          permissions: OPPORTUNITIES,
          notAuth: res?.[1]?.authError,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getMilestoneExpenses = (id) => {
    const { crud } = this.state;
    getMilestoneExpenses(crud).then((res) => {
      if (res.success) {
        this.setState({
          data: res.success ? res.data : [],
          filterData: res.success ? res.data : [],
          editRex: false,
          infoModal: false,
        });
      }
    });
  };

  openModal = (id) => {
    const { startDate, endDate } = this.state.mileDesc;
    this.setState({
      editRex: id,
      pDates: { startDate, endDate },
      infoModal: true,
    });
  };

  closeModal = () => {
    this.setState({ infoModal: false, editRex: false });
  };

  handleDelete = (id, index) => {
    const { crud, data, filterData } = this.state;
    const { history } = this.props;
    generalDelete(history, crud, id, index, filterData, data).then((res) => {
      console.log(id, index);
      if (res.success) {
        this.setState({
          data: [...res.data],
          filterData: [...res.filterData],
        });
      }
    });
  };

  callBack = () => {
    const { proId } = this.state;
    this.getMilestoneExpenses(proId);
  };

  generalFilter = (value) => {
    const { data } = this.state;
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          const { label } = el.expenseType;
          return (
            `${label ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
            (el.buyingRate &&
              formatCurrency(el.buyingRate)
                .toLowerCase()
                .includes(value.toLowerCase())) ||
            (el.sellingRate &&
              formatCurrency(el.sellingRate)
                .toLowerCase()
                .includes(value.toLowerCase()))
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
      search['label']['value'] ||
      search['buyingRate']['value'] ||
      search['sellingRate']['value']
    ) {
      this.setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search
          console.log('HELLLLLOOO', {
            label: el.expenseType.id,
            value: search['label']['value'],
          });
          return (
            (formatCurrency(el.buyingRate) ?? '')
              .toLowerCase()
              .includes(
                search['buyingRate']['value'].toString().toLowerCase()
              ) &&
            (formatCurrency(el.sellingRate) ?? '')
              .toLowerCase()
              .includes(
                search['sellingRate']['value'].toString().toLowerCase()
              ) &&
            // multi Select Search

            (search['label']['value'].length > 0
              ? search['label']['value']
              : [{ value: ',' }]
            ).some((s) =>
              (search['label']['value'].length > 0
                ? [el.expenseType.id]
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
    Promise.all([getExpenseList()])
      .then((res) => {
        const { filterFields } = this.state;
        filterFields[1].data = res[0].success ? res[0].data : [];
        this.setState({ filterFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const {
      proDesc,
      data,
      infoModal,
      editRex,
      proId,
      permissions,
      crud,
      mileId,
      filterData,
      openSearch,
      searchedColumn,
      filterFields,
      pDates,
      notAuth,
      mileDesc,
    } = this.state;
    return (
      <>
        <Descriptions
          title={'Project Details'}
          size="small"
          bordered
          layout="horizontal"
        >
          <Item label="Project Name">
            <Link
              to={{
                pathname: `/projects/${proDesc.id}/info`,
              }}
              className="nav-link"
            >
              {proDesc.title}
            </Link>
          </Item>
          <Item label="Estimated Value">
            {formatCurrency(proDesc.value ?? 0)}
          </Item>
          <Item label="Organisation">
            {proDesc.organization ? (
              <Link
                to={{
                  pathname: `/organizations/info/${proDesc.organizationId}`,
                }}
                className="nav-link"
              >
                {proDesc.organization.name}
              </Link>
            ) : (
              'No Organisation'
            )}
          </Item>
          <Item label="Start Date">
            {formatDate(proDesc.startDate, true, true)}{' '}
          </Item>
          <Item label="End Date">
            {formatDate(proDesc.endDate, true, true)}
          </Item>
        </Descriptions>
        {proDesc.type === 1 && (
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
            <Item label="Progress">{mileDesc.progress} %</Item>
            <Item label="Approved">
              {mileDesc.isApproved ? 'True' : 'False'}
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
              onClick={() => this.openModal(false)}
              //checking if project is close
              disabled={!permissions['ADD'] || proDesc.phase === false}
            >
              <PlusSquareOutlined /> Add Expense
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
          rowKey={(data) => data.id}
          columns={this.columns}
          dataSource={filterData}
          size="small"
          className="fs-small"
        />
        {openSearch && (
          <TableModalFilter
            title={'Filter Expenses'}
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
          <ExpenseModal
            visible={infoModal}
            editRex={editRex}
            proId={proId}
            crud={crud}
            cmRate={proDesc.cmPercentage}
            mileId={mileId}
            onHold={proDesc.phase === false} //checking if project is close
            close={this.closeModal}
            callBack={this.callBack}
          />
        )}
        {notAuth && <AuthError {...this.props} />}
      </>
    );
  }
}

export default Expenses;
