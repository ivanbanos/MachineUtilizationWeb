import configData from '../config.json'

const UpdateMachine = async (machine, name) => {
  try {
    const token = localStorage.getItem('token')
    machine.name = name
    const response = await fetch(configData.SERVER_URL + '/api/Machines', {
      method: 'PUT',
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
      let machines = await response.json()
      return machines
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default UpdateMachine
