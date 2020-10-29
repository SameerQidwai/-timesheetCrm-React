import React, { Component } from "react";

import { Row, Col, Table, Typography, Modal, Popconfirm } from "antd";
import { CloseCircleOutlined, EditFilled } from "@ant-design/icons"; //Icons
import Form from "../components/Form";
import moment from "moment";

const { Title } = Typography;
//inTable insert

class TimeSheet extends Component {
  constructor() {
    super();
    this.dynamoForm = React.createRef();
    this.columns = [
      {
        title: "Project",
        dataIndex: "project",
        key: "project",
        fixed: "left",
        width: 300,
        render: (value, record, dataIndex) => (
          <Row justify="space-between">
            <Col span={20}>{value}</Col>
            <Col span={3}>
              <Row justify="space-between">
                <Col>
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => this.delRow(dataIndex)}
                  >
                    <CloseCircleOutlined
                      style={{ color: "red", fontSize: "1.2em" }}
                    />
                  </Popconfirm>
                </Col>
                <Col>
                  <EditFilled style={{ color: "blue", fontSize: "1.2em" }} />
                </Col>
              </Row>
            </Col>
          </Row>
        ),
      },
    ];

    this.state = {
      isVisible: false,
      data: [
        {
          project: "Project 1",
          1: {
            start: "09:22",
            end: "22:02",
            break: "2",
          },
          2: {
            start: "10:00",
            end: "20:00",
            break: "4",
          },
          3: {
            start: "11:22",
            end: "13:11",
            break: "5",
          },
          4: {
            start: "16:20",
            end: "17:10",
            break: "18",
          },
          5: {
            start: "02:23",
            end: "14:23",
            break: "5",
          },
          6: {
            start: "15:05",
            end: "20:1",
            break: "1",
          },
        },
        {
          project: "Project 2",
          1: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          20: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          8: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          11: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          15: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          12: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
        },
        {
          project: "Project 3",
          1: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          21: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          18: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          10: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          1: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
          2: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
        },
        { project: "Project 4" },
        { project: "Project 5" },
        { project: "Project 6" },
        { project: "Project 7" },
        { project: "Project 8" },
        { project: "Project 9" },
        {
          project: "Project 10",
          31: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
        },
        {
          project: "Project 11",
        },
      ],

      FormFields: {
        formId: "time_form",
        justify: "center",
        FormCol: 24,
        FieldSpace: { xs: 12, sm: 16, md: 122 },
        // layout: { labelCol: { span: 8 } },
        // FormLayout:'inline',
        size: "middle",
        fields: [
          {
            object: "obj",
            filedCol: 15,
            // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
            key: "start",
            label: "Time",
            labelAlign: "right",
            type: "TimeRange",
            showTime: "hh:mm a",
          },
          {
            object: "obj",
            filedCol: 15,
            // labelCol: { span: 4 },
            key: "break",
            label: "Break",
            labelAlign: "right",
            type: "TimePicker",
            showTime: "HH",
          },
        ],
      },
    };
  }

  componentDidMount = () => {
    this.Columns();
  };

  Columns = () => {
    let date = new Date("2020/2/1").setDate(1);
    let month = new Date(date).getMonth();
    const monthChnage = month;

    while (month === monthChnage) {
      var day = new Date(date).toLocaleString("en-us", { weekday: "short" });
      var numDate = new Date(date).getDate();

      this.columns.push({
        title: this.columnTitle(day, month, numDate),
        dataIndex: `${numDate}`,
        key: `${numDate}`,
        width: 200,
        align: "center",
        render: (value, record, rowIndex, numDate) =>
          value ? (
            <Row
              style={{ border: "1px solid" }}
              onClick={() => console.log(value, rowIndex, numDate)}
            >
              <Col span={24}>Start Time: {value["start"]}</Col>
              <Col span={24}>End Time: {value["end"]}</Col>
              <Col span={24}>Break: {value["break"]}</Col>
            </Row>
          ) : null,
        onCell: (record, rowIndex) => ({
          record,
          onClick: (event) => {
            console.log("onClick", record, rowIndex, numDate);
            // this.getRecord(record, rowIndex);
          },
        }),
      });

      date = new Date(date).setDate(new Date(date).getDate() + 1);
      month = new Date(date).getMonth();
    }
  };

  columnTitle = (day, month, numDate) => {
    return (
      <>
        <div>{day}</div>
        <div>
          {month}/{numDate}
        </div>
      </>
    );
  };

  delRow(dataIndex) {
    const data = this.state.data.filter(function (obj, index) {
      return index != dataIndex;
    });

    this.setState({ data: data });
  }

  getRecord = (data, index, colkey) => {
    console.log(data, index, colkey);
    // this.setState({
    //   FormFields: {...this.state.FormFields, initialValues: {obj:data}},
    //   editTimeoff:data.key
    // })

    // this.toggelModal(true)
  };
  submit = () => {
    this.dynamoForm.current.refs.time_form.submit();
  };
  // getData = () => {};
  Callback = (value) => {
    console.log(value);
  };

  render() {
    return (
      <div>
        <Title>Time Offs</Title>
        <Table
          columns={this.columns}
          size="small"
          scroll={{ x: "calc(700px + 50%)", y: 1000 }}
          bordered
          dataSource={this.state.data}
        />
        <Modal
          title="Edit TimeSheet"
          centered
          visible={this.state.isVisible}
          okText="Save"
          width={640}
          pagination={false}
          onCancel={() => {
            this.setState({ isVisible: false });
          }}
          onOk={() => {
            this.submit();
          }}
        >
          <Row>
            <Form
              ref={this.dynamoForm}
              Callback={this.Callback}
              FormFields={this.state.FormFields}
              onCell={(record, rowIndex) => {
                return {
                  onClick: () => {
                    console.log("record", record, "rowIndex", rowIndex);
                    this.getRecord(record, rowIndex);
                  }, // click header row
                };
              }}
            />
          </Row>
        </Modal>
      </div>
    );
  }
}

export default TimeSheet;
