import configData from '../config.json'
import { v4 as uuidv4 } from 'uuid'

const AddCamera = async (cameraName, cameraUser, cameraPassword, idMachine) => {
  try {
    const token = localStorage.getItem('token')
    const guid = uuidv4()
    console.log()
    const body = {
      name: cameraName,
      idMachine: idMachine,
      user: cameraUser,
      password: cameraPassword,
      guid: guid,
      state: 1,
    }
    const response = await fetch(configData.SERVER_URL + '/api/Cameras/createCamera', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
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
      let cameras = await response.json()
      return cameras
    }
    if (response.status == 403) {
      return 'fail'
    }
    return 'fail'
  } catch (error) {
    return 'fail'
  }
}

export default AddCamera
