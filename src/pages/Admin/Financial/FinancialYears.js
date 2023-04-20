import React, { useEffect, useState } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Row, Table, Typography } from "antd";
import { ExclamationCircleOutlined, SettingOutlined, PlusSquareOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons
// import { formatDate } from '../../service/constant';
import { localStore, formatDate } from '../../../service/constant';
import { closingFY, getAllFY } from '../../../service/financial-year-apis';
import FYModal from './Modals/FYModal';
import { tableSorter } from '../../../components/Core/Table/TableFilter';
import { Tag_s } from '../../../components/Core/Custom/Index';
import moment from 'moment'

const {Paragraph} = Typography


function FinancialYears(props) {
    // const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleConfirm, setVisibleConfirm] = useState(false)

    const columns = [
      {
          title: "Created AT",
          dataIndex: "createdby",
          key: "label",
          ...tableSorter('label', 'string')
      }, 
      {
          title: "Created By",
          dataIndex: "createdby",
          key: "label",
          ...tableSorter('label', 'string')
      }, 
      {
          title: "Name",
          dataIndex: "label",
          key: "label",
          ...tableSorter('label', 'string')
      }, 
      {
          title: "Start Date",
          dataIndex: "startDate",
          key: "startDate",
            render: (record) => formatDate(record, true, true),
          ...tableSorter('startDate', 'date')
      },
      {
          title: "End Date",
          dataIndex: "endDate",
          key: "endDate",
            render: (record) => formatDate(record, true, true),
          ...tableSorter('endDate', 'date')
      },
      {
          title: "Lock By",
          dataIndex: "lockBy",
          key: "LockBy",
          ...tableSorter('lockDate', 'string')
      },
      {
          title: "Locked",
          dataIndex: "closed",
          key: "closed",
            render: (record) => <Tag_s
            text={`${!record}`}
            objName="O_PHASE"
            colorName="O_PHASE_COLORS"
          />,
          // ...tableSorter('label', 'string')
      },
      {
          title: '...',
          key: 'action',
          align: 'center',
          width: '1%',
          render: (value, record, index) => (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="edit"
                  //   onClick={() => {
                  //     this.openModal({ ...record, rowIndex: index });
                  //   }}
                    disabled={true}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item key="Closing" onClick={()=>{onConfirm(record, index)}}>
                      Close
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
      getData()
    }, [])

    const getData = async() =>{
      let {success, data} = await getAllFY()
        if (success){
          setData(data)
        }
    }
    
    const onFYAdd = (newEntry) =>{
      setData([...data, newEntry])
      setVisibleModal(false)
    }

    const onConfirm = (record) => {
      let modal = Modal.confirm({
        title: <span>Do you wish to close <b>{moment(record.startDate).format()} - ${moment(record.endDate).format()}</b></span>,
        icon: <ExclamationCircleOutlined />,
        content: <span>
          <Paragraph>
              <ul><li>Leave Request Spanning Found</li></ul>
              Leave Requests spanning to next financial year would be broken down into two request,
              <Paragraph>
                <ul>Mustafa Syed</ul>
                <ul>Sameer Ahmed</ul>
              </Paragraph>
          </Paragraph>
          <Paragraph>
              <ul><li>Closing Projects</li></ul>
              <Paragraph>
                <ul> <li>Non-Project Hours</li></ul>
                <ul> <li>SA - Strategic Design / Business Process EL2</li></ul>
                <ul> <li>AHQ - CALL RFQTS 9335 BUSICT ERP Program Schedule Manager</li></ul>
                will be closed
              </Paragraph>
          </Paragraph>
          <Paragraph>
              <ul><li>Leave Balances</li></ul>
              <Paragraph>
                Leave Balanace will be closed for all employees
              </Paragraph>
          </Paragraph>
        </span>,
        // okButtonProps: { danger: stage === 'Delete' ?? true },
        okButtonProps: {
          htmlType: 'submit',
          form: 'my-form',
        },
        okText: 'Yes',
        cancelText: 'No',
        onOk: async() => {
          try{
            let {success, data} = await closingFY(record.id)
            console.log(data)
          }catch{
            modal.destroy();
          }
        },
        onCancel: () => {
          modal.destroy()
        },
      });
    };

    return (
      <Row justify="end" gutter={[0, 10]}>
        <Col>
          <Button 
            size="small" 
            type="primary"
            onClick={()=>setVisibleModal(true)}
          >Create FY</Button>
        </Col>
        <Col span={24}>
          <Table
              // title={()=>tableTitleFilter(5, this.generalFilter)}
              rowKey={(data) => data.id}
              bordered
              pagination={{pageSize: localStore().pageSize}}
              columns={columns}
              dataSource={data}
              size="small"
              className='fs-small'
          />
        </Col>
        {visibleModal&& <FYModal 
          visible={visibleModal}
          close={()=>setVisibleModal(false)}
          callBack={onFYAdd}
        />}
      </Row>
    )
}

export default FinancialYears
