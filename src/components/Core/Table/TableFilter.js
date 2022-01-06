import React from 'react'
import { Button, Col, Input, Modal, Row, Space, Table } from 'antd';
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
                    return filters[el].showInColumn && (// filters[el].type === 'Input' &&
                        <Table.Summary.Cell index={el} key={el}>
                            <Input size="small" onChange={(e)=>filterFunction(e, el)} disabled={filters[el].type === 'none'} />
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

export const tableModalFilter = () =>{
    return <Modal>
        
    </Modal>
}

export const leaf = (obj, path) => (path.split('.').reduce((value, el) => value[el], obj))