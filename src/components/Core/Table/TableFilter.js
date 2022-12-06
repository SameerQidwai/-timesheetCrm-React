import React, {useEffect, useState} from 'react'
import { Button, Col, Input, Modal, Row, Space, Table, Form, Select, Tag, DatePicker } from 'antd';
import FormItems from '../Forms/FormItems';
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { localStore } from '../../../service/constant';


//an idea for small data 
const ATable = ({size= 'small', title, columns=[], dataSource=[], rowKey='id', rowSelection=false, bordered=true, className= 'fs-small', style , pagination, rowClassName, ...rest})=>{
    let {
        current: pageNo =1,
        onChange: onPaginationChange = false,
        pageSize = localStore().pageSize,
        hideOnSinglePage = true,
        responsive: paginationResponsive = true,
        size: paginationSize = 'small',
        disabled: paginationDisabled = false,
    } = pagination ?? {};

    const [pageNoState, setpageNoState] = useState(pageNo);
    const [pageSizeState, setPageSizeState] = useState(pageSize);


    return <Table
    {...rest}
    title={title}
    size={size}
    bordered={bordered}
    className={className }
    rowClassName={rowClassName}
    style={style}
    pagination={
        {
            onChange:  (current, pageSize) =>{
                if (onPaginationChange){
                    onPaginationChange(current, pageSize)
                }else{
                    setpageNoState(current);
                    setPageSizeState(pageSize)
                }
            },
            current: pageNoState,
            pageSize: pageSizeState, 
            hideOnSinglePage, 
            responsive: paginationResponsive, 
            size: paginationSize,
            disabled: paginationDisabled
        }
    }
    rowKey={data=> data[rowKey]}
    rowSelection={rowSelection}
    columns={columns}
    dataSource={dataSource}
    // onChange={onChange} 
  />
}

                            //keys          //serachFunction
