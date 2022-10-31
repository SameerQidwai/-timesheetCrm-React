import { Button, Col, DatePicker, Dropdown, Menu, Popconfirm, Row, Select, Table, Tag, Typography,Modal} from 'antd';
import { SettingOutlined, CheckCircleOutlined} from '@ant-design/icons'; //Icons
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

const ExpenseApproval = () => {

	// dummy text
	const data = [
		{
			id: '1',
			code: 'AR390',
			title: 'abc',
			project: {label: "defiti"},
			amount: 70,
			status: "Submitted",
			submittedAt: "12-05-2022"
	
		},
		{
			id: '2',
			code: 'AR391',
			title: 'def',
			project: {label: 'mongo'},
			amount: 89,
			status: "Rejected",
			submittedAt: "12-05-2022"
			},
		{
			id: '3',
			code: 'AR392',
			title: 'ghi',
			project: {label: "gifti"},
			amount: 70,
			status: "Submitted",
			submittedAt: "12-05-2022"
			},
		{
			id: '4',
			code: 'AR393',
			title: 'jkl',
			project: {label: 'mouse'},
			amount: 89,
			status: "Submitted",
			submittedAt: "12-05-2022"
			},
	];

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
			render: (text)=> `00${text}`, 
			...tableSorter('id', 'number'),
		
		},
		{
			title: 'Title',
			dataIndex: 'label',
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
			render: (text)=> <Tag_s text={text}/>,
			...tableSorter('status', 'string')
		},
		{
			title: 'Submitted At',
			dataIndex: 'submittedAt',
			align: 'center',
			render:(text)=>(formatDate(text, true, true)),
			...tableSorter('submittedAt', 'date')    
		},
		{
			title: 'Submitted By',
			dataIndex: 'submittedBy',
			align: 'center',
			...tableSorter('submittedBy', 'string')    
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
								key="delete"
								danger
								// disabled={!this?.state?.permissions?.['DELETE']}
								className="pop-confirm-menu"
							>
								<Popconfirm
									title="Are you sure you want to delete"
									// onConfirm={() => handleDelete(record.id, index)}
								>
									<div> Delete </div>
								</Popconfirm>
							</Menu.Item>
							<Menu.Item
								key="edit"
								onClick={() =>
									setOpenModal({...record,index,adminView : true})
								}
								// disabled={this.state && !this.state.permissions['UPDATE']}
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
		selectedRows,
		onChange: onSelectChange,
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

	const multiAction = (action)=> {
		const {data =[] } = selectedRows
		let length = data.length
		let content = <div>{ 
		  data.map(({label, projectName, projectType}, index) =>(
				<div key={index}>
					{label}{length -1 > index && ','  }  
				</div> 
			)) 
		}</div>
		const modal = Modal.confirm({
		  title: `Do you wish to ${action} Certificate${length >1 ? 's': ''} for`,
		  icon: <CheckCircleOutlined />,
		  content: content,
		  // okButtonProps: {danger: stage === 'unapprove'??true},
		  okText: 'Okay',
		  cancelText: 'Cancel',
		  onOk:()=>{
			//   this.actionTimeSheet(stage) 
			  OutcomeAction(action)
			  modal.destroy();
		  }
		});
	  }
	
	  const OutcomeAction = (action) =>{
		const {keys =[] } = selectedRows
		let obj={sheets: keys}
		expenseSheetActions(`/${action}Many`, obj).then(res=>{
			if (res.success){
				// data[index]['isApproved'] = true
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
			{/* <Row justify='space-between'>      
					<Col>                  
						<DatePicker
								// mode="month"
								// picker="month"
								// format="MMM-YYYY"
								value={startDate}
								onChange={(value)=>{
										setQueryRequest({...queryRequest,
												startDate: value && formatDate(value).startOf("month"),
												// endDate: value && formatDate(value).endOf("month") 
										}
										//   , () => {
										//     this.getData()
										// }
										)
								}}
						/>
					</Col>
					<Col>
						<DatePicker
								// mode="month"
								// picker="month"
								// format="MMM-YYYY"
								value={endDate}
								onChange={(value)=>{
									setQueryRequest({...queryRequest,
												// startDate: value && formatDate(value).startOf("month"),
												endDate: value && formatDate(value).endOf("month") 
										}
										//   , () => {
										//     this.getData()
										// }
										)
								}}
						/>
					</Col>
			</Row> */}
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