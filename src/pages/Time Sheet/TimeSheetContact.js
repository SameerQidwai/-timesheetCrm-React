import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table, Modal, Button, Select, Typography, Popconfirm, DatePicker, Space, Tag, Tooltip, message, Dropdown, Menu, Radio} from "antd";
import { DownloadOutlined, SaveOutlined, LoadingOutlined, PlusCircleOutlined, MoreOutlined, DeleteOutlined, EditOutlined, 
    LeftOutlined, RightOutlined,ExclamationCircleOutlined, CheckCircleOutlined, PaperClipOutlined, AuditOutlined, DiffFilled } from "@ant-design/icons"; //Icons
import TimeModal from "./Modals/TimeModal"
import AttachModal from "./Modals/AttachModal";
import {  getList, reviewTimeSheet, getUsers, deleteTime, getPdf,  } from "../../service/timesheet"
import { getCalendarHolidaysFormat, getUserMilestones } from "../../service/constant-Apis";
import { localStore, Api, thumbUrl, STATUS_COLOR, R_STATUS, formatFloat, getModulePermissions, dateClosed } from "../../service/constant";
    
import moment from "moment";
import "../styles/button.css";
import TimeSheetPDF from "./Modals/TimeSheetPDF";
import { Tag_s } from "../../components/Core/Custom/Index";
import BulkModal from "./Modals/BulkModal";
import { downloadReportFile } from "../../service/reports-Apis";

const { Title, Link: Tlink, Text} = Typography;
//inTable insert

