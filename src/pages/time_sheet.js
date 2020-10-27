import React, { Component } from "react";

import { Row, Col, Table, notification, Typography } from "antd";
import { CloseCircleOutlined, EditFilled } from "@ant-design/icons"; //Icons
const { Title } = Typography;
class TimeSheet extends Component {
  constructor() {
    super();
    this.columns = [
      {
        title: "Project",
        dataIndex: "project",
        key: "project",
        fixed: "left",
        width: 300,
      },
    ];

    this.state = {
      data: [
        { project: "Project 1" },
        { project: "Project 2" },
        { project: "Project 3" },
        { project: "Project 4" },
        { project: "Project 5" },
        { project: "Project 6" },
        { project: "Project 7" },
        { project: "Project 8" },
        { project: "Project 9" },
        { project: "Project 10" },
        { project: "Project 11" },
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
        title: this.datecolumn(day, month, numDate),
        dataIndex: `${month}/${numDate}`,
        key: `${month}/${numDate}`,
        width: 200,
        align: "center",
      });

      date = new Date(date).setDate(new Date(date).getDate() + 1);
      month = new Date(date).getMonth();
    }
  };

  datecolumn = (day, month, numDate) => {
    return (
      <>
        <div>{day}</div>
        <div>
          {month}/{numDate}
        </div>
      </>
    );
  };

  openNotification = (type) => {
    notification.open({
      message: `${type} Button Clicked`,
      description:
        "This is the content of the notification. This is the content of the notification.",
    });
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
      </div>
    );
  }
}

export default TimeSheet;
