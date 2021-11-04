import React, { useState } from 'react'
import { Redirect } from "react-router-dom"; // Route Library
import { Modal, Statistic, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons"; //Icons

const { Countdown } = Statistic

function ActivityCounter(props) {
    const [ logout, setLogout ] = useState(false)
    const timeRemain = 60*60*1000 - (new Date().getTime() - parseInt(localStorage.getItem('jwtTimer'))) 

    const loggingOut = () =>{
        message.loading({ content: 'Loading...', key: 'logout' })
        localStorage.clear();
        message.info({ content: 'Logout successfully!', key: 'logout' })
        setLogout(true)

    }

    const countDownFinish = () =>{
        localStorage.setItem('jwtExpired', true)
        props.timeOut()
    }

    return (
        <div>
            <Modal
            destroyOnClose
            closable={false}
            keyboard={false}
            maskClosable={false}
            centered
            visible={props.visible}
            okText={"Refresh"}
            onOk={()=> props.refresh()}
            cancelText={"Logout Now"}
            onCancel={()=> loggingOut()}
            >
                <ExclamationCircleOutlined/> Logging out in 
                <Countdown
                    onFinish={countDownFinish} 
                    value={Date.now() + timeRemain}
                    // value={Date.now() + 10000 } 
                    format="mm:ss" 
                    style={{textAlign: "center"}} valueStyle={{color: "red"}} 
                    />
            </Modal>
            {logout && <Redirect to={{ pathname: '/'}} /> }
        </div>
    )
}

export default ActivityCounter
