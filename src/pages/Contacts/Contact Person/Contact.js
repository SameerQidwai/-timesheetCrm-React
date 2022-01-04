import React, { Component } from "react";
import { Row, Col, Menu, Table, Modal, Button, Dropdown, Popconfirm, Typography, Input, Space, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined, UploadOutlined,  SearchOutlined} from "@ant-design/icons"; //Icons
// import { Link } from 'react-router-dom'

import InfoModal from "./InfoModal";
import { getList, delList } from "../../../service/conatct-person";
import { localStore } from "../../../service/constant";
import "../../styles/table.css";
import { tableFilter, tableSorter } from "../../../components/Core/Table/TableFilter";

const { Title } = Typography;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.contactForm = React.createRef();
        
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                render: (record) => `00${record}`,
                // sorter: (a, b) => a.id - b.id,
                ...tableSorter('id', 'number', true),
                // ...tableFilter('id', 'startsWith')
            },
            {
                title: "First Name",
                dataIndex: "firstName",
                key: "firstName",
                ...tableSorter('firstName', 'string'),
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Last Name",
                dataIndex: "lastName",
                key: "lastName",
                ...tableSorter('lastName', 'string'),
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Contact",
                dataIndex: "phoneNumber",
                key: "phoneNumber",
                // ...tableFilter('firstName', 'startsWith')
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.id)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item
                                    onClick={() => { this.setState({ openModal: true, editCP: record.id }); }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >Edit</Menu.Item>
                                {/* <Menu.Item> */}
                                    {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    {/* View */}
                                    {/* </Link> */}
                                {/* </Menu.Item> */}
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
            openModal: false,
            editCP: false,
            permissions: {},
            searchText: '',
            searchedColumn: '',
        };
    }

    componentDidMount = () =>{
        this.getData()
    }

    getData = () => {
        const { CONTACT_PERSONS }= JSON.parse(localStore().permissions)
        getList().then((res) => {
            console.log(res);
            if (res.success) {
                this.setState({
                    data: res.data,
                    openModal: false,
                    editCP: false,
                    permissions: CONTACT_PERSONS
                });
            }
        });
    };

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        this.setState({ openModal: status, editCP: false, });
    };

    Callback = () => {
        this.getData()
    };

    submit = () => {
        this.contactForm.current.refs.contact_form.submit();
    };

    render() {
        const {data, openModal, editCP, permissions} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contact Persons</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={12}>
                        <Row justify="end">
                            <Col>
                                <Button type="default" size="small">
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col offset={1}>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => { this.setState({ openModal: true, }); }}
                                    disabled={!permissions['ADD']}
                                >
                                    <PlusSquareOutlined />
                                    Contact Person
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
                            bordered
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={data}
                            size="small"
                        />
                    </Col>
                </Row>
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editCP={editCP}
                        close={this.toggelModal}
                        callBack={this.Callback}
                    />
                )}

            </>
        );
    }
}

export default Contact;
