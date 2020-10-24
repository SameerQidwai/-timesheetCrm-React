import axios from 'axios'

const url = '/api/calender'


export const getList = () => {
    console.log('get calender')
    return axios.get(url, {
        headers: {
            'Content-Type': 'application/json'
            // 'Authorization':token
        }
        })
        .then(res => {
            res.data.status = 'success'
            return res.data
        }).catch(err => {
            return {
                error:'Please login again!',
                status:'failed',
                message:err.message
            }
    })
}

export const addToList = task => {
    return axios.post(url,
        {
            title: task.title,
          status: task.status,
        },
        {
          headers: { 
              'Content-Type': 'application/json'
            //   'Authorization':task.token 
          }
        }
      )
      .then(function(response) {
          return response.data;
      }).catch(err => {
          return {
              error:'Error to add',
              status:'failed',
              message:err.message
          }
      })
}