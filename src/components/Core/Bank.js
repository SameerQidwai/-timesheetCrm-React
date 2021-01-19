import React, { Component } from "react";
import { Descriptions } from "antd";
const { Item } = Descriptions;
class Bank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                // title: "Musab",
                // bank: "Bank of United",
                // acc_no: "BOU7XXXXXXXXX",
                // bsb: "",
            },
        };
    }
    componentDidMount = () => {
        console.log("Bank", this.props);
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
                <Item label="Account Title">{data.title}</Item>
                <Item label="Bank Name">{data.bank} </Item>
                <Item label="Account Number">{data.acc_no} </Item>
                <Item label="BSB">{data.bsb}</Item>
            </Descriptions>
        );
    }
}

export default Bank;
