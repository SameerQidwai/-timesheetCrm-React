import React, {Component} from 'react'
import {Row, Col, Typography } from 'antd'

import Form from '../../../components/Form'

const { Title } = Typography

class SkillTable extends Component {
    constructor(props){
        super(props);
        this.dynamoForm = React.createRef();
        this.state= {
            FormFields: {
                formId: 'time_off',
                justify : 'center',
                FormCol: 15,
                FieldSpace: { xs: 12, sm: 16, md: 122},
                layout: {labelCol: { span: 12 }},
                justifyField:'center',
                // FormLayout:'inline', 
                size: 'middle',
                fields:[
                    {
                        object:'obj',
                        filedCol:20,
                        layout:  {labelCol: { span: 4 },
                        wrapperCol: { span: 0 }},
                        key: 'name',
                        label:'Name',
                        size:'small',
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                    },
                ],
            }
        }
    }

    componentDidMount = () =>{
        console.log(this.props.data)
    }

    render () {
        const data = this.props.data
        return (
            data.map((item,j) => (
                <Row key={j}>
                    <Title>{item.skill}</Title>
                    <Row>
                        <Col>level</Col>
                        <Col>celi 1</Col>
                        <Col>celi 2</Col>
                    </Row>
                    <Form ref={this.dynamoForm} Callback={this.Callback} FormFields = {this.state.FormFields} />   
                </Row>
            ))
        )
    }
}

export default SkillTable