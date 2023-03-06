import React, { Component } from 'react';
import {
  Row,
  Col,
  Menu,
  Button,
  Dropdown,
  Descriptions,
  Table,
  Tag,
  Progress,
  Popconfirm,
  Tooltip,
} from 'antd';
import { SettingOutlined, DownOutlined } from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

import AddScheduleModal from './Modals/AddScheduleModal';
import {
  formatDate,
  formatCurrency,
  localStore,
  R_STATUS,
  STATUS_COLOR,
} from '../../service/constant';
import { getSchedules, } from '../../service/projects';
import { getProjectDetail } from '../../service/Milestone-Apis';
import { generalDelete } from "../../service/delete-Api's";
import { tableSorter } from '../../components/Core/Table/TableFilter';
import { Tag_s } from '../../components/Core/Custom/Index';

const { Item } = Descriptions;

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infoModal: false,
      editMile: false,
      pDates: {},
      proId: false,
      desc: {
        title: '',
        organization: { name: '' },
        value: '',
        startDate: '',
        endDate: '',
      },
      permissions: {},
      columns: [
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
          key: 'endDate',
          render: (record) => formatDate(record, true, true),
          ...tableSorter('endDate', 'date'),
        },
        {
          title: 'Payment Date',
          dataIndex: 'paymentDate',
          key: 'paymentDate',
          render: (record) => formatDate(record, true, true),
          ...tableSorter('paymentDate', 'date'),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          align: 'center',
          render: (record) => record,
        },
        {
          title: 'Notes',
          dataIndex: 'notes',
          key: 'notes',
          align: 'right',
          render: (text) => (<Tooltip
              placement="top" 
              title={text}
              destroyTooltipOnHide
          >
              {`${text.substr(0,20)}${text.length>30 ?'\u2026':''}`}
          </Tooltip>),
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
                      okText="Yes"
                      cancelText="No"
                    >
                      <div> Delete </div>
                    </Popconfirm>
                  </Menu.Item>
                  <Menu.Item
                    key="edit"
                    onClick={() => {
                      this.openModal({ ...record, rowIndex: index });
                    }}
                    disabled={this.state && !this.state.permissions['UPDATE']}
                  >
                    Edit
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
      ],
    };
  }

  componentDidMount = () => {
    const { proId } = this.props.match.params;
    this.fetchAll(proId);
  };

  fetchAll = (id) => {
    const { proId } = this.props.match.params;
    const { PROJECTS, OPPORTUNITIES } = JSON.parse(localStore().permissions);
    let crud = this.props.match.url;
    crud = crud.split('/');
    crud = `${crud[1]}/${crud[2]}`;

    Promise.all([getProjectDetail(crud), getSchedules(proId)])
      .then((res) => {
        let { columns } = this.state;
        this.setState({
          desc: res[0].success && res[0].data,
          data: res[1].success && res[1].data,
          columns: [...columns],
          proId: id,
          permissions: PROJECTS,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  openModal = (editObj) => {
    const { startDate, endDate } = this.state.desc;
    this.setState({
      pDates: { startDate, endDate },
      editMile: editObj,
      infoModal: true,
    });
  };

  closeModal = () => {
    this.setState({ infoModal: false, editMile: false });
  };

  handleDelete = (id, index) => {
    const { data, proId } = this.state;
    const { history } = this.props;
    let customUrl = `/projects/${proId}/schedules`
    generalDelete(history, customUrl, id, index, data, false).then((res) => {
      if (res.success) {
        this.setState({
          data: [...res.filterData],
        });
      }
    });
  };

  callBack = (milestone) => {
    const { editMile, data } = this.state;
    if (editMile) {
      data[editMile.rowIndex] = milestone;
    } else {
      data.push(milestone);
    }
    console.log(data)
    this.setState({
      data: [...data],
      infoModal: false,
      editMile: false
    });
  };

  render() {
    const { desc, data, infoModal, editMile, proId, permissions, columns, pDates } = this.state;
    return (
      <>
        <Descriptions
          title={'Project Details'}
          size="small"
          bordered
          layout="horizontal"
          // extra={<Button type="primary">Edit</Button>}
        >
          <Item label="Title">
            <Link
              to={{
                pathname: `/projects/${desc.id}/info`,
              }}
              className="nav-link"
            >
              {desc.title}
            </Link>
          </Item>
          <Item label="Value">{formatCurrency(desc.value)}</Item>
          <Item label="Start Date">
            {formatDate(desc.startDate, true, true)}
          </Item>
          <Item label="End Date">{formatDate(desc.endDate, true, true)}</Item>
          <Item label="Status">
            {
              <Tag_s
                text={`${desc?.phase}`}
                objName="O_PHASE"
                colorName="O_PHASE_COLORS"
              />
            }
          </Item>
          {/* <Item label="Gender">{data.gender}</Item> */}
        </Descriptions>
        <Row justify="end">
          <Col>
            <Button
              type="primary"
              size="small"
              onClick={() => this.openModal(false)}
              //checking if project is close
              disabled={!permissions['ADD'] || desc?.phase === false}
            >
              Add Schedule
            </Button>
          </Col>
          {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
        </Row>
        <Table
          bordered
          pagination={{ pageSize: localStore().pageSize }}
          rowKey={(data) => data.id}
          columns={columns}
          dataSource={data}
          size="small"
          className="fs-small"
        />
        {infoModal && (
          <AddScheduleModal
            visible={infoModal}
            editMile={editMile}
            accountedAmount={()=>{
              let pAmount = parseFloat(desc.value)
              data.forEach(el=>{
                if (editMile?.id !== el.id){
                  pAmount -= parseFloat(el.amount)
                }
              })
              return pAmount
            }}
            onHold={desc?.phase === false} //checking if project is close
            pDates={pDates}
            proId={proId}
            close={this.closeModal}
            callBack={this.callBack}
          />
        )}
      </>
    );
  }
}

export default Schedule;
