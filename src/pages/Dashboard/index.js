import React from 'react'
import { Image, Typography } from 'antd'
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import '../styles/dashboard.css'
const { Text, Title } = Typography
function Dashboard() {
  return (
    <div 
      className='landing-placeholder'
      style={{
        backgroundImage: `url(${"/TW_Landing.png"})`,
        backgroundPosition: 'center',
        backgroundSize: "contain",
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'right'
      }}
    >
      <Text >Welcome to </Text><Title >timewize</Title>
    </div>
    )
  }
  
  export default Dashboard