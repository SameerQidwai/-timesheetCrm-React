import React, { Component } from "react";
import { Table } from "antd";
import { Link, withRouter } from "react-router-dom";
import { getOrgRecord } from "../../../service/Organisations";
class ChildOrg extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (
                    <Link
                        to={{
                            pathname: `/organisations/info/${record.key}`,
                        }}
                        className="nav-link"
                    >
                        {text}
                    </Link>
                ),
            },
            {
                title: "Parent",
                dataIndex: "parent",
                key: "parent",
                render: (text, record) => (
                    <Link
                        to={{
                            pathname: `/organisations/info/${record.key}`,
                        }}
                        className="nav-link"
                    >
                        {text}
                    </Link>
                ),
            },
        ];
        this.state = {
            data: [
                // { key: 2, name: "Org-A", pKey: 1, parent: "One_LM" },
                // { key: 3, name: "Org-B", pKey: 2, parent: "Org-A" },
            ],
        };
    }
    componentDidMount = () => {
        console.log(this.props.id);
    };

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        window.location.reload(false);
        //call function to call data here
    }
    render() {
        const { data } = this.state;
        return <Table columns={this.columns} dataSource={data} size="small" />;
    }
}

export default withRouter(ChildOrg);
