import React, { useEffect, useRef } from 'react'
import { Col, Descriptions, Row, Typography } from "antd"
import  {useReactToPrint}  from 'react-to-print';
const { Item } = Descriptions

const CertificatePdf = () =>{
    const componentRef = useRef();

    useEffect(() => {
        handlePrint()
    }, [])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `timesheet`,
        removeAfterPrint: true,
        // onAfterPrint: props.close()
    })

    
    return (
        <div style={{display: 'none'}}> 
            <div ref={componentRef}  style={{margin:'2mm 10mm 0mm 10mm', size: 'A4'   }}>
                {/* <Descriptions column={1} bordered size={"small"} style={{margin:'15px 0px'}} className="describe"> */}
                
                <Row justify="space-around">
                    <Col span={24} className="txt-center mb-40"><img src={'/onelm.png'} width="22   %" /></Col>
                    <Col span={24} className="txt-center">
                        <Typography.Title level={4}>MILESTONE ACCEPTANCE CERTIFICATE</Typography.Title> 
                    </Col>
                    <Col span={22}>
                        <Descriptions column={1} bordered className='certficate-describe right small' >
                                <Item label="Task" > [project name]</Item>
                                <Item label="Purchase Order Number" >[purchase order number]</Item>
                                <Item label="Purchase Order Date">[purchase order date]</Item>
                                <Item label="Milestone Number">[milestone number]</Item>
                                <Item label="Deliverable/s"  span={6} className="paragraph" >
                                    <p > [milestone description]  </p>
                                </Item>
                            </Descriptions>
                        </Col>
                    <Col span={24} className="txt-center">
                        <Typography.Title level={4}>ACCEPTANCE</Typography.Title> 
                    </Col>
                    <Col span={11}>
                        <Typography.Title level={5}>This Deliverable is offered to the Commonwealth:</Typography.Title> 
                        <Descriptions column={1} bordered className='certficate-describe large'>
                            <Item label="Signature" > </Item>
                            <Item label="Date" ></Item>
                        </Descriptions>
                    </Col>
                    <Col span={11}>
                        <Typography.Title level={5}>This deliverable is accepted on behalf of the Commonwealth:</Typography.Title> 
                        <Descriptions column={1} bordered className='certficate-describe large'>
                            <Item label="Signature" ></Item>
                            <Item label="Date" ></Item>
                        </Descriptions>
                    </Col>
                    <Col span={11}>
                        <Typography.Title level={5}>1LM Representative:</Typography.Title> 
                        <Descriptions column={1} bordered className='certficate-describe representative small'>
                            <Item label="Title and Name:" > </Item>
                            <Item label="Task Position:" ></Item>
                            <Item label="Telephone:" ></Item>
                            <Item label="Mobile:" ></Item>
                        </Descriptions>
                    </Col>
                    <Col span={11}>
                        <Typography.Title level={5}>Commonwealth Representative:</Typography.Title> 
                        <Descriptions column={1} bordered className='certficate-describe representative small'>
                            <Item label="Rank and Name:" > </Item>
                            <Item label="Position:" ></Item>
                            <Item label="Organisation:" ></Item>
                            <Item label="Address:" ></Item>
                            <Item label="Telephone:" ></Item>
                            <Item label="Email:" ></Item>
                        </Descriptions>
                    </Col>
                </Row>
            </div>
        </div>)
}

export default CertificatePdf