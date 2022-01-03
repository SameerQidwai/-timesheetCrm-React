import React from 'react'
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
                        //keys          //serachFunction
export const tableFilter = (dataIndex, searchFunction) => ({
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
                size="small" style={{ width: 90 }}>
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
export const tableSorter = (dataIndex, type, sortOrder) => ({
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

const leaf = (obj, path) => (path.split('.').reduce((value, el) => value[el], obj))