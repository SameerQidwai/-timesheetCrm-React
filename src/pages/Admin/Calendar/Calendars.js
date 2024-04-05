import React, { Component } from 'react';
import {
  Table,
  Menu,
  Dropdown,
  Button,
  Tag,
  Row,
  Col,
  Typography,
  Modal,
  Form
} from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  LoadingOutlined,
} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

// import Form from '../../../components/Core/Forms/Form';

import { getList, addList, editLabel } from '../../../service/calendar';
import { localStore } from '../../../service/constant';
import {
  tableSorter,
  tableTitleFilter,
} from '../../../components/Core/Table/TableFilter';
import FormItems from '../../../components/Core/Forms/FormItems';

const { Title } = Typography;

class Calendars extends Component {
  constructor(props) {
    super(props);

    this.calenderForm = React.createRef();

    this.columns = [
      {
        title: 'Title',
        dataIndex: 'label',
        key: 'label',
        ...tableSorter('label', 'string'),
      },
      {
        title: 'Default',
        dataIndex: 'isDefault',
        key: 'isDefault',
        align: 'right',
        render: (text) => (text ? 'Yes' : 'No'),
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        align: 'right',
        render: (isActive) => (
          <>
            {
              <Tag color={!isActive ? '#7d7b7b' : 'green'} key={isActive}>
                {isActive ? 'Enabled' : 'Disabled'}
              </Tag>
            }
          </>
        ),
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
                <Menu.Item onClick={() => this.getRecord(record, text)}>
                  Edit
                </Menu.Item>
                <Menu.Item>
                  <Link
                    to={{
                      pathname: `/admin/calendars/holidays/${record.id}`,
                    }}
                    className="nav-link"
                  >
                    Holidays
                  </Link>
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
      data: [],
      // calenderForm: React.createRef(),
      openModal: false,
      filterData: [],

      FormFields: [
        {
          Placeholder: 'Title',
          rangeMin: true,
          fieldCol: 4,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
        },
        {
          object: 'obj',
          fieldCol: 20,
          key: 'label',
          size: 'small',
          type: 'input',
          itemStyle: { marginBottom: 20 },
          rules: [
            {
              required: true,
              message: 'Title is required',
            },
          ],
        },
        {
          Placeholder: 'Status',
          fieldCol: 4,
          rangeMin: true,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: 'obj',
          fieldCol: 6,
          key: 'isActive',
          size: 'small',
          type: 'Switch',
          valuePropName: 'checked',
          // itemStyle: { marginBottom: 10 },
        },
        {
          Placeholder: 'Default',
          fieldCol: 4,
          rangeMin: true,
          size: 'small',
          type: 'Text',
          labelAlign: 'right',
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: 'obj',
          fieldCol: 6,
          key: 'isDefault',
          size: 'small',
          type: 'Switch',
          valuePropName: 'checked',
          // itemStyle: { marginBottom: 10 },
        },
      ],
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    //creating API's
    getList().then((res) => {
      if (res.success) {
        this.setState({
          data: res.data,
          filterData: res.data,
          openModal: false,
          editTimeoff: false,
          loading: false,
        });
      }
    });
  };

  toggelModal = (status) => {
    this.setState({ openModal: status });
  };

  Callback = (vake) => {
    // this will work after I get the Object from the form
    if (!this.state.editTimeoff) {
      this.addCal(vake.obj);
    } else {
      this.editRecord(vake.obj);
    }
  };

  addCal = (value) => {
    this.setState({ loading: true });
    addList(value).then((res) => {
      if (res) {
        this.getData();
      }
    });
  };

  getRecord = (data, text) => {
    this.setState(
      {
        editTimeoff: data.id,
        openModal: true,
      },
      () => {
        this.calenderForm.current.setFieldsValue({ obj: data });
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

  // submit = () => {
  //   this.state.calenderForm.current.refs.calenderId.submit();
  // };

  generalFilter = (value) => {
    const { data } = this.state;
    if (value) {
      this.setState({
        filterData: data.filter((el) => {
          return (
            (el.label &&
              el.label.toLowerCase().includes(value.toLowerCase())) ||
            `${el.isActive ? 'Enabled' : 'Disabled'}`
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

  render() {
    const {
      data,
      openModal,
      editTimeoff,
      loading,
      calenderForm,
      FormFields,
      filterData,
    } = this.state;
    const columns = this.columns;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={4}>Calendars</Title>
          </Col>
          <Col style={{ textAlign: 'end' }}>
            <Button
              type="primary"
              onClick={() => {
                this.toggelModal(true);
              }}
              size="small"
            >
              <PlusSquareOutlined />
              Add Calendar
            </Button>
          </Col>
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
        {openModal&&<Modal
          title={editTimeoff ? 'Edit Calendar' : 'Add Calendar'}
          maskClosable={false}
          centered
          destroyOnClose
          visible={openModal}
          okButtonProps={{
            disabled: loading,
            htmlType: 'submit',
            form: 'my-form',
          }}
          okText={loading ? <LoadingOutlined /> : 'Save'}
          onCancel={() => {
            this.toggelModal(false);
          }}
          width={600}
        >
          <Form
            id={'my-form'}
            ref={this.calenderForm}
            onFinish={this.Callback}
            scrollToFirstError={true}
            size="small"
            layout="inline"
          >
            <FormItems FormFields={FormFields} />
          </Form>
          {/* <Form
              ref={calenderForm}
              Callback={this.Callback}
              FormFields={FormFields}
            /> */}
        </Modal>}
      </>
    );
  }
}

export default Calendars;
