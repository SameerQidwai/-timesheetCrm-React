import React from 'react'
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from "@ant-design/icons";

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

