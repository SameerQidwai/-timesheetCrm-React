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
} from 'antd';
import { SettingOutlined, DownOutlined } from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

import MileModal from './Modal/MileModal';
import { formatDate, formatCurrency, localStore, R_STATUS, STATUS_COLOR, dateClosed } from '../../service/constant';
import { getMilestones, getProjectDetail } from '../../service/Milestone-Apis';
import { getRecord } from '../../service/opportunities';
import { generalDelete } from "../../service/delete-Api's";
import { tableSorter } from '../../components/Core/Table/TableFilter';
import { Tag_s } from '../../components/Core/Custom/Index';

const { Item } = Descriptions;

class Milestone extends Component {
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
      customUrl: 'opportunity',
      columns: [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text, record) => (
            <Link
              to={{
                pathname: `milestones/${record.id}/resources`,
              }}
              className="nav-link"
            >
              {text}
            </Link>
          ),
          ...tableSorter('title', 'string'),
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
          key: 'endDate',
          render: (record) => formatDate(record, true, true),
          ...tableSorter('endDate', 'date'),
        },
        {
          title: 'Progress',
          dataIndex: 'progress',
          key: 'progress',
          align: 'center',
          render: (record) => <Progress percent={record} size="small" />,
        },
        {
          title: 'Approved',
          dataIndex: 'isApproved',
          key: 'isApproved',
          align: 'right',
          render: (text) => {
            let status = text?? 'CM'
              return <Tag_s text={status}/>
          },
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
                    disabled={!this?.state?.permissions?.['DELETE']|| this?.state?.disabledFY}
                    className="pop-confirm-menu"
                  >
                    <Popconfirm
                      title="Are you sure you want to delete ?"
                      onConfirm={() => this.handleDelete(record.id, index)}
                      okText="Yes"
                      cancelText="No"
                      disabled={!this?.state?.permissions?.['DELETE']|| this?.state?.disabledFY}
                    >
                      <div> Delete </div>
                    </Popconfirm>
                  </Menu.Item>
                  <Menu.Item
                    key="edit"
                    onClick={() => {
                      this.openModal({ ...record, rowIndex: index });
                    }}
                    disabled={!this?.state?.permissions['UPDATE']}
                  >
                    Edit Milestone
                  </Menu.Item>
                  <Menu.Item key="position">
                    <Link
                      to={{
                        pathname: `milestones/${record.id}/resources`,
                      }}
                      className="nav-link"
                    >
                      Positions
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="expense">
                    <Link
                      to={{
                        pathname: `milestones/${record.id}/expenses`,
                      }}
                      className="nav-link"
                    >
                      Expenses
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
      ],
    };
  }

  componentDidMount = () => {
    const { proId } = this.props.match.params;
    this.fetchAll(proId);
  };

  resRoute = (mileId) => {
    let splitted = this.props.match.url;
    splitted = splitted.split('/');
    return `/${splitted[1]}/${splitted[2]}/${splitted[3]}/${mileId}/resources`;
  };

  fetchAll = (id) => {
    const { PROJECTS, OPPORTUNITIES } = JSON.parse(localStore().permissions);
    const customUrl = this.props.match.url;
    let crud = this.props.match.url;
    crud = crud.split('/');
    let work = crud[1];
    crud = `${crud[1]}/${crud[2]}`;

    Promise.all([getProjectDetail(crud), getMilestones(customUrl)])
      .then((res) => {
        let { columns } = this.state;
        if (work === 'opportunities') {
          columns.splice(3, 2);
        }
        this.setState({
          desc: res[0].success && res[0].data,
          data: res[1].success && res[1].data,
          columns: [...columns],
          proId: id,
          customUrl,
          work,
          permissions: work === 'opportunities' ? OPPORTUNITIES : PROJECTS,
          disabledFY: work !== 'opportunities' && dateClosed(res[0]?.data?.startDate, res[0]?.data?.endDate)
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
    const { customUrl, data } = this.state;
    const { history } = this.props;
    generalDelete(history, customUrl, id, index, data, false).then((res) => {
      if (res.success) {
        this.setState({
          data: [...res.filterData],
        });
      }
    });
  };

  callBack = (milestone) => {
    const { proId, editMile, data } = this.state;
    if (editMile) {
      data[editMile.rowIndex] = milestone;
    } else {
      data.push(milestone);
    }

    this.setState({
      data: [...data],
      infoModal: false,
    });
  };

  render() {
    const { desc, data, infoModal, editMile, proId, permissions, columns, customUrl, pDates, work, disabledFY} = this.state;
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
            {formatDate(desc.startDate, true, true)}{' '}
          </Item>
          <Item label="End Date">{formatDate(desc.endDate, true, true)}</Item>
          <Item label="Bid Date">{formatDate(desc.bidDate, true, true)}</Item>
          {/* <Item label="Gender">{data.gender}</Item> */}
        </Descriptions>
        <Row justify="end">
          <Col>
            <Button
              type="primary"
              size="small"
              onClick={() => this.openModal(false)}
              //checking if project is close
              disabled={!permissions['ADD'] || desc?.phase === false || disabledFY}
            >
              Add Milestone
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
          <MileModal
            visible={infoModal}
            editMile={editMile}
            onHold={desc?.phase === false} //checking if project is close
            pDates={pDates}
            proId={proId}
            crud={customUrl}
            work={work}
            close={this.closeModal}
            callBack={this.callBack}
          />
        )}
      </>
    );
  }
}

export default Milestone;
