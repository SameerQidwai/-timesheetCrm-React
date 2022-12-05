import React, { Component } from 'react';
import {
  Typography,
  Row,
  Col,
  Popconfirm,
  Modal,
  Button,
  Table,
  Dropdown,
  Menu,
} from 'antd';
import {
  SettingOutlined,
  DownOutlined,
  PlusSquareOutlined,
  LoadingOutlined,
} from '@ant-design/icons'; //Icons
import Forms from '../../../components/Core/Forms/Form';

import {
  getList,
  addList,
  delLabel,
  editLabel,
} from '../../../service/expenseType-Apis';
import {
  tableSorter,
  tableTitleFilter,
} from '../../../components/Core/Table/TableFilter';

const { Title } = Typography;

class ExpenseTypes extends Component {
  constructor() {
    super();
    this.levelForm = React.createRef();
    this.columns = [
      {
        title: 'Expense Name',
        dataIndex: 'label',
        key: 'label',
        ...tableSorter('label', 'string'),
      },
      {
        title: 'Action',
        key: 'action',
        align: 'right',
        width: 115,
        render: (record, text) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="Edit"
                  onClick={() => this.getRecord(record, text)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item danger key="Delete" className="pop-confirm-menu">
                  <Popconfirm
                    title="Are you sure you want to delete ?"
                    onConfirm={() => this.handleDelete(record.id)}
                    okText="Yes"
                                      >
                    <div> Delete </div>
                  </Popconfirm>
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
      isVisible: false,
      newSkill: '',
      data: [],
      filterData: [],
      editLevel: false,
      loading: false,
      FormFields: {
        formId: 'level_form',
        FormCol: 20,
        FieldSpace: { xs: 12, sm: 16, md: 122 },
        // layout: { labelCol: { span: 8 } },
        FormLayout: 'inline',
        size: 'middle',
        fields: [
          {
            object: 'obj',
            fieldCol: 24,
            key: 'label',
            label: 'Name',
            labelAlign: 'right',
            type: 'Input',
            size: 'small',
          },
        ],
      },
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    getList().then((res) => {
      if (res.success) {
        this.setState({
          data: res.data,
          filterData: res.data,
          isVisible: false,
          editLevel: false,
          FormFields: {
            ...this.state.FormFields,
            initialValues: {},
          },
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

  submit = () => {
    this.levelForm.current.refs.level_form.submit();
  };

  Callback = (value) => {
    if (!this.state.editLevel) {
      this.addType(value.obj);
    } else {
      this.editRecord(value.obj);
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
    const obj = Object.assign({}, data);
    // console.log(obj);
    this.setState({
      FormFields: {
        ...this.state.FormFields,
        initialValues: { obj: obj },
      },
      editLevel: obj.id,
      isVisible: true,
    });
  };
  editRecord = (obj) => {
    this.setState({ loading: true });
    const { editLevel } = this.state;
    obj.id = editLevel;
    editLabel(obj).then((res) => {
      if (res) {
        this.getData();
      }
    });
  };

  generalFilter = (value) => {
    const { data } = this.state;
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          return (
            el.label && el.label.toLowerCase().includes(value.toLowerCase())
          );
        }),
      });
    } else {
      this.setState({
        filterData: data,
      });
    }
  };

  render() {
    const { data, isVisible, editLevel, FormFields, loading, filterData } =
      this.state;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={3}>Expense Types</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                this.setState({
                  isVisible: true, //Open Modal
                });
              }}
            >
              <PlusSquareOutlined /> Add Expense
            </Button>
          </Col>
        </Row>
        <Table
          title={() => tableTitleFilter(5, this.generalFilter)}
          bordered
          rowKey={(data) => data.id}
          columns={this.columns}
          dataSource={filterData}
          size="small"
          className="fs-small"
        />
        {isVisible && (
          <Modal
            title={editLevel ? 'Edit Expense' : 'Add Expense'}
            maskClosable={false}
            centered
            visible={isVisible}
            okText={'Save'}
            width={400}
            onCancel={() => {
              this.setState({
                isVisible: false, //close
                FormFields: {
                  ...FormFields,
                  initialValues: {},
                }, //delete Formfields on Close
              });
            }}
            onOk={() => {
              this.submit();
            }}
          >
            <Row justify="center">
              <Forms
                ref={this.levelForm}
                Callback={this.Callback}
                FormFields={FormFields}
              />
            </Row>
          </Modal>
        )}
      </>
    );
  }
}

export default ExpenseTypes;
