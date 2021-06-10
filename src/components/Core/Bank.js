import React, { Component } from "react";
import { Descriptions } from "antd";
const { Item } = Descriptions;
class Bank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.bank ?? {}
        };
    }
    componentDidMount = () => {
        console.log("Bank", this.state.data, this.props);
    };
    render() {
        const { data } = this.state;
        // data.title = this.props.title;
        return (
            <Descriptions
                title="Bank Account Detail"
                size="small"
                bordered
                layout="horizontal"
                // extra={<Button type="primary">Edit</Button>}
            >
                {/* <Item label="Account Title">{data.title}</Item> */}
                <Item label="Bank Account Name">{data.bankName} </Item>
                <Item label="Account Number">{data.bankAccountNo} </Item>
                <Item label="BSB">{data.bankBsb}</Item>
            </Descriptions>
        );
    }
}

export default Bank;