class TimeSheetContact extends Component {
  constructor() {
    super();

    this.state = {
      isVisible: false,
      inProgress: false,
      proVisible: false,
      isAttach: false,
      sheetDates: {
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month'),
        cMonth: moment(),
        sWeek: moment(),
      },
      timeObj: false,
      editTime: false,
      loading: false,
      eData: [],
      USERS: [],
      sUser: null,
      loginId: null,
      data: [],
      comments: null,
      sMilestone: {},
      permissions: {},
      holidays: {},
      milestones: [],
      sTMilestones: {
        milestones: [],
        keys: [],
      },
      columns: [
        {
          title: 'Project',
          dataIndex: 'project',
          key: 'project',
          fixed: 'left',
          width: 300,
          render: (value, record, index) => {
            if (record.leaveRequest) {
              // for Leave Request Timesse data
              return (
                <Row gutter={[0, 10]}>
                  <Col span={24}>{record.leaveType}</Col>
                  <Col span={24}>{value} </Col>
                </Row>
              );
            }
            return (
              <Row gutter={[0, 10]} style={{ height: 90 }}>
                <Col span={24}>
                  <Row justify="space-between">
                    <Col span={19}>
                      <div>
                        <Link
                          to={{
                            pathname: `/projects/${record.projectId}/info`,
                          }}
                          className="nav-link"
                        >
                          <Text ellipsis={{ tooltip: value }}>{value}</Text>
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
                    {/* File_name and paperclip to show under project is in comment section line 156*/}
                    <Col style={{ marginLeft: 'auto' }}>
                      {/* <span /> // this is for  bulk entry Icon on single project 
                        className={
                          ['AP'].includes(record.status)
                            ? 'disabledanticon'
                            : 'anticon'
                        }
                      >
                        <Tooltip
                          placement="top"
                          title="Bulk Time Entries"
                          destroyTooltipOnHide
                        >
                          <DiffFilled
                            disabled={['AP'].includes(record.status)}
                            onClick={() => {
                              this.openBulkModal(record, index);
                            }}
                            style={{ color: '#1890ff', marginRight: 10 }}
                          />
                        </Tooltip>
                      </span> */}
                      <Tooltip
                        placement="top"
                        title="Export"
                        destroyTooltipOnHide
                      >
                        <DownloadOutlined
                          onClick={() => {
                            this.exporPDF(record.milestoneEntryId, index);
                          }}
                        />
                      </Tooltip>
                      {/* this need to be done because Tool tip can't  disabanble and  */}
                      <span
                        className={
                          record.status === 'AP' ? 'disabledanticon' : 'anticon'
                        }
                      >
                        <Tooltip
                          placement="top"
                          title="Upload"
                          destroyTooltipOnHide
                        >
                          <SaveOutlined
                            disabled={record.status === 'AP'}
                            onClick={() => {
                              this.openAttachModal(record, index);
                            }}
                            style={{ color: '#1890ff', marginLeft: 10 }}
                          />
                        </Tooltip>
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="space-between">
                    {record.attachment && (
                      <Col span={16}>
                        <Tlink
                          href={`${Api}/files/${record.attachment.uid}`}
                          download={record.attachment.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          ellipsis={true}
                        >
                          <Tooltip
                            placement="topLeft"
                            title={record.attachment.name}
                            destroyTooltipOnHide
                          >
                            <PaperClipOutlined /> {record.attachment?.name}
                            {/* {`${record.attachment.name.substr(0,20)}${record.attachment.name.length>19 ?'\u2026':''}`} */}
                          </Tooltip>
                        </Tlink>
                      </Col>
                    )}
                    <Col style={{ marginLeft: 'auto' }}>
                      {record.status && <Tag_s text={record.status} />}
                    </Col>
                    <Col>
                      <Tooltip
                        placement="top"
                        title={record.actionNotes}
                        destroyTooltipOnHide
                      >
                        {record.actionNotes && (
                          <AuditOutlined style={{ fontSize: 'small' }} />
                        )}
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          },
        },
        {
          title: 'Monthly Total',
          dataIndex: 'totalHours',
          key: 'totalHours',
          fixed: 'left',
          align: 'center',
          width: 100,
          render: (value, record) => !record.leaveRequest && formatFloat(value),
        },
      ],
    };
  }

  componentDidMount = () => {
    this.fetchAll();
    // this.columns()
  };

  fetchAll = () => {
    Promise.all([getUsers(), getCalendarHolidaysFormat()])
      .then(([userRes, holidayRes]) => {
        let value = 0;
        const { anyPermissions: permissions, userLoginId: loginId } =
          getModulePermissions('TIMESHEETS');

        if (userRes.success && userRes.data.length > 0) {
          value = userRes.data.value;
          userRes.data.forEach((el) => {
            if (el.value === loginId) {
              value = el.value; //selecting the login user from users array
            }
          });
        }

        this.setState(
          {
            USERS: userRes.success ? userRes.data : [],
            sUser: value,
            permissions: permissions,
            loginId,
            holidays: holidayRes.success ? holidayRes.data : {},
            // USERS: userRes[1].success? userRes[1].data : [],
          },
          () => {
            this.columns();
            if (this.state.sUser) {
              this.getSheet();
            }
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getProjects = (userId, startDate, endDate) => { // remove this if project button gets removed
    getUserMilestones({
      userId: userId,
      phase: 0,
      startDate: startDate.format('DD-MM-YYYY'),
      endDate: endDate.format('DD-MM-YYYY'),
    }).then((res) => {
      if (res.success) {
        this.setState({
          milestones: res.data,
        });
      }
    });
  };

  getSheet = () => {
    // get timesheet for the employee withe date
    const { sUser, sheetDates } = this.state;
    const { startDate, endDate } = sheetDates;
    if (sUser) {
      getList({
        userId: sUser,
        startDate: startDate.format('DD-MM-YYYY'),
        endDate: endDate.format('DD-MM-YYYY'),
      }).then((res) => {
        // if (res.success){
        this.setState({
          timesheet: res.data ?? {},
          data: res?.data?.milestones ?? [],
          sTMilestones: {
            milestones: [],
            keys: [],
          },
        });
        // }
      });
    }
    this.columns();
  };

  columns = () => {
    // create table column and add date as colmumn name for selected month
    const { sWeek, startDate, endDate } = this.state.sheetDates;
    let { columns, sUser, loginId, permissions, holidays } = this.state;
    let date = undefined;
    let key = undefined;
    columns = [columns[0], columns[1]];
    const startWeek = moment(sWeek.format('YYYY-MM-DDTHH:mm:ss')).startOf(
      'isoWeek'
    );
    const endWeek = moment(sWeek.format('YYYY-MM-DDTHH:mm:ss')).endOf(
      'isoWeek'
    );
    let week = endWeek.diff(startWeek, 'days');

    for (let i = 0; i <= week; i++) {
      date = date ?? moment(startWeek.format());
      columns.push({
        title: (
          <span>
            <div>{date.format('ddd')}</div>
            <div> {date.format('DD MMM')} </div>
            {holidays[date.format('YYYY-MM-DD')] && (
              <Text
                ellipsis={{ tooltip: holidays[date.format('YYYY-MM-DD')] }}
                style={{ fontSize: 10, color: 'red' }}
              >
                {holidays[date.format('YYYY-MM-DD')]}
              </Text>
            )}
          </span>
        ),
        heading: <span>{date.format('dddd - DD MM YYYY')}</span>,
        dateObj: moment(date.format()),
        dataIndex: date.format('D/M'),
        key: date.format('D/M'),
        className:
          (date.isBefore(startDate) || date.isAfter(endDate)) &&
          'prevDates-TMcell',
        width: 200,
        editable: true,
        align: 'center',
      });
      date = date.add(1, 'days');
    }

    this.setState({ columns }, () => {
      //insert data with conditional clickable Items => it weren't working
      const columns = this.state.columns.map((col) => {
        // when creating column onCell key is not render at that time and is async function so have to call it again
        if (col.dataIndex === 'project' || col.dataIndex === 'totalHours') {
          return col;
        }
        return {
          ...col,
          render: (value, record, rowIndex) => {
            if (record.leaveRequest) {
              if (value) {
                // for leave request columns
                {
                  return (
                    <Tooltip
                      title={value['notes'] && `Note: ${value['notes']}`}
                    >
                      <Row>
                        <Col span={24}>
                          Off Hours: {formatFloat(value['hours'])}
                        </Col>
                        <Col>Status: </Col>
                        <Col style={{ marginLeft: 'auto', marginRight: 5 }}>
                          <Space align="end">
                            <Tag_s text={value['status']} />
                            <Tooltip
                              placement="top"
                              title={value['statusMsg']}
                              destroyTooltipOnHide
                            >
                              {value['statusMsg'] && (
                                <AuditOutlined style={{ fontSize: 'small' }} />
                              )}
                            </Tooltip>
                          </Space>
                        </Col>
                      </Row>
                    </Tooltip>
                  );
                }
              }
            } else {
              const canAdd =
                (!permissions?.['ADD'] || sUser === loginId) &&
                col.dateObj.isSameOrAfter(startDate) &&
                col.dateObj.isSameOrBefore(endDate); //checking if project is close
              const clickable =
                (record.status === 'SV' ||
                  record.status === 'RJ' ||
                  !record.status) &&
                record.phase !== false &&
                sUser === loginId && !dateClosed(endDate)
              if (value) {
                // I didn't put the conditon for column previos or next month because this column won't have any value for now
                let breakHours = moment.duration(value['breakHours'], 'hours');
                breakHours =
                  breakHours &&
                  moment(
                    moment()
                      .hours(breakHours.hours())
                      .minutes(breakHours.minutes())
                  ).format('HH:mm');

                //if note is null hide the tooltip condistion
                {
                  return (
                    <Tooltip
                      title={value['notes'] && `Note: ${value['notes']}`}
                    >
                      <Row style={{ border: '1px solid' }}>
                        <Col span={22}>
                          Start Time:{' '}
                          {value['startTime'] &&
                            moment(value['startTime'], ['HH:mm']).format(
                              'h:mm A'
                            )}
                        </Col>
                        <Col span={2}>
                          {clickable && (
                            <Dropdown
                              placement="bottomCenter"
                              overlay={
                                <Menu onClick={this.handleMenuClick}>
                                  <Menu.Item
                                    disabled={
                                      !permissions?.['UPDATE'] &&
                                      sUser !== loginId
                                    }
                                    key="Edit"
                                    onClick={() => {
                                      //data //index    //col key      //Col heading to show on Modal
                                      this.getRecord(
                                        record,
                                        rowIndex,
                                        col.dataIndex,
                                        col.heading
                                      ); // call function to save data in
                                    }}
                                  >
                                    <EditOutlined />
                                  </Menu.Item>
                                  <Menu.Item
                                    key="delete" //checking delete permission   // only admin and loggedin user will see the menu  icon //checking if project is close
                                    disabled={
                                      !permissions?.['DELETE'] &&
                                      sUser !== loginId
                                    }
                                    onClick={() => {
                                      this.deleteRecord(
                                        value,
                                        rowIndex,
                                        col.dataIndex
                                      );
                                    }}
                                  >
                                    <DeleteOutlined />
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <MoreOutlined style={{ cursor: 'pointer' }} />
                            </Dropdown>
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
                      </Row>
                    </Tooltip>
                  );
                }
              } else {
                // to not show add button if column month doesn't match with  selected month
                return (
                  clickable &&
                  canAdd && (
                    <PlusCircleOutlined
                      style={{ fontSize: 24, color: '#1890ff' }}
                      onClick={() => {
                        //data //index    //col key      //Col heading to show on Modal
                        this.getRecord(
                          record,
                          rowIndex,
                          col.dataIndex,
                          col.heading
                        ); // call function to save data in
                      }}
                    />
                  )
                );
              }
            }
          },
        };
      });
      this.setState({ columns });
    });
  };

  deleteRecord = (value, row, col) => {
    deleteTime(value.entryId).then((res) => {
      if (res.success) {
        const { data } = this.state;
        delete data[row][col];
        data[row]['totalHours'] = data[row]['totalHours'] - value.actualHours;
        this.setState({
          data: data,
        });
      }
    });
  };

  getRecord = (record, rowIndex, colKey, colTitle) => {
    // get record in dialog box for edit
    const timeObj = {
      milestoneEntryId: record.milestoneEntryId,
      milestoneId: record.milestoneId,
      milestone: record.milestone,
      row: rowIndex,
      col: colKey,
      title: colTitle,
    };
    if (record[colKey]) {
      let breakHours = record[colKey].breakHours;
      var duration = moment.duration(breakHours, 'hours');
      let obj = {
        entryId: record[colKey].entryId,
        startTime: moment(record[colKey].startTime, 'HH:mm')._isValid
          ? moment(record[colKey].startTime, 'HH:mm')
          : null,
        endTime: moment(record[colKey].endTime, 'HH:mm')._isValid
          ? moment(record[colKey].endTime, 'HH:mm')
          : null,
        breakHours:
          duration &&
          moment().hours(duration.hours()).minutes(duration.minutes()),
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
    const { data, timeObj } = this.state;
    const { row, col } = timeObj;

    value.entryId = value.id;
    data[row]['milestoneEntryId'] = value.milestoneEntryId;
    if (sum) {
      data[row][col] = value; // put here so the code don't bust if cell is not created
      data[row]['totalHours'] =
        (data[row]['totalHours'] ?? 0) + (value.actualHours ?? 0);
    } else {
      let oldHours = data[row][col].actualHours;
      data[row][col] = value; // put here so the code don't bust if cell is not created while adding
      data[row]['totalHours'] =
        (data[row]['totalHours'] ?? 0) +
        (value.actualHours ?? 0) -
        (oldHours ?? oldHours);
    }
    this.setState({
      data: data,
      timeObj: false,
      isVisible: false,
      editTime: false,
    });
  };

  reviewTimeSheet = (ids, stage, index, key) => {
    const { startDate, endDate } = this.state.sheetDates;
    const { sUser } = this.state;
    const query = {
      pEntryId: ids,
      userId: sUser,
      startDate: startDate.format('DD-MM-YYYY'),
      endDate: endDate.format('DD-MM-YYYY'),
    };
    reviewTimeSheet(query, stage).then((res) => {
      const { data } = this.state;
      if (res.success && index >= 0) {
        data[index].status = key;
        this.setState({
          data,
        });
      }
    });
  };

  actionTimeSheet = (stage) => {
    const { startDate, endDate } = this.state.sheetDates;
    const { keys } = this.state.sTMilestones;
    const { sUser } = this.state;
    const query = {
      userId: sUser,
      startDate: startDate.format('DD-MM-YYYY'),
      endDate: endDate.format('DD-MM-YYYY'),
    };
    const data = { milestoneEntries: keys };
    reviewTimeSheet(query, stage, data).then((res) => {
      this.getSheet();
    });
  };

  openAttachModal = (record, index) => {
    let timeObj = {};
    if (record.milestoneEntryId) {
      if (index >= 0) {
        timeObj = {
          milestoneEntryId: [record.milestoneEntryId],
          milestoneId: record.milestoneId,
          notes: record.notes,
          milestone: record.milestone,
          status: record.status,
          rowIndex: index,
        };
      } else {
        const { keys, timesheet } = this.state.sTimesheet;
        timeObj = {
          milestoneEntryId: keys,
          milestoneId: timesheet[0].milestoneId,
          notes: timesheet[0].notes,
          milestone: timesheet[0].milestone,
          status: false,
        };
      }
      this.setState({ timeObj, isAttach: true });
    } else {
      this.exportUploadError();
    }
  };

  openBulkModal = () => {
    const { startDate, endDate } = this.state.sheetDates;
    const { sUser, data } = this.state;
    this.setState({
      isBulk: {
        userId: sUser,
        monthStart: startDate,
        monthEnd: endDate,
        visible: true,
        leaves: data.filter(record=> record.leaveRequest === true)
        // milestoneId: record.milestoneId,
      },
    });
  };

  exportUploadError = () => {
    message.error(
      {
        content: "Can't Upload/Export To Timesheet Without Any Time Entry",
        key: 'empty',
      },
      3
    );
  };

  attachCallBack = (res) => {
    const { data, timeObj } = this.state;
    const { rowIndex } = timeObj;
    if (rowIndex >= 0) {
      data[rowIndex].notes = res.notes;
      data[rowIndex].attachment = res.attachment;
      this.setState({ data, isAttach: false, editTime: false, timeObj: false });
    } else {
      this.getSheet();
    }
  };

  exporPDF = (entryId) => {
    const keys = entryId ? [entryId] : this.state?.sTimesheet?.keys;
    const data = {milestoneEntryIds: keys}
    // if (keys) {
    //   this.setState({
    //     eData: keys,
    //     isDownload: true,
    //   });
    // } else {
    //   this.exportUploadError();
    // }
    getPdf(data).then(res=>{
      this.setState({inProgress: true})
      if(res.success){
        downloadReportFile(res.data, res.name)
        this.setState({inProgress: false})
      }
    }).catch(err =>{
      this.setState({inProgress: false})
    })
  };

  summaryFooter = (data) => {
    const { columns } = this.state;
    const { startDate, endDate } = this.state.sheetDates;
    if (data.length > 0)
      return (
        <Table.Summary fixed="top">
          <Table.Summary.Row>
            {/* //multiple select commented */}
            <Table.Summary.Cell index={0}> </Table.Summary.Cell>
            {columns.map(({ key, dateObj }, kIndex) => {
              let value = 0;
              data.map((rowData, index) => {
                //calculation for total hours and actual hours for footer to show
                if (key !== 'project' && !rowData['leaveRequest']) {
                  if (key === 'totalHours') {
                    value += data[index]['totalHours'] ?? 0;
                  } else {
                    value += rowData[key] ? rowData[key]['actualHours'] : 0;
                  }
                }
              });
              //Title of the projct show column for title
              return key === 'project' ? (
                <Table.Summary.Cell index={kIndex + 1} key={kIndex + 1}>
                  Total Hours
                </Table.Summary.Cell>
              ) : // show total and normal background if the column month is same as selected month or the key is totalHours of the month
              key === 'totalHours' ||
                (dateObj &&
                  dateObj.isSameOrAfter(startDate) &&
                  dateObj.isSameOrBefore(endDate)) ? (
                <Table.Summary.Cell
                  index={kIndex + 1}
                  key={kIndex + 1}
                  align="center"
                >
                  {formatFloat(value)}
                </Table.Summary.Cell>
              ) : (
                // show background grey if the column month is NOT same as selected month
                <Table.Summary.Cell
                  index={kIndex + 1}
                  key={kIndex + 1}
                  align="center"
                  className="prevDates-TMcell"
                >
                  0.00
                </Table.Summary.Cell>
              );
            })}
          </Table.Summary.Row>
        </Table.Summary>
      );
  };

  milestoneSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      sTMilestones: {
        milestones: selectedRows,
        keys: selectedRowKeys,
      },
    });
  };

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

  multiAction = (stage) => {
    const { milestones, keys } = this.state.sTMilestones;
    const { cMonth } = this.state.sheetDates;
    let content = (
      <div>
        {milestones.map(({ project, milestone, projectType }, index) => (
          <div key={index}>
            {project}
            {projectType === 1 && ` (${milestone})`}
            {milestones.length - 1 > index && ','}
          </div>
        ))}
      </div>
    );
    const modal = Modal.confirm({
      title: `Do you wish to ${stage} timesheet for the month of ${cMonth.format(
        'MMM YYYY'
      )} ?`,
      icon:
        stage === 'Delete' ? (
          <ExclamationCircleOutlined />
        ) : (
          <CheckCircleOutlined />
        ),
      content: content,
      okButtonProps: { danger: stage === 'Delete' ?? true },
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        this.actionTimeSheet(stage);
        modal.destroy();
      },
    });
  };

  handleSelWeek = (buttonPress) => {
    const { sheetDates } = this.state;
    const { sWeek, startDate, endDate, cMonth } = sheetDates;
    if (buttonPress === 'pWeek') {
      let showWeek = moment(sWeek.subtract(7, 'days'));
      if (!sWeek.isSame(startDate)) {
        // will not run hook if sWeek and startDate is same
        this.setState(
          {
            sheetDates: {
              ...sheetDates,
              sWeek: showWeek.isSameOrAfter(startDate)
                ? showWeek
                : moment(cMonth).startOf('month'),
            }, //check if the date is right    //select calcyalte week   //else 1st of month
          },
          () => this.columns()
        );
      }
    } else if (buttonPress === 'nWeek') {
      let showWeek = moment(sWeek.add(7, 'days'));
      if (!sWeek.isSame(endDate)) {
        // will not run the hook if sWeek is same as endDate
        this.setState(
          {
            sheetDates: {
              ...sheetDates,
              sWeek: showWeek.isSameOrBefore(endDate)
                ? showWeek
                : moment(cMonth).endOf('month'),
            }, //check if the date is right    //select calcyalte week   //else 1st of month
          },
          () => this.columns()
        );
      }
    }
  };

  bulkCallBack = () =>{
    // get timesheet for the employee withe date
    const { sUser, sheetDates } = this.state;
    const { startDate, endDate } = sheetDates;
    if (sUser) {
      getList({
        userId: sUser,
        startDate: startDate.format('DD-MM-YYYY'),
        endDate: endDate.format('DD-MM-YYYY'),
      }).then((res) => {
        // if (res.success){
        this.setState({
          timesheet: res.data ?? {},
          data: res?.data?.milestones ?? [],
          sTMilestones: {
            milestones: [],
            keys: [],
          },
          isBulk: false 
        });
        // }
      });
    }
  }


  render() {
    const { loading, data, isVisible, proVisible, columns, editTime, timeObj, sheetDates, milestones, sMilestone, isAttach, isBulk, isDownload, eData, USERS, sUser, loginId, sTMilestones, permissions, inProgress } = this.state;
    // delete button disable condition
    const canDelete =
      sTMilestones.keys.length < 1 &&
      (sUser === loginId || !!permissions?.['DELETE']); //Check this thing please if permission mei koi masla aye
    const { sWeek, startDate, endDate, cMonth } = this.state.sheetDates;
    return (
      <>
        <Row justify="space-between" gutter={20}>
          <Col>
            <Title level={4}>Timesheet Submission</Title>
          </Col>
          <Col style={{marginLeft: 'auto'}}>
            <Select
              placeholder="Select User"
              options={USERS}
              value={sUser}
              style={{ width: 300 }}
              showSearch
              optionFilterProp={['label', 'value']}
              filterOption={(input, option) => {
                const label =
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                const value =
                  option.value
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0;
                return label || value;
              }}
              onSelect={(value, option) => {
                this.setState(
                  {
                    sUser: value,
                  },
                  () => {
                    this.getSheet();
                  }
                );
              }}
            />
          </Col>
          <Col>
            <DatePicker
              mode="month"
              picker="month"
              format="MMM-YYYY"
              onChange={(value) => {
                this.setState(
                  {
                    sheetDates: {
                      //set Date here
                      cMonth: value ?? moment(),
                      startDate: moment(value ?? moment()).startOf('month'),
                      sWeek: moment(value ?? moment()).startOf('month'),
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
          <Col >
            <Button
              type="primary"
              disabled={sUser !== loginId || dateClosed(endDate)}
              className="orange-color"
              onClick={() => { this.openBulkModal(); }}
            >
              Bulk Entries
            </Button>
          </Col>
          <Col >
            <Button
              type="primary"
              disabled={sUser !== loginId || dateClosed(endDate)}
              onClick={() => {
                this.getProjects(sUser, startDate, endDate);
                this.setState({ proVisible: true });
              }}
            >
              Add Project
            </Button>
          </Col>
        </Row>
        <Row justify="end" gutter={[0,20]}>
          <Col>
            <Button
              disabled={sWeek.isSameOrBefore(startDate)}
              value="pWeek"
              size="small"
              onClick={() => this.handleSelWeek('pWeek')}
            >
              <LeftOutlined />
            </Button>
            <Button
              disabled={sWeek.isSameOrAfter(endDate)}
              value="nWeek"
              size="small"
              onClick={() => this.handleSelWeek('nWeek')}
            >
              <RightOutlined />
            </Button>
          </Col>
        </Row>
        <Table
          sticky
          size="small"
          style={{ maxHeight: 'fit-content' }}
          className="timeSheet-table fs-small"
          loading={inProgress}
          rowSelection={{
            //multiple select commented
            onChange: (selectedRowKeys, selectedRows) => {
              this.milestoneSelect(selectedRowKeys, selectedRows);
            },
            getCheckboxProps: (record) => ({
              //checking if project is close
              disabled:
                sUser !== loginId ||
                record.status === 'SB' ||
                record.status === 'AP' ||
                record.leaveRequest ||
                record.phase === false ||
                dateClosed(endDate)
              // Column configuration not to be checked
            }),
          }}
          scroll={{
            // x: "calc(700px + 100%)",
            x: "'max-content'",
          }}
          bordered
          pagination={false}
          rowKey={(data) => data.milestoneEntryId}
          // rowClassName={(record) => this.highlightRow(record)}
          columns={columns}
          dataSource={[...data]}
          summary={(columnData) => this.summaryFooter(columnData)}
        />
        <Row justify="end" gutter={[20, 200]}>
          <Col>
            <Button
              className={'success'}
              disabled={sUser !== loginId || sTMilestones.keys.length < 1}
              onClick={() => this.multiAction('Submit')}
            >
              Submit
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              danger
              disabled={
                sTMilestones.keys.length < 1 &&
                (sUser !== loginId || !permissions?.['DELETE']?.['ANY'])
              }
              onClick={() => this.multiAction('Delete')}
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
            close={() =>
              this.setState({
                isVisible: false,
                editTime: false,
                timeObj: false,
              })
            }
            callBack={this.callBack}
          />
        )}
        {isAttach && (
          <AttachModal
            visible={isAttach}
            timeObj={timeObj}
            yearClosed={dateClosed(endDate)}
            close={() =>
              this.setState({
                isAttach: false,
                editTime: false,
                timeObj: false,
              })
            }
            callBack={this.attachCallBack}
          />
        )}
        {isBulk && (
          <BulkModal
            visible={!!isBulk?.visible}
            bulkData={isBulk}
            callBack={this.bulkCallBack}
            close={() => this.setState({ isBulk: false })}
          />
        )}
        {/* {isDownload && (
          <TimeSheetPDF
            milestoneEntryId={eData}
            close={() => this.setState({ isDownload: false })}
          />
        )} */}
        {proVisible && ( // if Project gets remove remove this
          <Modal
            title="Add Project"
            maskClosable={false}
            centered
            visible={proVisible}
            okButtonProps={{ disabled: loading }}
            okText={loading ? <LoadingOutlined /> : 'Add'}
            width={550}
            onCancel={() => {
              this.setState({ proVisible: false, sMilestone: {} });
            }}
            onOk={() => {
              const { data, sMilestone } = this.state;
              const findMilestone = data.findIndex(
                (el) => el.milestoneId === sMilestone.value
              );
              if (findMilestone >= 0) {
                message.error(
                  { content: 'Project TimeSheet is already created...!' },
                  5
                );
              } else {
                const findLeaveRequest = data.findIndex(
                  (el) => el.leaveRequest
                );
                const index =
                  findLeaveRequest === -1 ? data.length : findLeaveRequest;
                data.splice(index, 0, {
                  milestoneId: sMilestone.value,
                  project: sMilestone.label,
                  phase: true,
                });
              }
              this.setState({
                proVisible: false,
                data: [...data],
                sMilestone: {},
              });
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
                  onSelect={(value, option) => {
                    this.setState({
                      sMilestone: option,
                    });
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
