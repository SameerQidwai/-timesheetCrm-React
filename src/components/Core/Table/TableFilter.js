import React, {useEffect} from 'react'
import { Button, Col, Input, Modal, Row, Space, Table, Form } from 'antd';
import FormItems from '../FormItems';
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

                            //keys          //serachFunction
export const tableFilter = (dataIndex, searchFunction) => ({ // filter on the head
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => ( 
        <div style={{ padding: 8 }}>
            <Input
                // ref={node => {
                // this.searchInput = node;
                // }}
                placeholder={`Search Code`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() =>confirm()}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() =>confirm()}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button 
                    onClick={() => clearFilters()} 
                    size="small" style={{ width: 90 }}
                >
                    Reset
                </Button>
            </Space>
        </div>
    ),
    filterSearch: true,
    filterIcon: <SearchOutlined />,
    onFilter: (value, record) => {
        return searchFunction === 'startsWith' ? record[dataIndex].toString().toLowerCase().startsWith(value.toLowerCase())
            : searchFunction === 'includes' && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    },
})
                        // Keys      //dataType  //defaultSortOrder
export const tableSorter = (dataIndex, type, sortOrder) => ({ //sorter on the head
    sorter: (a, b) => { 
        let valueA = leaf(a, dataIndex)
        let valueB = leaf(b, dataIndex) 
        if(valueA && valueB){
            if(type=== 'number'){
                return valueA -  valueB 
            }else if(type === 'string'){
                return valueA.localeCompare(valueB)
            }else if (type === 'date'){
                return moment(valueA).unix() - moment(valueB).unix()
            }
        }
    },
    defaultSortOrder: sortOrder && 'ascend' 
})
                                    //filterObj    //filterFunction
export const tableSummaryFilter = (filters, filterFunction) =>{ // filter on footer
    let keys = Object.keys(filters)
        return <Table.Summary fixed="top">
        <Table.Summary.Row>
                {keys.map(el => {
                    return filters[el].showInColumn && (
                        <Table.Summary.Cell index={el} key={el}>
                            {/* {filters[el].type === 'Input' && */}
                            <Input
                                value={filters[el].value}
                                size="small" 
                                onChange={(e)=>{
                                    const {value} = e.target
                                    filterFunction(value, el)
                                }} 
                                maxLength={el==='gender' ? 1: 100}
                                disabled={filters[el].disabled} />
                                {/* } */}
                        </Table.Summary.Cell> )
                })}
        </Table.Summary.Row>
    </Table.Summary>
}
                                    //Input Length   //filterFunction
export const tableTitleFilter = (colSpan, filterFunction) =>{ // table filter on title //general filter
    return <Row>
            <Col span={colSpan} >
                <Input.Search
                    enterButton
                    size="small"
                    onChange={(e)=>{
                        const { value } = e.target
                        filterFunction(value)
                    }}
                    allowClear
                />
            </Col>
        </Row>
}

export const TableModalFilter = ({visible, onClose, filters, filterFunction}) =>{
    const [form] = Form.useForm();

    useEffect(() => {
        let basic = {}
        let keys = Object.keys(filters)
        keys.forEach(el => {
            basic[el] = filters[el].value  ?? ''
        });
        form.setFieldsValue({basic});
    }, [])

    const onFinish = (values) =>{
        values = values.basic
        let keys = Object.keys(filters)
        keys.forEach(el => {
            filters[el].value = values[el] ?? ''
        });
                //single value/name   //value+name
        filterFunction(false, false, filters)
    }

    return <Modal
        title={"Search Contact Persons"}
        maskClosable={false}
        centered
        visible={visible}
        onOk={() => { form.submit()}}
        // okButtonProps={{ disabled: loading }}
        // okText={loading ?<LoadingOutlined /> :"Save"}
        onCancel={()=>onClose()}
        // width={900}
    >
        <Form
            form={form}
            size="small"
            layout="inline"
            onFinish={onFinish}
        >
            <FormItems FormFields={filterFields} />
        </Form>
    </Modal>
}


const filterFields = [ //just here for fun will get shift to contact
    {
        Placeholder: "First Name",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        Placeholder: "Last Name",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        object: "basic",
        fieldCol: 12,
        key: "firstName",
        size: "small",
        type: "input",
        itemStyle: { marginBottom: 10 },
    },
    {
        object: "basic",
        fieldCol: 12,
        key: "lastName",
        size: "small",
        type: "input",
        itemStyle: { marginBottom: 10 },
    },
    {
        Placeholder: "Phone",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        Placeholder: "Email",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        object: "basic",
        fieldCol: 12,
        key: "phoneNumber",
        size: "small",
        type: "input",
        itemStyle: { marginBottom: 10 },
    },
    {
        object: "basic",
        fieldCol: 12,
        key: "email",
        size: "small",
        type: "input",
        itemStyle: { marginBottom: 10 },
    },
    {
        Placeholder: "Gender",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        Placeholder: "State",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        object: "basic",
        fieldCol: 12,
        key: "gender",
        size: "small",
        data: [
            { label: "Male", value: "M" },
            { label: "Female", value: "F" },
            { label: "Other", value: "O" },
        ],
        type: "Select",
        itemStyle: { marginBottom: 10 },
    },
    {
        object: "basic",
        fieldCol: 12,
        key: "stateId",
        size: "small",
        type: "Select",
        data: [],
        itemStyle: { marginBottom: 10 },
    },
    {
        Placeholder: "Address",
        fieldCol: 12,
        size: "small",
        type: "Text",
    },
    {
        object: "basic",
        fieldCol: 24,
        key: "address",
        size: "small",
        type: "Input",
        itemStyle: { marginBottom: 20 },
    },
]

export const leaf = (obj, path) => (path.split('.').reduce((value, el) => value[el], obj))
