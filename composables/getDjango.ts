export const loadMarkers = () => {
  const bar = ref([])

  const getMapMarkers = async () => {
    try {
      bar.value = await useFetch('http://localhost:8000/api/map/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'no-cors',
          },
      })
    } catch (error) {
      console.log("ERROR DAMIR")
    }
  }

  return { bar, getMapMarkers }
}
