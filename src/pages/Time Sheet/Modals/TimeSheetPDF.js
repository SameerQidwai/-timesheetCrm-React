import React, {useEffect, useRef, useState} from 'react';
import  {useReactToPrint}  from 'react-to-print';
import { Typography, Row, Col, Descriptions, Table, Button } from "antd";
import { getPdf } from '../../../service/timesheet';
import '../../styles/pdf.css'
// import logoImage from './icons/onelm.png'
const Item = Descriptions

const TimeSheetPDF = (props) => {
    const componentRef = useRef();

    const [data, setData] = useState([])
    const [details, setDetail] = useState({})
    const column = [
        {
            title:'Date',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            width: 50
            
        },
        {
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
            align: 'center',
            width: 50
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours',
            width: 80,
            children:[
                {
                    title: 'Start',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    align: 'center',
                    width: 40,
                },
                {
                    title: 'Finish',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    align: 'center',
                    width: 40,
                },
            ]
        },
        {
            title: <span>Breaks <br/> <span style={{fontSize: 9}}>minutes</span></span>,
            dataIndex: 'breakMinutes',
            key: 'breakMinutes',
            align: 'center',
            width: 40
        },
        {
            title: <span>Daily <br/> Total <span style={{fontSize: 9}}>hours</span></span>,
            dataIndex: 'actualHours',
            key: 'actualHours',
            align: 'center',
            width: 40
        },
        {
            title: 'Comments',
            dataIndex: 'notes',
            key: 'notes',
            align: 'center',
            render: (value)=> value && <Typography.Text ellipsis>{value}</Typography.Text>
        }
    ]
    
    
    useEffect(() => {
        getProjectEntry()
    }, [])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `timesheet`,
        removeAfterPrint: true,
    })

    const getProjectEntry = () =>{
        
        getPdf(props.milestoneEntryId).then(res=>{
            if(res.success){
                setData(res.entries)
                setDetail(res.milestoneInfo)
                handlePrint()
                // props.close()
            }
        })
        return true
    }

    return (
        // style={{display: 'none'}}
        <div style={{display: 'none'}}>
            {/* {handlePrint()} */}
            {/* style={{marginLeft:10,marginRight:10}} */}
            <div ref={componentRef}  style={{margin:'0mm 10mm' }}>
                <div style={{textAlign:'center'}}><p style={{color: '#ff0000'}}>Sensitive: Personal (after first entry)</p></div>
                <Row justify="space-between" align="middle" >
                    <Col ><Typography.Title > Timesheet </Typography.Title></Col>
                    <Col style={{width: '60%', textAlign: 'right'}}><img src={'/onelm.png'} width="35%" /></Col>
                </Row>
                <Row>
                    {details &&<Descriptions column={1} bordered size={"small"} style={{marginBottom:35}} className="describe">
                        <Item label="Company" > {details.company}</Item>
                        <Item label="Employee" >{details.employee}</Item>
                        <Item label="Client"> {details.client}</Item>
                        <Item label="Project" >{details.project}</Item>
                        <Item label="Client Contact" >{details.contact}</Item>
                        <Item label="Timesheet Period " >{details.period}</Item>
                    </Descriptions>}
                </Row>
                <Table 
                    rowClassName={(record) => (record.day==='Sunday' ||record.day==='Saturday')? 'weekendClass' :'weekClass'}
                    className='cellSize'
                    rowKey={(data) => data.id}
                    bordered 
                    size="small"
                    pagination={false} 
                    columns={column} 
                    dataSource={data}
                    style={{fontSize: '10px'}}
                />
                <Descriptions column={3} bordered  style={{marginBottom:20, marginTop:35}}>
                    <Item label="Hours in Day "> 8.00 </Item>
                    <Item label="Total Hours ">{details.totalHours} </Item>
                    <Item label="Invoiced Days ">{details.invoicedDays}</Item>
                </Descriptions>
                <Row justify="space-between">
                    <Col span={11}>Employee Declaration</Col>
                    <Col span={11}>Manager Approval</Col>
                </Row>
                <Row justify="space-between" >
                    {/* <Col span={8} style={{border: 'solid black 1px', minHeight:35}}></Col> */}
                    <Col span={11} style={{backgroundColor:'#deeaf6', minHeight:35}}></Col>
                    <Col span={11} style={{backgroundColor:'#deeaf6', minHeight:35}}></Col>
                </Row>
                <Row justify="space-between">
                    <Col span={6}>Signature</Col>
                    <Col span={5}>Date</Col>
                    <Col span={2}></Col>
                    <Col span={6}>Signature</Col>
                    <Col span={5}>Date</Col>
                </Row>
                <div style={{textAlign:'center', marginTop: 60 }}><p style={{color: '#ff0000'}}>Sensitive: Personal (after first entry)</p></div>
            </div>
        </div>
    )
}
export default TimeSheetPDF