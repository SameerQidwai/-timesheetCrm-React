import React, {useEffect} from 'react'
import { Button, Col, Input, Modal, Row, Space, Table, Form, Select, Tag } from 'antd';
import FormItems from '../FormItems';
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { getStates } from '../../../service/constant-Apis';

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
                            {filters[el].type === 'Input' ?
                                <Input
                                    value={filters[el].value}
                                    size="small" 
                                    onChange={(e)=>{
                                        const {value} = e.target
                                        filterFunction(value, el)
                                    }} 
                                    maxLength={el==='gender' ? 1: 100}
                                    disabled={filters[el].disabled} 
                                /> 
                                :
                                filters[el].type === 'Select' &&
                                    <Select
                                        value={filters[el].value}
                                        options={filters[el].options}
                                        mode={filters[el].mode}
                                        size="small"
                                        maxTagCount= 'responsive'
                                        onChange={(value)=>{
                                            filterFunction(value, el)
                                        }}
                                        style={{width: '100%'}}
                                        // onChange={onChange}
                                    />
                                } 
                        </Table.Summary.Cell> )
                })}
        </Table.Summary.Row>
    </Table.Summary>
}
                                    //Input Length   //filterFunction
export const tableTitleFilter = (colSpan, filterFunction) =>{ // table filter on title //general filter
    return <Row justify="end" >
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

export const TableModalFilter = ({visible, onClose, filters, filterFunction, filterFields}) =>{
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
        onCancel={()=>onClose()}
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

export const Filtertag = ({filters, filterFunction}) =>{
    let filterKeys = Object.keys(filters)
    return <Col span={24}> 
        {filterKeys.map(el=>(
            filters[el].value.length>0 &&<>
                <Tag color="magenta" key={el}>{filters[el].label}: </Tag>
                {typeof(filters[el].value) === 'string' ?
                    <Tag 
                        key={`${el}value`}
                        color="lime" 
                        closable 
                        onClose={()=>filterFunction('', el)}
                    >{filters[el].value}</Tag> :
                    filters[el].value.map(value=> <Tag 
                        key={`${el}${value}`}
                        color="lime" 
                        closable 
                        onClose={()=>{
                            let remove = filters[el].value.filter(elem=> elem !== value)
                            filterFunction(remove, el)
                        }}
                    >{value}</Tag>)
                }
            </> 
        ))}
    </Col>
}


export const leaf = (obj, path) => (path.split('.').reduce((value, el) => value[el], obj))
