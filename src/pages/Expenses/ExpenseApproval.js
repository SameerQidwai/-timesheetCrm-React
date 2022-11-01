import { Button, Col, DatePicker, Dropdown, Menu, Popconfirm, Row, Select, Table, Tag, Typography,Modal, Form, Input, Tooltip} from 'antd';
import { SettingOutlined, CheckCircleOutlined, AuditOutlined} from '@ant-design/icons'; //Icons
import React, { useEffect, useState } from 'react'
import { getProjects } from '../../service/constant-Apis';
import { expenseSheetActions, getExpenseSheets } from '../../service/expenseSheet-Apis';
import { formatDate, localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
// import { expensesData as dummyExpensesData } from '../DummyData';
import ExpenseSheetModal from './Modals/ExpenseSheetModal';
import { tableSorter } from '../../components/Core/Table/TableFilter';
import {Tag_s} from '../../components/Core/Custom/Index';

const { Title } = Typography
const { RangePicker } = DatePicker
let modal = ""

const ExpenseApproval = () => {

	const [projects, setProjects] = useState([]);
	const [selectedRows, setSelectedRows] = useState({keys: [], data: []});
	const [expenseData, setExpenseData] = useState();
	const [openModal, setOpenModal] = useState(false);
	// const [adminView, setAdminView] = useState(false);
	// const [disableSubmit, setDisableSubmit] = useState(true);
	const [queryRequest, setQueryRequest] = useState({
		startDate: formatDate(new Date()).startOf("month"),
		endDate: formatDate(new Date()).endOf("month")});  
	const { startDate, endDate} = queryRequest

	const columns = [
    {
      title: 'Code',
      dataIndex: 'id',
      render: (text) => `00${text}`,
      ...tableSorter('id', 'number'),
    },
    {
      title: 'Title',
      dataIndex: 'label',
      render: (text, record) => (
        <span>
          {text}{' '}
          {record.notes && (
            <Tooltip title={record.notes} placement="top" destroyTooltipOnHide>
              <AuditOutlined />
            </Tooltip>
          )}
        </span>
      ),
      ...tableSorter('label', 'string'),
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      ...tableSorter('projectName', 'string'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'center',
      ...tableSorter('amount', 'number'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (text) => <Tag_s text={text} />,
      ...tableSorter('status', 'string'),
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      align: 'center',
      render: (text) => formatDate(text, true, true),
      ...tableSorter('submittedAt', 'date'),
    },
    {
      title: 'Submitted By',
      dataIndex: 'submittedBy',
      align: 'center',
      ...tableSorter('submittedBy', 'string'),
    },
    {
      title: '...',
      key: 'action',
      align: 'center',
      width: '1%',
      // width: '155',
      render: (value, record, index) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                onClick={() =>
                  setOpenModal({ ...record, index, adminView: true })
                }
                // disabled={this.state && !this.state.permissions['UPDATE']}
              >
                View
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
  ];

	const onSelectChange = (newSelectedRowKeys, selectedRow) => {
		let cantApprove = true, cantReject = true, cantUnapprove = true
		selectedRow.forEach(el =>{
			if (el.status === 'SB'){
				cantApprove = false
				cantReject = false
			}
			if(el.status === 'AP'){
				cantUnapprove = false
			}
		})
		setSelectedRows({keys:newSelectedRowKeys, data: selectedRow, cantReject, cantApprove, cantUnapprove});
	};
	
	const rowSelection = {
		selectedRows: selectedRows.keys,
		onChange: onSelectChange,
		preserveSelectedRowKeys: false,
   		getCheckboxProps: (record)=> ({disabled: ['AP', 'RJ', 'SV'].includes(record.status) })
	};

	// for get all project 
	const gettingProject = () => {
		getProjects().then((res) => {
			if (res.success) {
				setProjects(res.data); 
			}
				
		})
	}

	const gettingExpenseSheets = () => {
		getExpenseSheets().then((res) => {
			if (res.success) {
				console.log("res->", res.data)
				setExpenseData(res.data); 
			}
		})
	}

	// modals 
	const closeModal = () => {
		setOpenModal(false);
	}

	// for filter 
	useEffect(() => {
		gettingProject();
		gettingExpenseSheets();
	}, []);

	const multiAction = (stage)=> {
		const {data =[] } = selectedRows
		let length = data.length
		let content = <div>{ 
		  data.map(({label, projectName, projectType}, index) =>(
				<div key={index}>
					{label}{length -1 > index && ','  }  
				</div> 
			)) 
		}
		<div style={{margin: 10}}>
			<Form  id={'my-form' } onFinish={(values)=> onActionFinished(values, stage)} >
				<Form.Item noStyle name={'notes'} >
					<Input.TextArea
						placeholder="Enter Your Notes...."
						autoSize={{ minRows: 3, maxRows: 10 }}
						allowClear
					/>
					</Form.Item>
			</Form>
		</div>
	</div>

		modal = Modal.confirm({
		  title: `Do you wish to ${stage} listed sheet${length >1 ? 's': ''}`,
		  icon: <CheckCircleOutlined />,
		  content: content,
		  // okButtonProps: {danger: stage === 'unapprove'??true},
		  okText: 'Okay',
		  cancelText: 'Cancel',
		  okButtonProps: {danger: stage === 'reject'??true, htmlType: 'submit', form: 'my-form'  },
		  // onOk:()=>{
		  //   //   this.actionTimeSheet(stage) 
		  //     OutcomeAction()
		  //     modal.destroy();
		  // }
		});
	  }
	
	  const onActionFinished = (formValues, stage) =>{
		const {notes} = formValues
		OutcomeAction(stage, notes) 
		modal.destroy();
	  }
	
	  const OutcomeAction = (stage, actionNotes) =>{
		const {keys =[] } = selectedRows
		let obj={sheets: keys, notes: actionNotes }
		expenseSheetActions(`/${stage}Many`, obj).then(res=>{
			if (res.success){
				// data[index]['isApproved'] = true
				setSelectedRows({keys: [], data: []})
				gettingExpenseSheets()
			}
		})
	  }
	
	return (<>
		<Row justify='space-between'>
			<Col>
				<Title level={4}>Expense Approval</Title>
			</Col>
			<Col >
				<Select
					placeholder="Select Project"
					style={{ width: 300 }}
					allowClear
					options={projects}
					showSearch
					optionFilterProp={["label", "value"]}
					filterOption={
							(input, option) =>{
									const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
									const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
											return label || value
							}
					}
					onChange={(ind) => { console.log("need change") }}
				/>
			</Col>  
			<Col >
				<RangePicker />
			</Col>  
			<Col span={24}>
				<Table
					size={'small'}
					bordered
					className='fs-small'
					pagination={{pageSize: localStore().pageSize, hideOnSinglePage: true, responsive: true, size: 'small'}}
					rowKey={data=> data.id}
					rowSelection={rowSelection}
					columns={columns}
					dataSource={expenseData}
					// onChange={onChange} 
				/>
			</Col>
			<Col span={24} >
				<Row justify="end" gutter={[20,200]}>
					<Col >
						<Button 
							type="primary" 
							danger
							disabled={ (selectedRows?.cantReject || selectedRows['keys']?.length<1)}
							onClick={()=> multiAction('reject')}
						> 
							Reject
						</Button>
					</Col>
					<Col>
						<Button
							className={'success'}
							disabled={ (selectedRows?.cantApprove || selectedRows['keys']?.length<1)}
							onClick={()=> multiAction('approve')}
						>
							Approve
						</Button>
					</Col>
					<Col>
						<Button
							className={'success'}
							disabled={ (selectedRows?.cantUnapprove || selectedRows['keys']?.length<1	)}
							onClick={()=> multiAction('unApprove')}
						>
							Unapprove
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
			{openModal&&<ExpenseSheetModal
				visible={openModal}
				close={closeModal}
				adminView= {true}
				// callBack={callBack}
			/>}   
		</>
	)
}

export default ExpenseApproval