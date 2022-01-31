import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom"; 

import { getRecord, getLeadSkills } from "../../../service/projects";

import moment from "moment"
import { formatCurrency, localStore } from "../../../service/constant";


class PTResources extends Component {
    constructor(props) {
        super(props);
        const { id } = props.match.params
        this.columns = [
            {
                title: "Skill",
                dataIndex: "panelSkill",
                key: "panelSkill",
                render: (record) =>(
                    record && record.label
                )
            },
            {
                title: "Level",
                dataIndex: "panelSkillStandardLevel",
                key: "panelSkillStandardLevel",
                render: (record)=>(
                    record && record.levelLabel
                )
            },
            {
                title: "Employee Name",
                dataIndex: "opportunityResourceAllocations",
                key: "opportunityResourceAllocations",
                render: (record)=>(
                    record && record[0] && record[0].contactPerson && `${record[0].contactPerson.firstName	} ${record[0].contactPerson.lastName	}`
                )
            },
            {
                title: "Billable Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
            {
                title: "Buy Cost",
                dataIndex: "opportunityResourceAllocations",
                key: "opportunityResourceAllocations",
                render:(record)=>(
                    // console.log(record)
                    record && record[0] && formatCurrency(record[0].buyingRate)
                )
            },
            {
                title: "Sale Cost",
                dataIndex: "opportunityResourceAllocations",
                key: "opportunityResourceAllocations",
                render:(record)=>(
                    record && record[0] &&  formatCurrency(record[0].sellingRate)
                )
            },
        ];

        this.state = {
            infoModal: false,
            editRex: false,
            ProId: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {}
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        Promise.all([ getRecord(id), getLeadSkills(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                ProId: id,
                infoModal: false,
                data: res[1].success? res[1].data : [],
                permissions: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }


    render() {
        const { data } = this.state;
        return (
            <Table
                bordered
                pagination={{pageSize: localStore().pageSize}}
                rowKey={(data) => data.id}
                columns={this.columns}
                dataSource={data}
                size="small"
            />
        );
    }
}

export default PTResources;