export const tableFilter = (dataIndex, searchFunction) => ({ // filter on the head
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => ( 
        <div style={{ padding: 8 }}>
            <Input
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
// export const tableSorter = (dataIndex, type, sortOrder) => ({ //sorter on the head
//     sorter: (a, b) => { 
//         let valueA = leaf(a, dataIndex)
//         let valueB = leaf(b, dataIndex) 
//         // if(valueA && valueB){
//             if(type=== 'number'){
//                 return valueA -  valueB 
//             }else if(type === 'string'){
//                 return `${valueA}`.localeCompare(`${valueB}`)
//             }else if (type === 'date'){
//                 return moment(valueA ? valueA :'2011 11 10' ).unix() - moment(valueB ? valueB : '2011 11 10').unix()
//             }
//         // }
//     },
//     defaultSortOrder: sortOrder && 'ascend' 
// })
                                    //filterObj    //filterFunction
export const tableSorter = (dataIndex, type, sortOrder, pin) => ({ //sorter on the head
    sorter: (a, b) => { 
        let valueA = leaf(a, dataIndex)
        let valueB = leaf(b, dataIndex) 
        valueA = (pin && valueA === pin) ? 'AA' : valueA
        valueB = (pin && valueB === pin) ? 'AA' : valueB
        // if(valueA && valueB){
            if(type=== 'number'){
                return valueA -  valueB 
            }else if(type === 'string'){
                return `${valueA}`.localeCompare(`${valueB}`)
            }else if (type === 'date'){
                return moment(valueA ? valueA :'2011 11 10' ).unix() - moment(valueB ? valueB : '2011 11 10').unix()
            }
        // }
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
                                    disabled={filters[el].disabled} 
                                /> 
                                :
                                filters[el].type === 'Select' ?
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
                                    />:
                                    filters[el].type === 'Date' &&
                                    <DatePicker
                                        value={filters[el].value}
                                        // picker={mode}
                                        size="small"
                                        style={{width: '100%'}}
                                        format={'ddd DD MMM yyyy'} //donot change yet
                                        disabled={filters[el].disabled} 
                                        onChange={(value)=>{
                                            console.log(value);
                                            filterFunction(value?? '', el)
                                        }}
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
                    placeholder='Search Table'
                    enterButton
                    size="small"
                    onChange={(e)=>{
                        const { value } = e.target
                        filterFunction(value)
                    }}
                    onPressEnter = {(e) =>{
                        const { value } = e.target
                        filterFunction(value)
                    }}
                    allowClear
                />
            </Col>
        </Row>
}

export const TableModalFilter = ({title, visible, onClose, filters, filterFunction, filterFields, effectRender, effectFunction}) =>{
    const [form] = Form.useForm();

    useEffect(() => {
        let obj = {}
        if(effectRender){
            effectFunction()
        }
        for (let el in filters) {
            if (filters[el].type === 'Date'){
                const rangeValue = filters[el].value 
                obj[el] = rangeValue &&[moment(rangeValue[0]), moment(rangeValue[1])]
            }else{
                obj[el] = filters[el].value  ?? ''
            }
        }
        form.setFieldsValue({obj});
        
    }, [])

    const onFinish = (values) =>{
        values = values.obj
        for (let el in filters) {
            if (filters[el].type === 'Date'){
                const rangeValue = values[el]
                filters[el].value = rangeValue&&[rangeValue[0]?.format('YYYY-MM-DD'), rangeValue[1]?.format('YYYY-MM-DD')]
            }else{
                filters[el].value = values[el] ?? ''
            }
        }
                //single value/name   //value+name
        filterFunction(false, false, filters)
    }

    return <Modal
        title={title}
        maskClosable={false}
        centered
        width={750}
        visible={visible}
        destroyOnClose
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

export const Filtertags = ({filters, filterFunction}) =>{
    let filterKeys = Object.keys(filters)
    const [state, setState] = useState({});
    useEffect(() => {
        return () => {
          setState({}); // This worked for me
        };
    }, []);
    return <Col span={24}> 
        {filterKeys.map(el=>(
            filters[el].value && filters[el].value.length>0 &&<span key={el}>
                <Tag color="magenta" key={el}>{filters[el].label}: </Tag>
                {typeof(filters[el].value) === 'string' ?
                    <Tag 
                        key={`${el}value`}
                        color="lime" 
                        closable 
                        onClose={()=>filterFunction('', el)}
                    >{filters[el].value}</Tag> 
                    :   filters[el].type === 'Date' ?
                        <Tag 
                            key={filters[el].value[0]}
                            color="lime" 
                            closable 
                            onClose={()=>{
                                let remove = null
                                filterFunction(remove, el)
                            }}
                        >{`${filters[el].value[0]}=>${filters[el].value[1]}`}
                        </Tag>
                    : filters[el].multi ?
                    filters[el].value&&filters[el].value.map(value=> <Tag 
                        key={`${el}${value.value}`}
                        color="lime" 
                        closable 
                        onClose={()=>{
                            let remove = filters[el].value.filter(elem=> elem.value !== value.value)
                            filterFunction(remove, el)
                        }}
                    >{value.label}</Tag>) 
                    : filters[el].value&&filters[el].value.map(value=> <Tag 
                        key={`${el}${value}`}
                        color="lime" 
                        closable 
                        onClose={()=>{
                            let remove = filters[el].value.filter(elem=> elem !== value)
                            filterFunction(remove, el)
                        }}
                    >{value}</Tag>)
                }
            </span> 
        ))}
    </Col>
}

export const leaf = (obj, path) => (path.split('.').reduce((value, el) => value[el]?? '', obj))

export const FiltertagsNew = ({filters, filterFunction}) =>{ //should make it work to show in tags in future
    let filterKeys = Object.keys(filters)
    const [state, setState] = useState({});
    useEffect(() => {
        return () => {
          setState({}); // This worked for me
        };
    }, []);
    return <Col span={24}> 
        {filterKeys.map(el=>{
            const { value, label, type, multi } = filters[el]
            return value && value.length>0 &&<span key={el}>
                <Tag color="magenta" key={el}>{label}: </Tag>
                {
                    type === 'Date' ? //String field search Tag
                            <Tag 
                                key={value[0]}
                                color="lime" 
                                closable 
                                onClose={()=>{
                                    let remove = null
                                    filterFunction(remove, el)
                                }}
                            > {`${value[0]}=>${value[1]}`} </Tag>

                    :   type === 'Select' ?
                            multi ? value && value.map(elValue=> <Tag 
                                key={`${el}${elValue.value}`}
                                color="lime" 
                                closable 
                                onClose={()=>{
                                    let remove = value.filter(elem=> elem.value !== elValue.value)
                                    filterFunction(remove, el)
                                }}
                                >{elValue.label}</Tag>)
                            : <Tag 
                                key={`${el}${value.value}`}
                                color="lime" 
                                closable 
                                onClose={()=>{
                                    filterFunction({}, el)
                                }}
                            >{value.label}</Tag>
                    :  <Tag 
                            key={`${el}value`}
                            color="lime" 
                            closable 
                            onClose={()=>filterFunction('', el)}
                        >{value}</Tag>
                }
            </span> 
        })}
    </Col>
}

export default ATable