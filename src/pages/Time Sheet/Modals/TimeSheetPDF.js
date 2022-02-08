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
        // onAfterPrint: props.close()
    })

    const getProjectEntry = () =>{
        console.log(props);
        const data = {milestoneEntryIds: props.milestoneEntryId}
        console.log(data);
        getPdf(data).then(res=>{
            if(res.success){
                setData(res.data)
                // setDetail(res.milestoneInfo)
                handlePrint()
                props.close()
            }
        })
        return true
    }

    return (
        // style={{display: 'none'}}
        <div style={{display: 'none'}}>
        {/* <div> */}
            {/* {console.log('I was here')} */}
            {/* {handlePrint()} */}
            {/* style={{marginLeft:10,marginRight:10}} */}
            <div ref={componentRef}  style={{margin:'2mm 10mm 0mm 10mm', size: 'A4'   }}>
                {data.map((details, index) => {
                    return <div >
                        <div className='sensitive'><p >Sensitive: Personal (after first entry)</p></div>
                            <Row justify="space-between" align="middle" >
                                <Col ><Typography.Title > Timesheet </Typography.Title></Col>
                                <Col style={{width: '60%', textAlign: 'right'}}><img src={'/onelm.png'} width="35%" /></Col>
                            </Row>
                            <Row>
                                {details &&<Descriptions column={2} bordered size={"small"} style={{margin:'15px 0px'}} className="describe">
                                    <Item label="Company" > {details.company}</Item>
                                    <Item label="Employee" >{details.employee}</Item>
                                    <Item label="Client" span={2}> {details.milestone  && details.milestone.client}</Item>
                                    <Item label="Project" span={2}>{details.milestone  && details.milestone.name}</Item>
                                    <Item label="Client Contact" >{details.milestone  && details.milestone.contact}</Item>
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
                                dataSource={details.milestone && details.milestone.entries}
                                style={{fontSize: '10px'}}
                            />
                            <Descriptions column={3} bordered  style={{marginBottom:20, marginTop:20}} labelStyle={{padding: 5}} >
                                <Item label="Hours in Day ">{details.milestone && parseFloat(details.milestone.hoursPerDay).toFixed( 2 ) }</Item>
                                <Item label="Total Hours "> {details.milestone && parseFloat(details.milestone.totalHours).toFixed( 2 )} </Item>
                                <Item label="Invoiced Days ">{details.milestone && parseFloat(details.milestone.invoicedDays).toFixed( 2 )}</Item>
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
                            <div  className='sensitive b-sensitive' >
                                <p >Sensitive: Personal (after first entry)</p></div>
                        </div>
                    })}
                </div>
        </div>
    )
}
export default TimeSheetPDF