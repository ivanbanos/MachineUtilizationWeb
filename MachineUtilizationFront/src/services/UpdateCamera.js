import configData from '../config.json'

const UpdateCamera = async (camera, newName) => {
  try {
    const token = localStorage.getItem('token')
    camera.name = newName
    const response = await fetch(configData.SERVER_URL + '/api/Cameras', {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(camera),
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

export default UpdateCamera
