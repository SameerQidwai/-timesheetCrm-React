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
  DatePicker,
} from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  LoadingOutlined,
  FilterOutlined,
} from '@ant-design/icons'; //Icons

import Form from '../../../components/Core/Forms/Form';
import moment from 'moment';

import {
  holidayType,
  addList,
  getList,
  editLabel,
  delLabel,
} from '../../../service/calendar-holidays';
import { formatDate, localStore } from '../../../service/constant';
import {
  Filtertags,
  TableModalFilter,
  tableSorter,
  tableTitleFilter,
} from '../../../components/Core/Table/TableFilter';

const { Title } = Typography;

class CalendarHolidays extends Component {
  constructor(props) {
    super(props);
    this.holidayForm = React.createRef();
    this.columns = [
      {
        title: 'Title',
        dataIndex: 'label',
        key: 'label',
        ...tableSorter('label', 'string'),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (text, record) => formatDate(text, true, true),
        ...tableSorter('date', 'date'),
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 115,
        render: (text, record) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="Delete" danger className="pop-confirm-menu">
                  <Popconfirm
                    title="Are you sure you want to delete ?"
                    onConfirm={() => this.handleDelete(record.id)}
                    okText="Yes"
                                   >
                    <div> Delete </div>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item key="Edit" onClick={() => this.getRecord(record)}>
                  Edit
                </Menu.Item>
              </Menu>
            }
          >
            <Button size="small">
              <SettingOutlined /> Option <DownOutlined />
            </Button>
          </Dropdown>
        ),
      },
    ];

    this.state = {
      calendarId: false,
      data: [],
      filterData: [],
      openModal: false,

      editTimeoff: false,
      FormFields: {
        formId: 'form',
        justify: 'center',
        FormCol: 12,
        layout: { labelCol: { span: 6 } },
        justifyField: 'center',
        size: 'small',
        fields: [
          {
            object: 'obj',
            fieldCol: 24,
            key: 'holidayTypeId',
            label: 'Title',
            size: 'small',
            // rules:[{ required: true }],
            type: 'Select',
            data: [],
            labelAlign: 'right',
          },
          {
            object: 'obj',
            fieldCol: 24,
            key: 'date',
            label: 'Date',
            size: 'small',
            // rules:[{ required: true, message: 'Insert your Password Please' }],
            mode: 'date',
            type: 'DatePicker',
            labelAlign: 'right',
            fieldStyle: { width: '100%' },
            // hidden: false
          },
        ],
      },

      openSearch: false,
      searchedColumn: {
        label: { type: 'Input', value: '', label: 'label', showInColumn: true },
        date: { type: 'Date', value: null, label: 'Date', showInColumn: true },
      },

      filterFields: [
        {
          Placeholder: 'Title',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          Placeholder: 'Date',
          fieldCol: 12,
          size: 'small',
          type: 'Text',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'label',
          size: 'small',
          type: 'Input',
        },
        {
          object: 'obj',
          fieldCol: 12,
          key: 'date',
          size: 'small',
          type: 'RangePicker',
          fieldStyle: { width: '100%' },
        },
      ],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.getData(id);
  }

  getData = (id) => {
    getList(id).then((res) => {
      if (res.success) {
        this.setState({
          data: res.data,
          calendarId: id,
          filterData: res.data,
          openModal: false,
          editTimeoff: false,
          loading: false,
        });
      }
    });
  };

  handleDelete = (id) => {
    delLabel(id).then((res) => {
      if (res) {
        this.getData();
      }
    });
  };

  toggelModal = (status) => {
    if (status) {
      const { FormFields } = this.state;
      holidayType().then((res) => {
        if (res.success) {
          FormFields.fields[0].data = res.data;
          this.setState({
            FormFields,
            openModal: status,
          });
        }
      });
    } else {
      this.setState({ openModal: status, editTimeoff: false });
    }

    // this.holidayForm.current.refs.form.resetFields(); // to reset file
  };

  Callback = (vake) => {
    const { calendarId } = this.state;
    // this will work after I get the Object
    const obj = {
      calendarId: calendarId,
      holidayTypeId: vake?.obj.holidayTypeId,
      date: formatDate(vake?.obj.date, true),
    };
    if (!this.state.editTimeoff) {
      // to add new datas
      this.addType(obj);
    } else {
      this.editRecord(obj);
    }
  };
  addType = (value) => {
    this.setState({ loading: true });
    addList(value).then((res) => {
      if (res) {
        this.getData();
      }
    });
  };

  getRecord = (data) => {
    const vars = {
      id: data.id,
      holidayTypeId: data.holidayTypeId,
      date: formatDate(data.date),
    };
    this.setState(
      {
        FormFields: {
          ...this.state.FormFields,
          initialValues: { obj: vars },
        },
        editTimeoff: vars.id,
      },
      () => {
        this.toggelModal(true);
      }
    );
  };

  editRecord = (obj) => {
    const { editTimeoff } = this.state;
    this.setState({ loading: true });
    obj.id = editTimeoff;
    editLabel(obj).then((res) => {
      if (res) {
        this.getData();
      }
    });
  };

  submit = () => {
    this.holidayForm.current.refs.form.submit();
  };

  generalFilter = (value) => {
    const { data } = this.state;
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          return (
            (el.label &&
              el.label.toLowerCase().includes(value.toLowerCase())) ||
            (el.date &&
              formatDate(el.date, true, true)
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
    if (search['label']['value'] || search['date']['value']) {
      const date = search['date']['value'] ?? [null, null];
      this.setState({
        filterData: data.filter((el) => {
          // method one which have mutliple if condition for every multiple search
          return (
            `${el.label ?? ''}`
              .toLowerCase()
              .includes(search['label']['value'].toLowerCase()) &&
            //Start Date Filter
            moment(
              search['date']['value']
                ? moment(el.date).format('YYYY-MM-DD')
                : '2010-10-20'
            ).isBetween(
              date[0] ?? '2010-10-19',
              date[1] ?? '2010-10-25',
              undefined,
              '[]'
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

  render() {
    const {
      data,
      openModal,
      editTimeoff,
      FormFields,
      loading,
      filterData,
      openSearch,
      filterFields,
      searchedColumn,
    } = this.state;
    const columns = this.columns;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={4}>Holidays</Title>
          </Col>
          <Col span="2">
            <DatePicker
              size="small"
              mode="year"
              picker="year"
              format="YYYY"
              defaultValue={moment(new Date())}
            />
          </Col>
          <Col style={{ textAlign: 'end' }} span="4">
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
                    this.toggelModal(true);
                  }}
                >
                  <PlusSquareOutlined /> Add Holiday
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
              columns={columns}
              dataSource={filterData}
              size="small"
              rowKey={(data) => data.id}
              className="fs-small"
            />
          </Col>
        </Row>

        {openSearch && (
          <TableModalFilter
            title={'Filter Holidays'}
            visible={openSearch}
            filters={searchedColumn}
            filterFields={filterFields}
            filterFunction={this.advancefilter}
            effectRender={false}
            onClose={() => this.setState({ openSearch: false })}
          />
        )}

        {openModal ? (
          <Modal
            title={editTimeoff ? 'Edit Holiday' : 'Add Holiday'}
            maskClosable={false}
            centered
            visible={openModal}
            onOk={() => {
              this.submit();
            }}
            onCancel={() => {
              this.toggelModal(false);
            }}
            okButtonProps={{ disabled: loading }}
            okText={loading ? <LoadingOutlined /> : 'Save'}
            width={500}
            bodyStyle={{ padding: '10px 0px 0px 0px' }}
          >
            <Row justify="center">
              <Form
                ref={this.holidayForm}
                Callback={this.Callback}
                FormFields={FormFields}
              />
            </Row>
          </Modal>
        ) : null}
      </>
    );
  }
}

export default CalendarHolidays;
