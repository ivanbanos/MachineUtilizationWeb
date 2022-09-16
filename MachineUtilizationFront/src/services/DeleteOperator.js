import configData from '../config.json'

const DeleteOperator = async (operator) => {
  try {
    const token = localStorage.getItem('token')
    operator.idUser = '00000000-0000-0000-0000-000000000000'
    operator.idClient = '00000000-0000-0000-0000-000000000000'
    const response = await fetch(configData.SERVER_URL + '/api/Operators', {
      method: 'DELETE',
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
      let operator = await response.json()
      return operator
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default DeleteOperator
