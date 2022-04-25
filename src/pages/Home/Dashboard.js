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
      }}
    >
      <span 
        style={{fontFamily: 'P-Grostek', letterSpacing: 2}}
      > 
        <Text >Welcome to </Text><Title >timewize</Title>
      </span>
    </div>
    )
  }
  
  export default Dashboard