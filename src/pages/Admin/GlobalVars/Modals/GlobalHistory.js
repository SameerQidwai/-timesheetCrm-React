import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Row, Table } from 'antd'
import { formatDate, localStore } from '../../../../service/constant'
import { tableSorter } from '../../../../components/Core/Table/TableFilter'
import { getVariableValues } from '../../../../service/global-apis'
import { SettingOutlined } from '@ant-design/icons'
import GlobalVarsModal from './GlobalVarsModal'
import moment from 'moment'

const GlobalHistory = ({ visible, onClose }) => {
  let [data, setData] = useState([])
  let [openModal, setOpenModal] = useState(false)
  const [minStartDate, setMinStartDate] = useState(null)
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
    getVariableValues(visible).then(res=>{
      if (res.success){
        setMinStartDate(
          res.data?.length > 0 
          ? moment.max(res.data?.map(obj => moment(obj.endDate)))
          : null
        )
        setData(res.data)
      }
    })
  }
  
  

  const callBack = (value, index) =>{
    if(index>=0){
      let temp = [...data]
      temp[index] = value
      setData([...temp])
    }else{
      setData([...data, value])
    }
    setOpenModal(false)
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
        minDate={openModal===true?minStartDate:null}
        keyName={visible}
      />}
    </Modal>
  )
}

export default GlobalHistory