import axios from "axios";

export const imgUpload = async (image) => {
    const formData = new FormData()
    formData.append('image', image);
    const { data } = await axios.post('https://api.imgbb.com/1/upload?key=37c60d712bf322e97597883e93903d85', formData)
    const url = data.data.url
    // console.log(url);
    return url

}