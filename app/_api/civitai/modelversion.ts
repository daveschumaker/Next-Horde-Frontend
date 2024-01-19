export const fetchModelVersion = async (id: number) => {
  try {
    const res = await fetch(`https://civitai.com/api/v1/model-versions/${id}`)
    const data = await res.json()

    return data
  } catch (err) {
    return false
  }
}
