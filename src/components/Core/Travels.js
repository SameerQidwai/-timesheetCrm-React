import React, { Component } from "react";
import {  Table } from "antd";
import moment from "moment";
import { localStore } from "../../service/constant";

class Travels extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: "key",
                key: "key",
                render: (record) => `00${record}`,
            },
            {
                title: "Employee/Contactor",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Client Name",
                dataIndex: "c_name",
                key: "c_name",
            },
            {
                title: "Project",
                dataIndex: "project",
                key: "project",
            },
            {
                title: "Departure Date",
                dataIndex: "d_Date",
                key: "d_Date",
            },
            {
                title: "Arrival Date",
                dataIndex: "a_date",
                key: "a_date",
            },
            {
                title: "Destination",
                dataIndex: "destination",
                key: "destination",
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
            },
        ];

        this.state = {
            flights: [
                {
                    key: 1,
                    name: "Shanzey",
                    c_name: "Andrew",
                    project: "Project A",
                    d_Date: moment().format("ddd MMM DD YYYY"),
                    a_date: moment("12-9-2020").format("ddd MMM DD YYYY"),
                    destination: "California",
                    status: "Closed",
                },
                {
                    key: 2,
                    name: "Shanzey",
                    c_name: "Schurlz",
                    project: "oneLm carpenter",
                    d_Date: moment("12-9-2020").format("ddd MMM DD YYYY"),
                    a_date: moment("1-9-2020").format("ddd MMM DD YYYY"),
                    destination: "California",
                    status: "Expense Submitted",
                },
                {
                    key: 3,
                    name: "Shanzey",
                    c_name: "Tabish",
                    project: "oneLm",
                    d_Date: moment("12-20-2020").format("ddd MMM DD YYYY"),
                    a_date: moment("1-9-2020").format("ddd MMM DD YYYY"),
                    destination: "California",
                    status: "Closed",
                },
            ],
        };
    }

    render() {
        const { flights } = this.state;
        return (
            <>
                <Table
                    pagination={{pageSize: localStore().pageSize}}
                    columns={this.columns}
                    dataSource={flights}
                    size="small"
                />
            </>
        );
    }
}

export default Travels;
