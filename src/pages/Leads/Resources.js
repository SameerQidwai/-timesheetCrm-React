import React, { Component, useState } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import ResModal from "./Modals/ResModal";
import { getRecord, getResources, delResource } from "../../service/opportunities";

import moment from "moment"

const { Item } = Descriptions;

class Resource extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Skill",
                dataIndex: "panelSkill",
                key: "panelSkill",
                render: (record)=> {return record  && record.label}
            },
            {
                title: "Level",
                dataIndex: "panelSkillStandardLevel",
                key: "panelSkillStandardLevel",
                render: (record)=> {return record && record.levelLabel}
            },
            // {
            //     title: "Resource Name",
            //     dataIndex: "user",
            //     key: "user",
            //     render: (record)=> {return record &&
            //         <Link
            //                     to={{
            //                         pathname: `/Employees/info/${record.id}`,
            //                     }}
            //                     className="nav-link"
            //                 >
            //         {record.contactPersonOrganization && record.contactPersonOrganization.contactPerson && `${record.contactPersonOrganization.contactPerson.firstName} ${record.contactPersonOrganization.contactPerson.lastName}`}
            //         </Link>
            //     }
            // },
            {
                title: "Total Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
            // {
            //     title: "Buy Cost",
            //     dataIndex: "buyingRate",
            //     key: "buyingRate",
            // },
            // {
            //     title: "Sale Cost",
            //     dataIndex: "sellingRate",
            //     key: "sellingRate",
            // },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        console.log(record.id);
                                        this.setState({ infoModal: true, editRex: record.id, resource: false });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item 
                                    onClick={() => {
                                        console.log(record.id);
                                        this.setState({ infoModal: true, editRex: false, resource: true });
                                    }}
                                >
                                        Add
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
            infoModal: false,
            editRex: false,
            leadId: false,
            data: [],
            desc: {},
            resource: false
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getRecord(id), getResources(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                infoModal: false,
                leadId: id,
                data: res[1].success? res[1].data : [],
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getResources = (id) =>{
        getResources(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
                    editRex: false,
                    infoModal: false,
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { id } = this.props.match.params //opputunityId
        console.log(id);
        delResource(id, rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { leadId } = this.state
        console.log(leadId);
        this.getResources(leadId)
    };

    render() {
        const { desc, data, infoModal, editRex, leadId, resource } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="First Name">{desc.title}</Item>
                    <Item label="Last Name">{desc.value}</Item>
                    <Item label="Phone">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="Email">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    <Item label="Address">{desc.bidDate ? moment(desc.bidDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> 
                        <Button 
                            type="primary" 
                            size='small'  
                            onClick={() => { this.setState({ infoModal: true, editRex: false, resource: false }) }}>
                                Add New
                        </Button>
                    </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    rowKey={(record) => record.id}
                    columns={this.columns}
                    dataSource={data}
                    expandable={{
                        expandedRowRender: record => <NestedTable/>,
                        rowExpandable: record => record.user.length > 0,
                      }}
                    size="small"
                />
                {infoModal && (
                    <ResModal
                        visible={infoModal}
                        editRex={editRex}
                        leadId = {leadId}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                        resource={resource}
                    />
                )}
            </>
        );
    }
}


function NestedTable(key) {
    // const [data, setData] = useState(
    //     [
    //     {
    //         id: 0,
    //         code: '001',
    //         name: 'Ovias Ford',
    //         sale: 100,
    //         cost: 50,
    //         hours: 80,
    //         selected: true,
    //     },
    //     {
    //         id: 1,
    //         code: '002',
    //         name: 'Musab Cavil',
    //         sale: 200,
    //         cost: 50,
    //         hours: 100,
    //         selected: false,
    //     },
    //     {
    //         id: 2,
    //         code: '003',
    //         name: 'Noor Uddin',
    //         sale: 150,
    //         cost: 30,
    //         hours: 150,
    //         selected: false,
    //     },
    // ]
    // );
    const data = []
    for (let i = 0; i < 19; ++i) {
        data.push({
            id: i,
            code: '2014-12-24 23:12:00',
            name: 'Sameer Ahmed Qidwai',
            sale: 150,
            cost: 30,
            hours: 150,
        });
      }
    const [ visible, setVisible ] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([0])
    const columns = [
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Buy Cost', dataIndex: 'cost', key: 'cost' },
        { title: 'Billable Hours', dataIndex: 'hours', key: 'hours' },
        {
            title: "Action",
            key: "action",
            align: "right",
            render: (record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item danger>
                                <Popconfirm
                                    title="Sure to delete?"
                                    // onConfirm={() => this.handleDelete(record.id) }
                                >
                                    Delete
                                </Popconfirm>
                            </Menu.Item>
                            <Menu.Item
                                onClick={()=>{setVisible(true)}}
                            >
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

    const onSelectChange = (selected, Rows) =>  {
        console.log(selected, Rows)
        setSelectedRowKeys(selected)
    }

    return <div style={{padding: 10, paddingLeft: 20}}> 
        <Table
            key={key}
            rowKey={(record) => record.id} 
            columns={columns} 
            dataSource={data} 
            pagination={false}
            rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }}
        />
        <ResModal
            visible={visible}
            resource
            // editRex={editRex}
            // leadId = {leadId}
            // panelId = {desc.panelId}
            close={()=>{setVisible(false)}}
            // callBack={this.callBack}
        />
    </div>
};

export default Resource;
