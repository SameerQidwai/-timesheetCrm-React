import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Typography, Table as Atable } from 'antd'
import Table, { FiltertagsNew, tableTitleFilter } from '../Table/TableFilter'
import { WorkforceData } from './WIHData'
import ReportsFilters from './ReportsFilters'
import { getWorkforceSkills } from '../../../service/reports-Apis'
import { localStore } from '../../../service/constant'

const {Title, Text} = Typography


function WorkforceSkills() {
    const [data, setData] = useState([])
    const [page, setPage] = useState({pNo:1, pSize: localStore().pageSize})
    const [visible, setVisible] = useState(false)
    const [tags, setTags] = useState({})

    const columns = [
        {
            key: 'skill',
            dataIndex: 'skill',
            title: 'Skill',
            width: '25%',
            render:(text, record, index)=> {
                let { pNo, pSize } = page
                let dataSourceIndex = ((pNo - 1) * pSize + index)
                return (text === data?.[dataSourceIndex-1 ]?.['skill'] && index) ? '' : text
            }
        },
        {
            key: 'skillLevel',
            dataIndex: 'skillLevel',
            title: 'Skill Level',
            render:(text, record, index)=> {
                let { pNo, pSize } = page
                let dataSourceIndex = ((pNo - 1) * pSize + index)
                return (text === data?.[dataSourceIndex-1 ]?.['level'] && index)  ? '' : text
            }
        },
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Resource Name'
        },
        {
            key: 'type',
            dataIndex: 'type',
            title: 'Resource Type'
        },
        {
            key: 'buyRate',
            dataIndex: 'buyRate',
            title: 'Buy Rate'
        },
    ]
    
    useEffect(() => {
        getData()
    }, [])

    const getData = (queryParam, tagsValues) =>{
        getWorkforceSkills(queryParam).then(res=>{
            if (res.success){
                setData(res.data)
                if(queryParam){
                  setVisible(false)
                  setTags(tagsValues)
                }
            }
        })
    }

    const tableTitle = () => {
      return (
        <Row justify="space-between">
          <Col>
            <Title level={5}>Workforce Skill </Title>
          </Col>
          <Col>
            <Button size="small" onClick={() => setVisible(true)}>
              Filters
            </Button>
          </Col>
          <Col span={24}>
            <FiltertagsNew
              filters={tags}
              filterFunction={() => {
                setTags({});
                getData();
              }}
            />
          </Col>
        </Row>
      );
    };
    
    return (
        <Row>
            <Col span={24}>
                <Table
                    title={()=>tableTitle()}
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: false,
                        onChange:(pNo, pSize)=> {
                            setPage({pNo, pSize})
                        }
                    }}
                    dataSource={data}
                />
            </Col>
            {/* <ReportsFilters
                compName={'Workforce Skill Filter'}
                compKey={'resources'}
                tags={tags}
                visible={visible}
                getCompData={getData}
                invisible={()=>setVisible(false)} 
            />*/}
        </Row>
    )
}

export default WorkforceSkills