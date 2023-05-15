import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Row, Table } from 'antd'
import { formatDate, localStore } from '../../../../service/constant'
import { tableSorter } from '../../../../components/Core/Table/TableFilter'
import { getVariables } from '../../../../service/global-apis'
import { SettingOutlined } from '@ant-design/icons'

const GlobalVarsModal = ({ visible, onClose, callBack }) => {
  let [data, setData] = useState([])
  let [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    // getVariableData()
  }, [])

  return (
    <Modal
      title={visible === true ? 'Add Modal' : 'Edit Modal'}
      visible={visible}
      width={500}
      footer={null}
      onCancel={onClose}
    >
      
    </Modal>
  )
}

export default GlobalVarsModal