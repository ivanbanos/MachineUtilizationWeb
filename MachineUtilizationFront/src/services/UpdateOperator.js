import configData from '../config.json'

const UpdateOperator = async (operator, name) => {
  try {
    const token = localStorage.getItem('token')
    operator.name = name
    operator.idUser = '00000000-0000-0000-0000-000000000000'
    operator.idClient = '00000000-0000-0000-0000-000000000000'
    const response = await fetch(configData.SERVER_URL + '/api/Operators', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(operator),
      headers: {
        'Access-Control-Allow-Origin': '*',
        accept: 'text/plain',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'sec-fetch-mode': 'cors',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'https://machineutilization.dbhaffnerna3.com',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
    })
    if (response.status == 200) {
      let operators = await response.json()
      return operators
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default UpdateOperator
