import configData from '../config.json'

const DeleteMachine = async (machine) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(configData.SERVER_URL + '/api/Machines', {
      method: 'DELETE',
      mode: 'cors',
      body: JSON.stringify(machine),
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
      let machine = await response.json()
      return machine
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default DeleteMachine
