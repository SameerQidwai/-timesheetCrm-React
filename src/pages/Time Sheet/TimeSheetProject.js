import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table, Button, Select, Typography, Modal, DatePicker, Space, Tag, Tooltip, Input, Form, Checkbox} from "antd";
import { DownloadOutlined, SaveOutlined, ExclamationCircleOutlined, PaperClipOutlined, CheckCircleOutlined, AuditOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import AttachModal from "./Modals/AttachModal";
import {   reviewTimeSheet, getMilestones, getUsersTimesheet, getPdf  } from "../../service/timesheet"
import { Api, createQueryParams, dateClosed, getParams, localStore, R_STATUS, STATUS_COLOR } from "../../service/constant";

import "../styles/button.css";
import TimeSheetPDF from "./Modals/TimeSheetPDF";
import { Tag_s } from "../../components/Core/Custom/Index";
import { getCalendarHolidaysFormat, getManageEmployees } from "../../service/constant-Apis";
import { downloadReportFile } from "../../service/reports-Apis";

const { Title, Link: Tlink, Text } = Typography;
//inTable insert

let modal = ""

class TimeSheetProject extends Component {
    constructor() {
        super();
        let {startDate, endDate, milestoneId, timesheetId, userId} = getParams(window.location.search)
        this.state = {
            isAttach: false,
            loading: false,
            sheetDates: {
              startDate: startDate? moment(startDate, 'DD-MM-YYYY')  :moment().startOf('month'),
              endDate: endDate? moment(endDate, 'DD-MM-YYYY'): moment().endOf('month'),
              cMonth: endDate? moment(endDate, 'DD-MM-YYYY') : moment(),
            },
            timeObj: false,
            loading: false, 
            paramTimesheetId: timesheetId??null,
            eData: [],
            sMilestone: milestoneId? parseInt(milestoneId): null,
            sUser: userId? parseInt(userId): null,
            loginId: null,
            data: [ ],
            permissions: {},
            holidays: {},
            milestones: [], // users Time Sheet
            actionNotes: '',
            sTimesheet: { // selected timesheets 
                timesheet: [], //  Timesheets Object 
                keys: [] // TimeSheets key
            },

            columns : [
                {
                    title: "Employee",
                    dataIndex: "user",
                    key: "user",
                    fixed: "left",
                    width: 300,
                    style:{height: 110},
                    render: (value, record, index) => (
                        <Row gutter={[0, 10]} style={{height: 90}}>
                            <Col span={24}>
                                <Row justify="space-between">
                                    <Col span={20}> 
                                        <Link to={{ pathname: `/Employees/${record.userId}/info`}} className="nav-Tlink">
                                            <Text>{`${value}`} </Text>
                                        </Link>
                                    </Col>
                                    <Col span={19}>
                                        <div>
                                          <Link
                                            to={{
                                              pathname: `/projects/${record.projectId}/info`,
                                            }}
                                            className="nav-link"
                                          >
                                            <Text ellipsis={{ tooltip: record.project }}>{record.project}</Text>
                                          </Link>
                                        </div>
                                        {record.projectType === 1 && (
                                          <div>
                                            <Link
                                              to={{
                                                pathname: `/projects/${record.projectId}/milestones/${record.milestoneId}/resources`,
                                              }}
                                              className="nav-link"
                                            >
                                              <Text ellipsis={{ tooltip: record.milestone }}>
                                                ({record.milestone})
                                              </Text>
                                            </Link>
                                          </div>
                                        )}
                                      </Col>
                                     <Col style={{marginLeft: 'auto'}}> 
                                     <Tooltip 
                                            placement="top"
                                            title="Export"
                                            destroyTooltipOnHide
                                        >
                                            <DownloadOutlined onClick={()=>{this.exporPDF([record.milestoneEntryId], index)}}/>
                                        </Tooltip>
                                        <span className={record.status === 'AP' ? 'disabledanticon' : 'anticon'}>  
                                            <Tooltip 
                                                placement="top"
                                                title="Upload"
                                                destroyTooltipOnHide
                                            >
                                                <SaveOutlined disabled={record.status === 'AP'}  
                                                    onClick={()=>{this.openAttachModal(record, index)} }
                                                    style={{color: '#1890ff', marginLeft:10}}
                                                />
                                            </Tooltip>
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row justify="space-between">
                                    {record.attachment &&<Col span={16}>
                                        <Tlink
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
                                                    {`${record.attachment.name.substr(0,20)}${record.attachment.name.length>19 ?'\u2026':''}`}
                                                </Tooltip>
                                        </Tlink>
                                    </Col>}
                                    <Col style={{marginLeft:'auto'}} >
                                        {/* <Space  align="end"> */}
                                            { record.status && <Tag_s text={record.status}/>}
                                           
                                        {/* </Space> */}
                                    </Col>
                                    <Col>
                                        <Tooltip 
                                            placement="top" 
                                            title={record.actionNotes}
                                            destroyTooltipOnHide
                                        >
                                            
                                            {record.actionNotes && <AuditOutlined style={{fontSize: 'small'}} />}
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </Col>
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
        this.fetchAll()
    };

    fetchAll = () =>{
        Promise.all([ getMilestones({phase:true}), getCalendarHolidaysFormat(), getManageEmployees({
          resource: 'TIMESHEETS',
          isActive: true
        })])
        .then(([mileRes, holidayRes, userRes]) => {
            let value = 0
            const { id, permissions } = localStore()
            const loginId = parseInt(id)
            const { TIMESHEETS } = JSON.parse(permissions)

            this.setState({
                milestones: mileRes.success? mileRes.data : [],
                USERS: userRes.success? userRes.data : [],
                permissions: TIMESHEETS ?? {},
                loginId,
                holidays: holidayRes.success ? holidayRes.data : {},
            },()=>{
                this.columns() 
                this.getSheet()
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    getSheet = () =>{
      this.setState({loading: true})
      let { sMilestone, paramTimesheetId, timesheet, keys, sUser } = this.state
      let { startDate, endDate } = this.state.sheetDates
      startDate= startDate.format('DD-MM-YYYY');
      endDate= endDate.format('DD-MM-YYYY');

      let queryString = createQueryParams({
        startDate,
        endDate,
        milestoneId: sMilestone,
        userId: sUser
      })
        
      this.props.history.push(
        {
          pathname: 'time-sheet-approval',
          search: queryString
        }
      )

      // if(sMilestone || sUser){
        
        // getUsersTimesheet({mileId: sMilestone, startDate, endDate, userId: sUser}).then(res=>{
      getUsersTimesheet(queryString).then(res=>{
        timesheet = []
        keys = []
        let length = res?.data?.length ?? 0
        if (paramTimesheetId){ //selecting timesheet from queryparams
          for(let i = 0; i<length; i++){
            let data = res?.data?.[i] ?? {}
            if (data.id == paramTimesheetId && (data.status === "AP" || data.status === "SB")){
              timesheet.push(data)
              keys.push(data.id)
              break; //break if timesheet found
            }
          }
        }
          this.setState({
              // timesheet: res.success ? res.data: {},
              data: (res.success && res.data) ? res.data?? []: [],
              sTimesheet: { // selected timesheet 
                timesheet, //  Timesheet Object 
                keys // TimeSheet keys
              },
              loading: false
          })
      })
      // }else{
      //   this.setState({
      //     loading: false,
      //     data: [],
      //     sTimesheet: {
      //       timesheet, //  Timesheet Object
      //       keys, // TimeSheet keys
      //     },
      //   });
      // }
      this.columns()
    }

    columns = () =>{
        const { startDate, endDate } = this.state.sheetDates
        let { columns, holidays }  = this.state
        let date = undefined
        columns = [columns[0],columns[1]]
        for (let i = startDate.format('D') ; i <= endDate.format('D'); i++) {
            date = date ?? moment(startDate.format())
            columns.push({
              title: (
                <span>
                  <div>{date.format('ddd')}</div>
                  <div> {date.format('DD MMM')} </div>
                  {holidays[date.format('YYYY-MM-DD')] && (
                    <Text
                      ellipsis={{
                        tooltip: holidays[date.format('YYYY-MM-DD')],
                      }}
                      style={{ fontSize: 10, color: 'red' }}
                    >
                      {holidays[date.format('YYYY-MM-DD')]}
                    </Text>
                  )}
                </span>
              ),
              heading: <span>{date.format('dddd - DD MM YYYY')}</span>,
              dataIndex: date.format('D/M'),
              key: date.format('D/M'),
              width: 200,
              editable: true,
              align: 'center',
              render: (value, record, rowIndex) => {
                if (value) {
                  let breakHours = moment.duration(
                    value['breakHours'],
                    'hours'
                  );
                  breakHours =
                    breakHours &&
                    moment(
                      moment()
                        .hours(breakHours.hours())
                        .minutes(breakHours.minutes())
                    ).format('HH:mm');
                  {
                    return (
                      <Tooltip
                        title={value['notes'] && `Note: ${value['notes']}`}
                      >
                        <Row style={{ border: '1px solid' }}>
                          <Col span={24}>
                            Start Time:{' '}
                            {value['startTime'] &&
                              moment(value['startTime'], ['HH:mm']).format(
                                'h:mm A'
                              )}
                          </Col>
                          <Col span={24}>
                            End Time:{' '}
                            {value['endTime'] &&
                              moment(value['endTime'], ['HH:mm']).format(
                                'h:mm A'
                              )}
                          </Col>
                          <Col span={24}>Break: {breakHours && breakHours}</Col>
                          <Col span={24}>
                            Total Hours:{' '}
                            {value['actualHours'] && value['actualHours']}
                          </Col>
                        </Row>{' '}
                      </Tooltip>
                    );
                  }
                }
              },
            });
            date = date.add(1, 'days')
        }
        this.setState({columns})
    }
  
    reviewTimeSheet = (id, stage, index, key) => {
        const { startDate, endDate } = this.state.sheetDates
        const { sMilestone } = this.state
        const query= { pEntryId: id, userId: sMilestone, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
        reviewTimeSheet(query, stage).then(res=>{
            const { data } = this.state
            data[index].status= key
            if(res.success){
                this.setState({
                    data,
                })
            }
        })
    };

    actionTimeSheet = (stage, obj) => {
        const { startDate, endDate } = this.state.sheetDates
        const { keys } = this.state.sTimesheet
        const { sMilestone } = this.state
        const query= { userId: sMilestone, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
        const data = {milestoneEntries: keys, note: obj?.notes}
        reviewTimeSheet(query, stage, data).then(res=>{
            this.getSheet()
        })
    };

    openAttachModal = (record, index) =>{
        let timeObj = {}
        if(index >= 0){
            timeObj = {
                milestoneEntryId: [record.milestoneEntryId],
                milestoneId: record.milestoneId,
                notes: record.notes,
                milestone: record.milestone,
                status: record.status,
                rowIndex: index
            }
        }else{
            const {keys, timesheet} = this.state.sTimesheet
            timeObj = {
                milestoneEntryId: keys,
                milestoneId: timesheet[0].milestoneId,
                notes: timesheet[0].notes,
                milestone: timesheet[0].milestone,
                status: false,
            }
        }
        this.setState({ timeObj, isAttach: true})
    }

    exporPDF = (entryIds) =>{
      console.log(entryIds);
      // this.setState({
      //     eData:  entryIds,
      //     isDownload: true
      // })   
        const data = {milestoneEntryIds: entryIds}
          this.setState({loading: true})
        getPdf(data).then(res=>{
          if(res.success){
            let {files: fileUrl, timesheets} = res.data
            let timesheet = timesheets?.[0] ?? {}
            let employee = timesheets?.length === 1 ? timesheet.employee : 'timesheets'
            let name = `${employee} - ${timesheet.period}__`
            downloadReportFile(fileUrl, name)
            this.setState({loading: false})
          }
        }).catch(err =>{
          this.setState({loading: false})
        })
    }

    summaryFooter = (data) =>{
        const { columns } = this.state
        if(data.length>0)
        return (
            <Table.Summary fixed="top">
                <Table.Summary.Row>
                    {/* //multiple select commented */}
                    <Table.Summary.Cell  index={0}> </Table.Summary.Cell> 
                    {columns.map(({key, dateObj}, kIndex)=>{
                        let value = 0
                        data.map((rowData, index) =>{
                            if(key !== 'user' ){
                                if(key === 'totalHours'){
                                    value += data[index]['totalHours'] ?? 0
                                }else{
                                    value += (rowData[key] ? rowData[key]['actualHours'] :0)
                                }
                            }
                        })
                        return key === 'user' ? <Table.Summary.Cell index={kIndex+1} key={kIndex+1}>
                            Total Work In A day  
                        </Table.Summary.Cell > 
                        : // show total and normal background if the column month is same as selected month or the key is totalHours of the month
                        <Table.Summary.Cell 
                            index={kIndex+1}
                            key={kIndex+1}
                            align="center" 
                        >
                            {value && value.toFixed(2)}
                        </Table.Summary.Cell>
                    })}
                </Table.Summary.Row>
            </Table.Summary>
        )
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

    milestoneSelect = (selectedRowKeys, selectedRows)=>{
        let cantApprove = true, cantReject = true, cantUnapprove = true
        selectedRows.forEach(el =>{
            if (el.status === 'SB'){
                cantApprove = false
            }
            if(el.status === 'SB'){
                cantReject = false
            }
            if(el.status === 'AP'){
                cantUnapprove = false
            }
        })
        this.setState({
            sTimesheet: {
                timesheet: selectedRows,
                keys: selectedRowKeys,
                cantApprove, 
                cantReject,
                cantUnapprove 
            }
        })
    }

    onActionFinished = (notes, stage) => {
        this.actionTimeSheet(stage, notes) 
        modal.destroy();
    }

    multiAction = (stage)=> {
        console.log(stage);
        const { cMonth } = this.state.sheetDates
        let content = stage !== 'Delete' ? <Row>
            <Col span="24">
                <Title level={5}>Notes</Title>
            </Col>
            <Col span="24">
                <Form  id={'my-form' } onFinish={(value)=> this.onActionFinished(value, stage)} >
                    <Form.Item noStyle name={'notes'} >
                        <Input.TextArea
                            placeholder="Enter Your Notes...."
                            autoSize={{ minRows: 3, maxRows: 10 }}
                            allowClear
                        />
                        </Form.Item>
                </Form>
            </Col>
        </Row> : ''
        modal = Modal.confirm({
          title: `${stage} timesheet for the month of ${cMonth.format('MMM YYYY')} ?`,
          width: 520,
          icon: stage=== 'Reject' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />,
          content: content,
          okButtonProps: {danger: stage === 'Delete'??true, htmlType: 'submit', form: 'my-form'  },
          okText: 'Yes',
          cancelText: 'No',
        });
    }

    attachCallBack = (res) =>{ 
        const {data, timeObj } = this.state
        const {rowIndex} = timeObj
        if(rowIndex >= 0 ){
            data[rowIndex].notes = res.notes
            data[rowIndex].attachment = res.attachment
            this.setState({data, isAttach: false, editTime: false, timeObj: false})
        }else{
            this.getSheet()
        }
    }

    // onCheckChanged = async({target}) =>{
    //   let value = target.checked
    //   let query = '' ;
    //   if (!value){
    //     query = {phase:true}
    //   }
    //   let res = await getMilestones(query)
    //   this.setState({milestones: res.success? res.data : [],})
    // }
    onCheckChanged = async({target}, key) =>{
      let value = target.checked
      let query = key === 'USERS' ? {resource: 'TIMESHEETS'} : {}
      // if (key !== 'USERS'){
          if (!value){
              if (key ==='milestones'){
                  query.phase= true
              }else if (key === 'USERS'){
                  query.isActive = true
              }
          }
          let res =  key === 'milestones'
              ? await getMilestones(query)
              : await getManageEmployees(query);
              
          this.setState({ [key]: res.success ? res.data : [] });
      // }
    }

    render() {
        const {  data,   columns,  timeObj,  milestones, sMilestone, isAttach, isDownload, eData, sTimesheet, permissions, sheetDates, USERS, sUser, loading } = this.state
        return (
          <>
            <Row justify="space-between">
              <Col>
                <Title level={4}>Timesheet Approval</Title>
              </Col>
              <Col>
                <Select
                  placeholder="Select Project/Milestone"
                  style={{ width: 250 }}
                  allowClear
                  options={milestones}
                  value={sMilestone}
                  showSearch
                  optionFilterProp={['label', 'value']}
                  filterOption={(input, option) => {
                    const label =
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0;
                    const value =
                      option.value
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0;
                    return label || value;
                  }}
                  onChange={(value, option) => {
                    this.setState(
                      {
                        sMilestone: value,
                      },
                      () => {
                        this.getSheet();
                      }
                    );
                  }}
                />
                <div className='smallcheckpox'>
                    <Checkbox size ="small" onChange={(event)=>this.onCheckChanged(event, 'milestones')}/> &nbsp; include closed projects
                </div>
              </Col>
              {/* Users dropdown uncomment this */}
              <Col>
                <Select
                  allowClear
                  placeholder="Select User"
                  options={USERS}
                  value={sUser}           
                  style={{ width: 250 }}
                  showSearch
                  optionFilterProp={["label", "value"]}
                  filterOption={
                      (input, option) =>{
                          const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                              return label || value
                      }
                  }
                  onChange={(value, option)=>{
                      this.setState({
                        sUser: value,
                      },()=>{
                          this.getSheet()
                      })
                  }}
                />
                <div className='smallcheckpox'>
                    <Checkbox size ="small" onChange={(event)=>this.onCheckChanged(event, 'USERS')}/> &nbsp; include inactive users
                </div>
                </Col>
              <Col>
                <DatePicker
                  mode="month"
                  picker="month"
                  format="MMM-YYYY"
                  value={sheetDates.cMonth}
                  onChange={(value) => {
                    this.setState(
                      {
                        sheetDates: {
                          cMonth: value ?? moment(),
                          startDate: moment(value ?? moment()).startOf('month'),
                          endDate: moment(value ?? moment()).endOf('month'),
                        },
                      },
                      () => {
                        this.getSheet();
                      }
                    );
                  }}
                  defaultValue={moment()}
                />
              </Col>
            </Row>
            <Table
              sticky
              size="small"
              loading={loading}
              style={{ maxHeight: 'fit-content', marginTop: '5px' }}
              className="timeSheet-table fs-small"
              rowSelection={{
                //multiple select commented
                selectedRowKeys: sTimesheet.keys,
                fixed: true,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.milestoneSelect(selectedRowKeys, selectedRows);
                },
                getCheckboxProps: (record) => ({
                  disabled:
                    record.timesheetStatus === 'SV' ||
                    record.timesheetStatus === 'RJ' ||
                    record.timesheetStatus === 'NC' ||
                    (!permissions['UNAPPROVAL'] &&
                      record.timesheetStatus === 'AP') ||
                    record.phase === false || dateClosed(sheetDates?.endDate)
                    // Column configuration not to be checked
                }),
              }}
              scroll={{
                // x: "calc(700px + 100%)",
                x: "'max-content'",
              }}
              bordered
              pagination={false}
              rowKey={'milestoneEntryId'}
              // rowClassName={(record) => this.highlightRow(record)}
              columns={columns}
              dataSource={[...data]}
              summary={(columnData) => this.summaryFooter(columnData)}
            />
            <Row justify="end" gutter={[20, 200]}>
              <Col>
                {/* || sTimesheet.approved|| sTimesheet.rejected */}{' '}
                {/* ???? whats the hell is this*/}
                <Button
                  disabled={sTimesheet.keys.length < 1}
                  onClick={() => this.openAttachModal()}
                >
                  Import
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  disabled={sTimesheet.keys.length < 1}
                  onClick={() => {
                    this.exporPDF(sTimesheet.keys);
                  }}
                >
                  Export
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  danger
                  disabled={
                    sTimesheet.keys.length < 1 ||
                    !permissions['APPROVAL'] ||
                    sTimesheet.cantReject
                  }
                  onClick={() => this.multiAction('Reject')}
                >
                  Reject
                </Button>
              </Col>
              <Col>
                <Button
                  className={'success'}
                  disabled={
                    sTimesheet.keys.length < 1 ||
                    !permissions['APPROVAL'] ||
                    sTimesheet.cantApprove
                  }
                  onClick={() => this.multiAction('Approve')}
                >
                  Approve
                </Button>
              </Col>
              <Col>
                <Button
                  className={'not-success'}
                  disabled={
                    sTimesheet.keys.length < 1 ||
                    !permissions['UNAPPROVAL'] ||
                    sTimesheet.cantUnapprove
                  }
                  onClick={() => this.multiAction('Unapprove')}
                >
                  Unapprove
                </Button>
              </Col>
            </Row>
            {isAttach && (
              <AttachModal
                visible={isAttach}
                timeObj={timeObj}
                callBack={this.attachCallBack}
                close={() => this.setState({ isAttach: false, timeObj: false })}
              />
            )}
            {isDownload && (
              <TimeSheetPDF
                milestoneEntryId={eData}
                close={() => this.setState({ isDownload: false })}
              />
            )}
          </>
        );
    }
}

export default TimeSheetProject;
