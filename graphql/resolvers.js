
const url = process.env.NEXT_PUBLIC_URL


const resolvers = {
    Query: {
      GetPlaces: async () => {
        try {
          const response = await fetch(url)
          const data = await response.json()
  
          return data.mfb_shipping_tracker_places.map(u => {
            return {
              place: u.value
            }
          })
        } catch (error) {
          throw new Error("Something went wrong")
        }
      },
    }
  }
  
  export default resolvers

