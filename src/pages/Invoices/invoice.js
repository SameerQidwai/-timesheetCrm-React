import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Button, Form } from 'antd';
import { createInvoice, toolLogin } from '../../service/invoice-Apis';


const Invoice = (props) => {
  
  return (
   <Row justify="center" align="middle">
    <Col>
        {/* <Button type="primary" onClick={()=>toolLogin()}>Login to Xero</Button> */}
    </Col>
   </Row>
  );
}

export default Invoice;
