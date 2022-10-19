import React, { useEffect, useRef, useState } from 'react'
import { Col, Descriptions, Row, Typography } from "antd"
import  {useReactToPrint}  from 'react-to-print';
import { milestoneActions } from '../../../service/Milestone-Apis';
import { formatDate } from '../../../service/constant';
const { Item } = Descriptions

const CertificatePdf = (props) =>{
    const [data, setData] = useState([])
    const componentRef = useRef();

    useEffect(() => {
            let crud = `/${props.mileId}/export`
            milestoneActions(crud).then(res=>{
                if (res.success){
                    setData(res.data)
                    // setDetail(res.milestoneInfo)
                    handlePrint()
                    props.close()
                }
            })        
    }, [])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Certificate`,
        removeAfterPrint: true,
        // onAfterPrint: props.close()
    })

    
    return (
        <div style={{display: 'none'}}> 
            <div ref={componentRef}  style={{margin:'2mm 10mm 0mm 10mm', size: 'A4'   }}>
                {/* <Descriptions column={1} bordered size={"small"} style={{margin:'15px 0px'}} className="describe"> */}
                
                <Row justify="space-around">
                    <Col span={24} className="txt-center mb-40 mt-10"><img src={'/z-cp-logo.png'} width="32%" /></Col>
                    <Col span={24} className="txt-center">
                        <Typography.Title level={4}>MILESTONE ACCEPTANCE CERTIFICATE</Typography.Title> 
                    </Col>
                    <Col span={22}>
                        <Descriptions column={1} bordered className='certficate-describe right small' >
                                <Item label="Task" >{data?.projectName}</Item>
                                <Item label="Purchase Order Number" >{data?.purchaseOrderNo?? '--'}</Item>
                                <Item label="Purchase Order Date">{data?.purchaseOrderDate ? formatDate(data?.purchaseOrderDate, true, true) : '--'}</Item>
                                <Item label="Milestone Name">{data?.milestoneName}</Item>
                                <Item label="Deliverable/s"  span={6} className="paragraph" >
                                    <Typography.Paragraph 
                                        ellipsis={{
                                            rows:6,
                                            expandable: false,
                                          }}
                                    >{data?.milestoneDesc}</Typography.Paragraph>
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
                        <Typography.Title level={5}>This deliverable is accepted on behalf of the ____________________</Typography.Title> 
                        <Descriptions column={1} bordered className='certficate-describe large'>
                            <Item label="Signature" ></Item>
                            <Item label="Date" ></Item>
                        </Descriptions>
                    </Col>
                    <Col span={11}>
                        <Typography.Title level={5}>Timewize Representative:</Typography.Title> 
                        <Descriptions column={1} bordered className='certficate-describe representative small'>
                            <Item label="Title and Name:" > </Item>
                            <Item label="Task Position:" ></Item>
                            <Item label="Telephone:" ></Item>
                            <Item label="Mobile:" ></Item>
                        </Descriptions>
                    </Col>
                    <Col span={11}>
                        <Typography.Title level={5}>______________ Representative:</Typography.Title> 
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