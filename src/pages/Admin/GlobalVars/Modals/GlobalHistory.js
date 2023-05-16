import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Row, Table } from 'antd'
import { formatDate, localStore } from '../../../../service/constant'
import { tableSorter } from '../../../../components/Core/Table/TableFilter'
import { getVariables } from '../../../../service/global-apis'
import { SettingOutlined } from '@ant-design/icons'
import GlobalVarsModal from './GlobalVarsModal'

const GlobalHistory = ({ visible, onClose }) => {
  let [data, setData] = useState([])
  let [openModal, setOpenModal] = useState(false)
  let columns = [
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (record) => record && formatDate(record, true, true),
      ...tableSorter('startDate', 'date'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (record) => record && formatDate(record, true, true),
      ...tableSorter('endDate', 'date'),
    },    
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      ...tableSorter('value', 'number'),
    },    
    {
      title: '...',
      key: 'action',
      align: 'center',
      width: '1%',
      render: (text, record, index) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                onClick={() => {setOpenModal({...record, index})}}
              >
                Edit
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
  ]

  useEffect(() => {
    getVariableData()
  }, [])
  

  const getVariableData = () =>{
    getVariables(visible).then(res=>{
      if (res.success){
        setData(res.data)
      }
    })
  }
  
  

  const callBack = (value, index) =>{
    if(index){
      let temp = [...value]
      temp[index] = data
      setData([...temp])
    }else{
      setData([...data, value])
    }
  }

  return (
    <Modal
      title={visible + ' History'}
      visible={visible}
      width={800}
      footer={null}
      onCancel={onClose}
    >
      <Row justify="end" gutter={[0,20]}>
        <Col>
          <Button 
            type="primary"
            onClick={()=> setOpenModal(true)}
            >Add {visible}</Button></Col>
        <Col span={24}>
          <Table
            bordered
            pagination={{ pageSize: localStore().pageSize }}
            rowKey={(data) => data.id}
            columns={columns}
            dataSource={data}
            size="small"
            className="fs-small"
          />
        </Col>
      </Row>
      {openModal&&<GlobalVarsModal
        visible={openModal}
        onClose={()=>setOpenModal(false)}
        callBack={callBack}
      />}
    </Modal>
  )
}

export default GlobalHistory