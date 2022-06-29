import React, { Component } from "react";
import { Menu, Button, Dropdown,  Table, Tag} from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'
import { formatDate, formatCurrency, localStore } from "../../../service/constant";
import { tableSorter } from "../Table/TableFilter";
import { getHierarchy } from "../../../service/projects";

const milestoneColmuns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render:(text, record) => (
            <Link
                to={{
                    pathname:  `milestones/${record.id}/resources`,
                }}
                className="nav-link"
            >
                {text}
            </Link>
        ),
        ...tableSorter('title', 'string'),
    },
    {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        render: (record) =>(record && formatDate(record, true, true)),
        ...tableSorter('startDate', 'date'),
    },
    {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        render: (record) =>(record && formatDate(record, true, true)),
        ...tableSorter('endDate', 'date'),
    },
    {
        title: "Approved",
        dataIndex: "isApproved",
        key: "isApproved",
        align: "right",
        render: (record) =>  <Tag color={record? 'green': 'volcano'} key={record}>
            {record? 'TRUE': 'FALSE'}
        </Tag>
    },
    {
        title: "...",
        key: "action",
        align: "center",
        width: '1%',
        render: (value, record, index) => (
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item>
                            <Link
                                to={{
                                    pathname:  `milestones/${record.id}/resources`,
                                }}
                                className="nav-link"
                            >
                                Milestone
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
];

const positionColumns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        ...tableSorter('title', 'string'),
    },
    {
        title: "Skill",
        dataIndex: ["panelSkill", "label"],
        key: "panelSkill",
        ...tableSorter('panelSkill.label', 'string'),
    },
    {
        title: "Level",
        dataIndex: ["panelSkillStandardLevel", "levelLabel"],
        key: "panelSkillStandardLevel",
        ...tableSorter('panelSkillStandardLevel.levelLabel', 'string'),
    },
    {
        title: "Employee Name",
        dataIndex: "contactPerson",
        key: "contactPerson",
        render: (record)=>(
            `${record?.firstName?? ''} ${record?.lastName?? ''}`
        ),
        ...tableSorter('contactPerson.firstName', 'string'),
    },
    {
        title: "Billable Hours",
        dataIndex: "billableHours",
        key: "billableHours",
        sorter: (a, b) => a.billableHours - b.billableHours,
        ...tableSorter('billableHours', 'number'),
    },
    {
        title: "Buy Rate (Hourly)",
        dataIndex: "buyingRate",
        key: "buyingRate",
        render:(record)=>( record &&formatCurrency(record) ),
        ...tableSorter('buyingRate', 'number'),
    },
    {
        title: "Sell Rate (Hourly)",
        dataIndex: "sellingRate",
        key: "sellingRate",
        render:(record)=>( record && formatCurrency(record) ),
        ...tableSorter('sellingRate', 'number'),
    },
];


class PMResources extends Component {
    constructor() {
        super();

        this.state = {
            leadId: false,
            data: [],
            desc: {},
            skillId: false,
            levelId: false,
            resource: false,
            permissons: {ADD: true}
        };
    }

    componentDidMount = () => {
        const { id } = this.props
        getHierarchy(id).then(res=>{
            if (res){
                const {success, data } = res
                console.log(data);
                this.setState({
                    leadId: id, 
                    data: success ? data : []
                })
            }
        })
    }
    


    render() {
        const { desc, data, leadId, permissions} = this.state;
        return ( //will remove it in near future will be using NestedTable Function here as well 
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(record) => record.id}
                    columns={milestoneColmuns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                    expandable={{
                        rowExpandable: record => record?.opportunityResources?.length > 0,
                        expandedRowRender: record => {
                            return (
                            <NestedTable 
                                data={record.opportunityResources} 
                                columns={positionColumns}
                                expandable={true}
                                checked={false}
                            />)
                        },
                        // rowExpandable: record => record.user.length > 0,
                      }}
                />
        );
    }
}

function NestedTable({ columns, data }) {
    // const [data, setData] = useState(data);

    return <div style={{ paddingRight: 20}}> 
        <Table
            bordered
            size="small"
            className='fs-small'
            rowKey={(record) => record.allocationId} 
            columns={columns} 
            dataSource={data} 
            pagination={false}
        />
    </div>
};


export default PMResources;
