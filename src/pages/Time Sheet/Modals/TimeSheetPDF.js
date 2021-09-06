import React, {useEffect, useRef, useState} from 'react';
import  {useReactToPrint}  from 'react-to-print';
import { Typography, Row, Col, Descriptions, Table } from "antd";
import '../../styles/pdf.css'
import { getPdf } from '../../../service/timesheet';
import logoImage from './onelm.png'
const Item = Descriptions

const TimeSheetPDF = (props) => {
    const componentRef = useRef();

    const [data, setData] = useState([])
    const [details, setDetail] = useState({})
    const column = [
        {
            title:'Date',
            dataIndex: 'date',
            align: 'center'
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            children:[
                {
                    title: 'Day',
                    dataIndex: 'day',
                    align: 'center',
                },
                {
                    title: 'Start',
                    dataIndex: 'startTime',
                    align: 'center'
                },
                {
                    title: 'Finish',
                    dataIndex: 'endTime',
                    align: 'center'
                },
            ]
        },
        {
            title: 'Breaks',
            dataIndex: 'breaks',
            children:[
                {
                    title: 'Minutes',
                    dataIndex: 'breakMinutes',
                    align: 'center'
                },
            ]
        },
        {
            title: 'Daily Total',
            dataIndex: 'actualHours',
            align: 'center'
        },
        {
            title: 'Comments',
            dataIndex: 'notes',
            align: 'center'
        }
    ]

    useEffect(() => {
        getProjectEntry()
    }, [])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const getProjectEntry = () =>{
        getPdf(1).then(res=>{
            if(res.success){
                setData(res.entries)
                setDetail(res.projectInfo)
                handlePrint()
                props.close()
            }
        })
    }

    return (
        // style={{display: 'none'}}
        <div style={{display: 'none'}}>
            {/* {handlePrint()} */}
            {/* style={{marginLeft:10,marginRight:10}} */}
            <div ref={componentRef}  style={{marginLeft:10,marginRight:10}}>
                <div style={{textAlign:'center'}}><p style={{color: '#ff0000'}}>Sensitive: Personal (after first entry)</p></div>
                <Row justify="space-between" align="middle" >
                    <Col ><Typography.Title  >Timesheet </Typography.Title></Col>
                    <Col style={{width: '60%', textAlign: 'right'}}><img src={logoImage} width="20%" /></Col>
                </Row>
                <Row>
                    {details &&<Descriptions column={1} bordered size={"small"} style={{marginBottom:35}}>
                        <Item label="Company" > {details.company}</Item>
                        <Item label="Employee" >{details.employee}</Item>
                        <Item label="Client"> {details.client}</Item>
                        <Item label="Project" >{details.project}</Item>
                        <Item label="Client Contact" >{details.contact}</Item>
                        <Item label="Timesheet Period " >{details.period}</Item>
                    </Descriptions>}
                </Row>
                <Table 
                    bordered 
                    size="small"
                    pagination={false} 
                    columns={column} 
                    dataSource={data} 
                />
                <Descriptions column={3} bordered  style={{marginBottom:20, marginTop:35}}>
                    <Item label="Hours in Day "> 8 </Item>
                    <Item label="Total Hours ">{details.totalHours} </Item>
                    <Item label="Invoiced Days ">{details.invoicedDays}</Item>
                </Descriptions>
                <Row justify="space-between">
                    <Col span={8}>Employee Declaration</Col>
                    <Col span={8}>Manager Approval</Col>
                </Row>
                <Row justify="space-between" >
                    {/* <Col span={8} style={{border: 'solid black 1px', minHeight:35}}></Col> */}
                    <Col span={8} style={{backgroundColor:'#deeaf6', minHeight:35}}></Col>
                    <Col span={8} style={{backgroundColor:'#deeaf6', minHeight:35}}></Col>
                </Row>
                <Row justify="space-between">
                    <Col span={4}>Signature</Col>
                    <Col span={2}>Date</Col>
                    <Col span={4}></Col>
                    <Col span={4}>Signature</Col>
                    <Col span={2}>Date</Col>
                </Row>
                <div style={{textAlign:'center', marginTop: 100}}><p style={{color: '#ff0000'}}>Sensitive: Personal (after first entry)</p></div>
            </div>
        </div>
    )
}
export default TimeSheetPDF