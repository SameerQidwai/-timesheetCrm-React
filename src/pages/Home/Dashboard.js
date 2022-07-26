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
        backgroundImage: `url(${"/Z_Landing.png"})`,
      }}
    >
      {/* <span className="p-grostek ls5" > 
        <Text >Welcome to </Text><Title className='ls10'>timewize</Title>
      </span> */}
    </div>
    )
  }
  
  export default Dashboard