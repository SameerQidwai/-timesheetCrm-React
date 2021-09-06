import React, {useRef} from 'react';
import  {useReactToPrint}  from 'react-to-print';
import { Typography, Row, Col, Descriptions, Table } from "antd";
import '../Styles/pdf.css'
const Item = Descriptions

const TimeSheetHTML = () => {
    const componentRef = useRef();
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
                    align: 'center'
                },
                {
                    title: 'Start',
                    dataIndex: 'start',
                    align: 'center'
                },
                {
                    title: 'Finish',
                    dataIndex: 'finish',
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
                    dataIndex: 'min',
                    align: 'center'
                },
            ]
        },
        {
            title: 'Daily Total',
            dataIndex: 'daily',
            align: 'center'
        },
        {
            title: 'Comments',
            align: 'center'
        }
    ]
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });

    return (
        // style={{display: 'none'}}
        <div >
            {handlePrint()}
            <div ref={componentRef} style={{margin: 10}}>
                <div style={{textAlign:'center'}}><p style={{color: '#ff0000'}}>Sensitive: Personal (after first entry)</p></div>
                <Row >
                    <Col style={{width: '40%'}}><Typography.Title  >Timesheet </Typography.Title></Col>
                    <Col style={{width: '60%', textAlign: 'right'}}>
                        <span ><img src='onelm.png' width="20%" /></span>
                    </Col>
                </Row>
                <div style={style.antDesView}>
                    <table style={style.antDesTab}>
                        <tr style={style.antDesBor}>
                            <th style={style.antDesLab}>Company</th>
                            <td style={style.antDesCon}>1LM Pty Ltd</td>
                        </tr>
                        <tr style={style.antDesBor}>
                            <th style={style.antDesLab}>Employee</th>
                            <td style={style.antDesCon}>Joel Deans </td>
                        </tr>
                        <tr style={style.antDesBor}>
                            <th style={style.antDesLab}>Client</th>
                            <td style={style.antDesCon}>Army HQ </td>
                        </tr>
                        <tr style={style.antDesBor}>
                            <th style={style.antDesLab}>Project</th>
                            <td style={style.antDesCon}>Land 135</td>
                        </tr>
                        <tr style={style.antDesBor}>
                            <th style={style.antDesLab}>Client Contact</th>
                            <td style={style.antDesCon}>MAJ Rachael Ayoub </td>
                        </tr>
                        <tr style={style.antDesBor}>
                            <th style={style.antDesLab}>Timesheet Period </th>
                            <td style={style.antDesCon}>1/06/2021 - 30/06/2021</td>
                        </tr>
                    </table>
                </div>
                <table style={{width: '100%'}}>
                <colgroup></colgroup>
                    <tr>
                        <th>Date</th>
                        <th>
                            <div> Hours </div>
                            <div>
                                <table style={{width: '100%'}}>
                                    <tr>
                                        <th>Day</th>
                                        <th>Start</th>
                                        <th>Finish</th>
                                    </tr>
                                </table>
                            </div>
                        </th>
                        <th>
                            <div> Breaks </div>
                            <div> Minutes </div>
                        </th>
                        <th>Daily Total</th>
                        <th>Comments</th>
                    </tr>
                </table>
                <div>
                    <table style={{width: '100%'}}>
                        <tr>
                            <th>Hours in Day </th> <td>8</td>
                            <th>Total Hours</th> <td>x.x hours</td>
                            <th>Invoiced Days</th> <td>x.x days</td>
                        </tr>
                    </table>
                </div>
                <Row justify="space-between">
                    <Col span={8}>Employee Declaration</Col>
                    <Col span={8}>Manager Approval</Col>
                </Row>
                <Row justify="space-between" >
                    <Col span={8} style={{border: 'solid black 1px', minHeight:35}}></Col>
                    <Col span={8} style={{border: 'solid black 1px', minHeight:35}}></Col>
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
export default TimeSheetHTML


const style ={
    antDesView: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
    },
    antDesBor:{
        border: '1px solid #f0f0f0',
    },
    antDesTab: {
        borderSpacing: 2,
        textIndent: 0,
        order: '1px solid #f0f0f0',
        borderCollapse: 'collapse',
    },
    antDesLab: {
        backgroundColor: '#fafafa',
        borderRight: '1px solid #f0f0f0',
        fontWeight: 'bolder',
        color: 'rgba(0, 0, 0, 0.85)',
        fontSize: 14,
        lineHeight: 1.5715,
        textAlign: 'start',
        boxSizing: 'border-box',
        display: 'table-cell',
        verticalAlign: 'inherit',
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 8,
        paddingLeft: 16,
    },
    antDesCon: {
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 8,
        paddingLeft: 16,
        display: 'table-cell',
        boxSizing: 'border-box',
        flex: '1 1',
        color: 'rgba(0, 0, 0, 0.85)',
        fontSize: 14,
        lineHeight: 1.5715,
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
    },
    antTable: {

    }
}