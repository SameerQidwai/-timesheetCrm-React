import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableSorter } from '../Table/TableFilter'
import { getProjectRevenueAnalysis } from '../../../service/reports-Apis'
import ReportsFilters, { _createQuery } from './ReportsFilters'
import { formatCurrency } from '../../../service/constant'



function ProjectRevenueAnalyis() {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
      getData()
  }, [])

  const getData = (queryParam, tagsValues) =>{
    setLoading(true)
    getProjectRevenueAnalysis(queryParam).then(res=>{
      if (res.success){
        console.log(res.data)
        // setData(res.data)
        // if(queryParam){
        //   setVisible(false)
        //   setTags(tagsValues)
        // }
      }
      setLoading(false)
    })
  }

  
  return (
    <div>
      Sameer
    </div>
  );
}

export default ProjectRevenueAnalyis