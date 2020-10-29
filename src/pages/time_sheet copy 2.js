import React, { Component } from "react";

import { Row, Col, Table, Typography, Popconfirm, Form, Input } from "antd";
import { CloseCircleOutlined, EditFilled } from "@ant-design/icons"; //Icons

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
            <Col span={20}>
              {record.edit ? (
                <Form.Item
                  style={{
                    margin: 0,
                  }}
                  name={dataIndex}
                >
                  <Input />
                </Form.Item>
              ) : (
                value
              )}
            </Col>
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
                  <EditFilled
                    onClick={() => {
                      this.editProject("project", dataIndex);
                    }}
                    style={{ color: "blue", fontSize: "1.2em" }}
                  />
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
          edit: false,
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
          edit: false,
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
        { project: "Project 4", edit: false },
        { project: "Project 5", edit: false },
        { project: "Project 6", edit: false },
        { project: "Project 7", edit: false },
        { project: "Project 8", edit: false },
        { project: "Project 9", edit: false },
        {
          project: "Project 10",
          edit: false,
          31: {
            start: "HH:MM",
            end: "HH:MM",
            break: "MM",
          },
        },
        {
          project: "Project 11",
          edit: false,
        },
      ],
    };
  }

  componentDidMount = () => {
    this.Columns();
  };

  Columns = () => {
    let month = 9;
    let date = new Date().setDate(1);
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
        render: (value, record, rowIndex) =>
          value ? (
            <Row style={{ border: "1px solid" }}>
              <Col span={24}>Start Time: {value["start"]}</Col>
              <Col span={24}>End Time: {value["end"]}</Col>
              <Col span={24}>Break: {value["break"]}</Col>
            </Row>
          ) : null,
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
  editProject(column, row) {
    console.log(column, row);
    let data = this.state.data;
    data.forEach((el, index) => {
      if (index === row) {
        el.edit = true;
      } else {
        el.edit = false;
      }
    });

    this.setState({
      data: data,
    });
  }

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
      </div>
    );
  }
}

export default TimeSheet;
