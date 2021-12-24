import React, { Component } from "react";
import { Row, Col, Table, Modal, Button, Select, Typography, Popconfirm, DatePicker, Space, Tag, Tooltip, message, Dropdown, Menu, } from "antd";
import { DownloadOutlined, SaveOutlined, LoadingOutlined, PlusCircleOutlined, MoreOutlined, DeleteOutlined, EditOutlined, 
    LeftOutlined, RightOutlined,ExclamationCircleOutlined, CheckCircleOutlined, PaperClipOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import TimeModal from "./Modals/TimeModal"
import AttachModal from "./Modals/AttachModal";
import {  getList, reviewTimeSheet, getUsers, deleteTime,  } from "../../service/timesheet"
import { getUserMilestones } from "../../service/constant-Apis";
import { localStore, Api, thumbUrl } from "../../service/constant";

import "../styles/table.css";
import "../styles/button.css";
import TimeSheetPDF from "./Modals/TimeSheetPDF";

const { Title, Link } = Typography;
//inTable insert

class TimeSheetContact extends Component {
    constructor() {
        super();

        this.state = {
            isVisible: false,
            proVisible: false,
            isAttach: false,
            sheetDates: {
                startDate: moment().startOf("month"), 
                endDate: moment().endOf("month"),
                cMonth: moment(),
                sWeek: moment()
            },
            timeObj: false,
            editTime: false,
            loading: false,
            eData: [],
            USERS:[],
            sUser: null,
            loginId: null,
            data: [ ],
            comments: null,
            sMilestone: {},
            permissions: {},
            canApprove: false,
            milestones: [],
            sTMilestones: {
                milestones: [],
                keys: []
            },
            columns : [
                {
                    title: "Project",
                    dataIndex: "project",
                    key: "project",
                    fixed: "left",
                    width: 300,
                    render: (value, record, index) => (
                        <Row gutter={[0, 10]} style={{height: 90}}>
                            <Col span={24}>
                                <Row justify="space-between">
                                    <Col span={21}> {record.projectType ===1 ? `${value} \n(${record.milestone})` : `${value}`} </Col>
                                    {/* File_name and paperclip to show under project is in comment section line 156*/}
                                     <Col style={{marginLeft: 'auto'}}> 
                                        <Tooltip 
                                            placement="top"
                                            title="Export"
                                            destroyTooltipOnHide
                                        >
                                            <DownloadOutlined onClick={()=>{this.exporPDF(record.milestoneEntryId, index)}}/>
                                        </Tooltip>
                                        {/* <Tooltip Commit
                                            placement="top"
                                            title="Upload"
                                            destroyTooltipOnHide
                                        >
                                            <SaveOutlined onClick={()=>{this.openAttachModal(record, index)} } style={{color: '#1890ff', marginLeft:10}}/>
                                        </Tooltip> */}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row justify="space-between">
                                    {record.attachment &&<Col span={18} >
                                        <Link
                                            href={`${Api}/files/${record.attachment.uid}`}
                                            download={record.attachment.name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <PaperClipOutlined /> {" "}
                                                <Tooltip 
                                                    placement="top" 
                                                    title={record.attachment.name}
                                                    destroyTooltipOnHide
                                                >
                                                    {`${record.attachment.name.substr(0,23)}${record.attachment.name.length>22 ?'\u2026':''}`}
                                                </Tooltip>
                                        </Link>
                                    </Col>}
                                    <Col  span={5} style={{marginLeft:'auto', marginRight:5}} >
                                        {record.status === 'SB' &&<Tag color="cyan"> Submitted </Tag>}
                                        {record.status === 'AP' &&<Tag color="green"> Approved </Tag>}
                                        {record.status === 'RJ' &&<Tag color="red"> Rejected </Tag>}
                                    </Col>
                                </Row>
                            </Col>
                            {/* {this.state && this.state.sUser === this.state.loginId && (record.status === 'SV' || record.status === 'RJ') ?<Col sapn={12}>
                                <Popconfirm
                                    title={`You want to submit ${value}'s timesheet?`}
                                    onConfirm={()=>{this.reviewTimeSheet(record.milestoneEntryId, 'submit', index, 'SB')}}
                                >
                                    <Button style={{backgroundColor: "#4CAF50"}} size="small" type="primary"> Submit </Button>
                                </Popconfirm>
                            </Col> : 
                            (record.status === 'SB' && (record.isManaged || this.state && this.state.canApprove)) &&
                            <Col sapn={12}>
                                <Space >
                                    <Popconfirm
                                        title={`You want to Approve ${value}'s timesheet?`}
                                        onConfirm={()=>{this.reviewTimeSheet(record.milestoneEntryId, 'approve', index, 'AP')}}
                                    >
                                        <Button style={{backgroundColor: "#4CAF50"}} size="small" type="primary"> Approve </Button>
                                    </Popconfirm>
                                    <Popconfirm
                                        title={`You want to Reject ${value}'s timesheet?`}
                                        onConfirm={()=>{this.reviewTimeSheet(record.milestoneEntryId, 'reject', index, 'RJ')}}
                                    >
                                        <Button danger  size="small" type="primary"> Reject </Button>
                                    </Popconfirm>
                                </Space>
                            </Col>} */}
                        </Row>
                    ),
                },
                {
                    title: "Total",
                    dataIndex: "totalHours",
                    key: "totalHours",
                    fixed: "left",
                    align: "center",
                    width: 100,
                    render: (value) => (value&& value.toFixed(2))
                }
            ]
        };
    }

    componentDidMount = () => {
        const { sWeek, startDate } = this.state.sheetDates
        console.log('%cpWeek','color:red;', sWeek.format());
        console.log( '%cstartDate','color:blue;', startDate.format());
        console.log('%cpWeek','color:green;', sWeek.isSameOrAfter(startDate))
        this.fetchAll()
        // this.columns()
    };

    fetchAll = () =>{
        getUsers().then(res => {
            let value = 0
            const { id, permissions } = localStore()
            const loginId = parseInt(id)
            const { TIMESHEETS } = JSON.parse(permissions)
        
            if(res.success && res.data.length>0){
                value = res.data.value
                res.data.forEach(el=>{
                    if(el.value === loginId){
                        value= el.value //selecting the login user from users array
                    }
                }) 
            }
        
            this.setState({
                USERS: res.success? res.data : [],
                sUser: value,
                canApprove: TIMESHEETS['APPROVAL'] && TIMESHEETS['APPROVAL']['ANY'],
                permissions: TIMESHEETS,
                loginId,
                // USERS: res[1].success? res[1].data : [],
            },()=>{
                this.columns()
                if(this.state.sUser){
                    this.getSheet()
                }
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    getProjects = (value) =>{
        getUserMilestones(value).then(res=>{
            if(res.success){
                this.setState({
                    milestones: res.data
                })
            }
        })

    }

    getSheet = () =>{ // get timesheet for the employee withe date 
        const { sUser, sheetDates } = this.state
        const { startDate, endDate } = sheetDates
        if(sUser){
            getList({userId: sUser, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY')}).then(res=>{
                if (res.success){
                    this.setState({
                        timesheet: res.data?? {},
                        data: res.data ? res.data.milestones ?? []: [],
                        sTMilestones: {
                            milestones: [],
                            keys: []
                        },
                    })
                }
            })
        }
        this.columns()
    }

    columns = () =>{ // create table column and add date as colmumn name for selected month
        const { sWeek, startDate, endDate } = this.state.sheetDates
        let { columns, sUser, loginId, permissions }  = this.state
        let date = undefined
        let key = undefined
        columns = [columns[0],columns[1]]
        const startWeek = moment(sWeek.format("YYYY-MM-DDTHH:mm:ss")).startOf('isoWeek')
        const endWeek = moment(sWeek.format("YYYY-MM-DDTHH:mm:ss")).endOf('isoWeek')
        let week = endWeek.diff(startWeek, 'days')

        for (let i = 0 ; i <= week; i++)  {
            date = date ?? moment(startWeek.format())
            columns.push({
                title: <span>
                    <div>{date.format('ddd')}</div>
                    <div> {date.format('DD MMM')} </div>
                </span>,
                heading: <span>{date.format('dddd - DD MM YYYY')}</span>,
                dateObj: moment(date.format()),
                dataIndex: date.format('D/M'),
                key: date.format('D/M'),
                className: (date.isBefore(startDate) || date.isAfter(endDate))&& 'prevDates-TMcell',
                width: 200,
                editable: true,
                align: "center",
                
            })
            date = date.add(1, 'days')
        }

        this.setState({columns},()=> { //insert data with conditional clickable Items => it weren't working 
            const columns = this.state.columns.map(col => { // when creating column onCell key is not render at that time and is async function so have to call it again 
                if (col.dataIndex === 'project' || col.dataIndex === 'totalHours'){
                    return col
                }
                return {
                  ...col,
                    render: (value, record, rowIndex) =>{
                        //checking delete permission   // only admin and loggedin user will see the menu icon
                        const canDelete = permissions && permissions['DELETE'] && permissions['DELETE']['ANY'] || sUser === loginId
                        const clickable = ((record.status === 'SV' || record.status === 'RJ' || !record.status)) && canDelete
                        if(value){ // I didn't put the conditon for column previos or next month because this column won't have any value for now
                            let breakHours = moment.duration(value["breakHours"],'hours')
                            breakHours = breakHours && moment(moment().hours(breakHours.hours()).minutes(breakHours.minutes())).format("HH:mm")

                            //if note is null hide the tooltip condistion
                        {return <Tooltip title={value['notes'] && `Note: ${value['notes'] }`} >
                            <Row style={{ border: "1px solid" }}>
                            <Col span={22}>Start Time: {value["startTime"]&& moment(value["startTime"], ["HH:mm"]).format("h:mm A")}</Col>
                            <Col span={2} >
                            {clickable &&<Dropdown
                                placement="bottomCenter" 
                                overlay={
                                    <Menu onClick={this.handleMenuClick}>
                                        <Menu.Item
                                            disabled={sUser !== loginId}
                                            key="Edit" 
                                            onClick={()=>{     //data //index    //col key      //Col heading to show on Modal
                                                this.getRecord(record,rowIndex, col.dataIndex, col.heading); // call function to save data in
                                            }}
                                        >
                                            <EditOutlined />
                                        </Menu.Item>
                                            <Menu.Item 
                                                key="delete"
                                                disabled={!permissions['DELETE']}
                                                onClick={()=>{
                                                    this.deleteRecord(value, rowIndex, col.dataIndex)
                                                }} 
                                            > 
                                                <DeleteOutlined />
                                            </Menu.Item>
                                    </Menu>
                                }  
                            >
                                <MoreOutlined  style={{ cursor:'pointer' }} />
                            </Dropdown>}
                            </Col>
                            <Col span={24}>End Time: {value["endTime"] && moment(value["endTime"], ["HH:mm"]).format("h:mm A")}</Col>
                            <Col span={24}>Break: {breakHours && breakHours}</Col>
                            <Col span={24}>Total Hours: {value["actualHours"] && value["actualHours"]}</Col>
                            </Row>
                        </Tooltip>}
                        }else { // to not show add button if column month doesn't match with  selected month
                            return clickable && col.dateObj.isSameOrAfter(startDate)  && col.dateObj.isSameOrBefore(endDate) &&
                                <PlusCircleOutlined 
                                style={{fontSize: 24, color: '#1890ff'}} 
                                onClick={()=>{     //data //index    //col key      //Col heading to show on Modal
                                    this.getRecord(record,rowIndex, col.dataIndex, col.heading); // call function to save data in
                                }}
                            />
                        }
                    },
                };
            })
            this.setState({ columns })
        })
    }

    deleteRecord = (value, row, col) =>{
        deleteTime(value.entryId).then (res =>{
            if(res.success){
                const { data }= this.state
                delete data[row][col]
                data[row]['totalHours'] = data[row]['totalHours'] - value.actualHours
                this.setState({
                    data: data,
                });
            }
        }) 
    }


    getRecord = (record, rowIndex, colKey,colTitle) => {
        // get record in dialog box for edit
        const timeObj= {
            milestoneEntryId: record.milestoneEntryId,
            milestoneId: record.milestoneId,
            milestone: record.milestone,
            row: rowIndex,
            col: colKey ,
            title: colTitle
        }
        if (record[colKey]) {
            let breakHours = record[colKey].breakHours
            var duration = moment.duration(breakHours, 'hours');
            let obj = {
                entryId: record[colKey].entryId,
                startTime: moment(record[colKey].startTime, "HH:mm")._isValid
                    ? moment(record[colKey].startTime, "HH:mm")
                    : null,
                endTime: moment(record[colKey].endTime, "HH:mm")._isValid
                    ? moment(record[colKey].endTime, "HH:mm")
                    : null,
                breakHours: duration && moment().hours(duration.hours()).minutes(duration.minutes()),
                notes: record[colKey].notes && record[colKey].notes,
            };
            this.setState({
                isVisible: true,
                editTime: obj,
                timeObj,
            });
        } else {
            this.setState({
                isVisible: true,
                editTime: false,
                timeObj,
            });
        }
    };

    delRow(dataIndex) {
        const data = this.state.data.filter(function (obj, index) {
            return index != dataIndex;
        });

        this.setState({ data: data });
    }

    callBack = (value, sum) => {
        // value = value.obj;
        const { data, timeObj }= this.state
        const { row, col } = timeObj

        value.entryId = value.id
        data[row]['milestoneEntryId'] =value.milestoneEntryId
        if (sum){
            data[row][col] = value // put here so the code don't bust if cell is not created
            data[row]['totalHours'] = (data[row]['totalHours']??0) + (value.actualHours ?? 0)
        }else{
            let oldHours = data[row][col].actualHours
            data[row][col] = value // put here so the code don't bust if cell is not created while adding
            data[row]['totalHours'] = (data[row]['totalHours']??0) + (value.actualHours ?? 0) - (oldHours?? oldHours)
        }
        this.setState({
            data: data,
            timeObj: false,
            isVisible: false,
            editTime: false
        });

    };

    reviewTimeSheet = (ids, stage, index, key) => {
        const { startDate, endDate } = this.state.sheetDates
        const { sUser } = this.state
        const query= { pEntryId: ids, userId: sUser, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
        reviewTimeSheet(query, stage).then(res=>{
            const { data } = this.state
            if(res.success && index>=0){
                data[index].status= key
                this.setState({
                    data,
                })
            }
        })
    };

    actionTimeSheet = (stage) => {
        const { startDate, endDate } = this.state.sheetDates
        const { keys } = this.state.sTMilestones
        const { sUser } = this.state
        const query= { userId: sUser, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
        const data = {milestoneEntries: keys}
        reviewTimeSheet(query, stage, data).then(res=>{
            const { data } = this.state
            this.getSheet()
        })
    };

    openAttachModal = (record, index) =>{
        const timeObj= {
            milestoneEntryId: record.milestoneEntryId,
            milestoneId: record.milestoneId,
            notes: record.notes,
            milestone: record.milestone,
            status: record.status,
            rowIndex: index
        }
        this.setState({ timeObj, isAttach: true })
    }

    // attachCallBack = (res) =>{ Commit
    //     const {data, timeObj } = this.state
    //     const {rowIndex} = timeObj
    //     data[rowIndex].notes = res.notes
    //     data[rowIndex].attachment = res.attachment
    //     this.setState({data, isAttach: false, editTime: false, timeObj: false})
    // }

    exporPDF = (entryId) =>{
        const keys = entryId ? [entryId] :this.state.sTimesheet.keys
        this.setState({
            eData: keys,
            isDownload: true
        })   
    }
    
    // notesCallBack = (response) =>{ COmmit
    //     const {timeObj, data} = this.state
    //     data[timeObj.rowIndex].notes = response.notes
    //     this.setState({
    //         data: data,
    //         timeObj: false,
    //         isAttach: false,
    //         editTime: false
    //     })
    // }
    
    summaryFooter = (data) =>{
        const { columns } = this.state
        const { startDate, endDate } = this.state.sheetDates
        if(data.length>0)
        return (
            <Table.Summary.Row >
                {/* //multiple select commented */}
                <Table.Summary.Cell  index={0}> </Table.Summary.Cell>  
                {columns.map(({key, dateObj}, kIndex)=>{
                    let value = 0
                    data.map((rowData, index) =>{ //calculation for total hours and actual hours for footer to show
                        if(key !== 'project' ){
                            if(key === 'totalHours'){
                                value += data[index]['totalHours'] ?? 0 
                            }else{
                                value += (rowData[key] ? rowData[key]['actualHours'] : 0)
                            }
                        }
                    })
                    //Title of the projct show column for title 
                    return key === 'project' ? <Table.Summary.Cell index={kIndex+1} key={kIndex+1}>
                        Total Work In A day  
                    </Table.Summary.Cell > 
                    : // show total and normal background if the column month is same as selected month or the key is totalHours of the month
                        (key === 'totalHours'|| (dateObj && dateObj.isSameOrAfter(startDate)  && dateObj.isSameOrBefore(endDate))) ? 
                        <Table.Summary.Cell 
                            index={kIndex+1}
                            key={kIndex+1}
                            align="center" 
                        >
                            {value && value.toFixed(2)}
                        </Table.Summary.Cell>
                        : // show background grey if the column month is NOT same as selected month
                            <Table.Summary.Cell 
                                index={kIndex+1} 
                                key={kIndex+1}
                                align='center'
                                className="prevDates-TMcell" 
                            >0</Table.Summary.Cell>
                })}
            </Table.Summary.Row>
        )
    }

    milestoneSelect = (selectedRowKeys, selectedRows)=>{
        this.setState({
            sTMilestones: {
                milestones: selectedRows,
                keys: selectedRowKeys
            }
        })
    }

    highlightRow(record) {
        // const { status } = record
        // if (status === 'SB'){
        //     return 'submitClass'
        // }else if(status === 'AP'){
        //     return 'approveClass'
        // }else if(status === 'RJ'){
        //     return 'rejectClass'        
        // }
    }

    multiAction = (stage)=> {
        const {milestones, keys } = this.state.sTMilestones
        const { cMonth } = this.state.sheetDates
        let content = ''
        milestones.forEach(({project}) => {
            content += `${project}, ` 
        })
        const modal = Modal.confirm({
          title: `${stage} Timesheet For the month of ${cMonth.format('MMM YYYY')}`,
          icon: stage=== 'Delete' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />,
          content: content,
          okButtonProps: {danger: stage === 'Delete'??true},
          okText: 'Okay',
          cancelText: 'Cancel',
          onOk:()=>{
              this.actionTimeSheet(stage) 
              modal.destroy();
          }
        });
    }

    render() {
        const { loading, data, isVisible, proVisible, columns, editTime, timeObj, sheetDates, milestones, sMilestone, isAttach, isDownload, eData, USERS, sUser, loginId, sTMilestones, permissions } = this.state
        // delete button disable condition
        const canDelete = sTMilestones.keys.length<1 && (sUser !== loginId  ||  permissions && permissions['DELETE'] && permissions['DELETE']['ANY'])
        const {sWeek, startDate, endDate } = this.state.sheetDates
        return (
            <>
                <Row >
                    <Col span={8}>
                        <Title>Timesheet</Title>
                    </Col>
                    <Col span={5}>
                        <Select
                            size="large"
                            placeholder="Select User"
                            options={USERS}
                            value={sUser}           
                            style={{ width: 200 }}
                            showSearch
                            optionFilterProp={["label", "value"]}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onSelect={(value, option)=>{
                                this.setState({
                                    sUser: value
                                },()=>{
                                    this.getSheet()
                                })
                            }}
                        />
                    </Col>
                    <Col span={5}>
                        <DatePicker
                            size="large"
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            onChange={(value)=>{
                                this.setState({
                                    sheetDates : { //set Date here
                                        cMonth: value ?? moment(),
                                        startDate: moment(value ?? moment()).startOf("month"),
                                        sWeek: moment(value ?? moment()).startOf("month"),
                                        endDate: moment(value ?? moment()).endOf("month")
                                    }
                                },()=>{

                                    this.getSheet()
                                })
                            }}
                            defaultValue={moment()}
                        />
                    </Col>
                    <Col style={{marginLeft:'auto'}}>
                        <Button
                            size="small"
                            type="primary"
                            disabled={sUser !== loginId}
                            onClick={() => {
                                this.getProjects(sUser)
                                this.setState({proVisible: true}) 
                            }}
                        >
                            Add Project
                        </Button>
                    </Col>
                </Row>
                <Row justify="end">
                        <Col>
                            <Button 
                                disabled={sWeek.isSame(startDate)}
                                onClick={()=>{
                                    const { sheetDates } = this.state
                                    const { sWeek, startDate } = this.state.sheetDates
                                    let pWeek = moment(sWeek.format())
                                    pWeek = moment(pWeek.subtract(7, 'days'))
                                    if(!sWeek.isSame(startDate)){ // will not run hook if sWeek and startDate is same
                                        this.setState({
                                            sheetDates:{
                                                ...sheetDates,  
                                                sWeek: pWeek.isSameOrAfter(startDate) ? pWeek : moment().startOf("month")
                                            }          //check if the date is right    //select calcyalte week   //else 1st of month
                                        },()=> this.columns())
                                    }
                                }}
                            > <LeftOutlined />
                            </Button>
                            <Button 
                                disabled={sWeek.isSame(endDate)}
                                onClick={()=>{
                                    const { sheetDates } = this.state
                                    const { sWeek, endDate } = this.state.sheetDates
                                    let nWeek = moment(sWeek.format())
                                    nWeek = moment(nWeek.add(7, 'days'))
                                    if(!sWeek.isSame(endDate)){ // will not run the hook if sWeek is same as endDate
                                        this.setState({
                                            sheetDates:{
                                                ...sheetDates,  
                                                sWeek: nWeek.isSameOrBefore(endDate) ? nWeek : moment().endOf("month")
                                            }         //check if the date is right    //select calcyalte week   //else 1st of month
                                        },()=> this.columns())
                                    }
                                }}
                            >  <RightOutlined />
                            </Button>
                        </Col>
                </Row>
                <Table
                    sticky
                    size="small"
                    style={{maxHeight: 'fit-content'}}
                    className="timeSheet-table"
                    rowSelection={{ //multiple select commented
                        onChange:(selectedRowKeys, selectedRows)=>{this.milestoneSelect(selectedRowKeys, selectedRows )},
                        getCheckboxProps: (record) => ({
                            disabled: record.status === 'SB' || record.status === 'AP' , // Column configuration not to be checked
                          })
                    }}
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "'max-content'",
                    }}
                    bordered
                    pagination={false}
                    rowKey={data=>data.milestoneEntryId}
                    // rowClassName={(record) => this.highlightRow(record)}
                    columns={columns}
                    dataSource={[...data]}
                    summary={ columnData => this.summaryFooter(columnData)}
                />
                <Row justify="end" gutter={[20,200]}>
                    <Col>
                        <Button 
                            className={'success'}
                            disabled={ sUser !== loginId || sTMilestones.keys.length<1}
                            onClick={()=> this.multiAction('Submit') }
                        >
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type="primary" 
                            danger
                            disabled={canDelete}
                            onClick={()=>this.multiAction('Delete')}
                        > 
                            Delete
                        </Button>
                    </Col>
                </Row>
                {isVisible && (
                    <TimeModal
                        visible={isVisible}
                        timeObj={timeObj}
                        editTime={editTime}
                        sheetDates={sheetDates}
                        user={sUser}
                        close={()=>this.setState({isVisible: false, editTime: false, timeObj: false})}
                        callBack={this.callBack}
                    />
                )}
                {/* {isAttach && ( Commit
                    <AttachModal
                        visible={isAttach}
                        timeObj={timeObj}
                        close={()=>this.setState({isAttach: false, editTime: false, timeObj: false})}
                        callBack={this.attachCallBack}
                    />
                )} */}
                {isDownload && (
                    <TimeSheetPDF
                        milestoneEntryId={eData}
                        close={()=>this.setState({isDownload: false})}
                    />
                )}
                {proVisible && (
                    <Modal
                        title="Add Project"
                        maskClosable={false}
                        centered
                        visible={proVisible}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Add"}
                        width={550}
                        onCancel={() => {
                            this.setState({ proVisible: false, sMilestone:{} });
                        }}
                        onOk={() => {
                            const { data, sMilestone } = this.state
                            const findMilestone = data.findIndex(el=>(el.milestoneId === sMilestone.value))
                            if(findMilestone >=0){
                                message.error({ content: 'Project TimeSheet is already created...!'}, 5)
                            }else{
                                data.push({
                                    milestoneId: sMilestone.value,
                                    project: sMilestone.label,
                                })
                            }
                            this.setState({ proVisible: false, data: [...data], sMilestone:{} });
                        }}
                    >
                        <Row justify="center">
                            <Col span={22}>
                                <Select
                                    placeholder="Select Project"
                                    style={{ width: '100%' }}
                                    options={milestones}
                                    value={sMilestone.value}
                                    showSearch     
                                    optionFilterProp={["label", "value"]}
                                    filterOption={
                                        (input, option) =>{
                                            const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                return label || value
                                        }
                                    }
                                    onSelect={(value, option)=>{
                                        this.setState({
                                            sMilestone: option
                                        })
                                    }}
                                />
                            </Col>
                        </Row>
                    </Modal>
                )}
            </>
        );
    }
}

export default TimeSheetContact;
