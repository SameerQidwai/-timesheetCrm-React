import React, { Component } from "react";
import { Calendar, Badge, Popover } from "antd";
import "../Styles/Calender.css";

class Test extends Component {
    getListData = (value) => {
        let listData;
        switch (value.date()) {
            case 8:
                listData = [
                    {
                        type: "warning",
                        content: "This is warning event.",
                        dec: "Description: This is warning event.",
                    },
                    {
                        type: "success",
                        content: "This is usual event.",
                        dec: "Description: This is warning event.",
                    },
                ];
                break;
            case 10:
                listData = [
                    {
                        type: "warning",
                        content: "This is warning event.",
                        dec: "Description: This is warning event.",
                    },
                    {
                        type: "success",
                        content: "This is usual event.",
                        dec: "Description: This is usual event.",
                    },
                    {
                        type: "error",
                        content: "This is error event.",
                        dec: "Description: TThis is error event.",
                    },
                ];
                break;
            case 15:
                listData = [
                    {
                        type: "warning",
                        content: "This is warning event",
                        dec: "Description: TThis is error event.",
                    },
                    {
                        type: "success",
                        content: "This is very long usual event。。....",
                        dec:
                            "ou can’t write good content for a website without knowing why you’re writing it.Is the website content selling a product? Is it meant to attract new clients? Is it building traffic to support advertising and sponsorships? Once you know the main goal of the website content you’re producing, you’ll be better positioned to write copy that will help achieve that goal.But before you even write one word of content for a website, know who you’re writing it for.",
                    },
                    {
                        type: "error",
                        content: "This is error event 1.",
                        dec: "Description: This is error event 1.",
                    },
                    {
                        type: "error",
                        content: "This is error event 2.",
                        dec: "Description: This is error event 2.",
                    },
                    {
                        type: "error",
                        content: "This is error event 3.",
                        dec: "Description: TThis is error event 3.",
                    },
                    {
                        type: "error",
                        content: "This is error event 4.",
                        dec: "Description: TThis is error event 4.",
                    },
                ];
                break;
            default:
        }
        return listData || [];
    };

    popover = (item) => {
        return (
            <div>
                <p>
                    <b>Detail: </b>
                    {item.content}
                </p>
                <p>
                    <b>Description: </b>
                    {item.dec}
                </p>
            </div>
        );
    };

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Popover content={this.popover(item)} title={item.type}>
                            <span>
                                <Badge status={item.type} text={item.content} />
                            </span>
                        </Popover>
                    </li>
                ))}
            </ul>
        );
    };

    getMonthData = (value) => {
        if (value.month() === 8) {
            return 1394;
        }
    };

    monthCellRender = (value) => {
        const num = this.getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    render() {
        return (
            <Calendar
                dateCellRender={this.dateCellRender}
                monthCellRender={this.monthCellRender}
            />
        );
    }
}

export default Test;
