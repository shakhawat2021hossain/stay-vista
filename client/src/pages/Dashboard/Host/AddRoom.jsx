import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imgUpload } from "../../../api/utilities";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const AddRoom = () => {
    const navigate = useNavigate()
    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()

    const [loading, setLoading] = useState(false)
    const [imgPreview, setImgPreview] = useState()
    const [imgText, setImgText] = useState("Upload Image")
    const [dates, setDates] = useState(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    );

    const {mutateAsync} = useMutation({
        mutationFn: async (roomData) =>{
            const {data} = await axiosSecure.post('/rooms', roomData)
            return data
        },
        onSuccess: () =>{
            console.log("data sended successfully");
            toast.success("data sended successfully")
            setLoading(false)
        }
    })

    const handleDates = item => {
        setDates(item.selection);
        // console.log(item);
    }

    
    const handleSubmit = async (e) =>{
        setLoading(true)
        e.preventDefault()
        const form = e.target;
        const to = dates.startDate
        const from = dates.endDate
        const location = form.location.value;
        const title = form.title.value;
        const price = form.price.value;
        const guest = form.guest.value;
        const category = form.category.value;
        const bedrooms = form.bedrooms.value;
        const bathrooms = form.bathrooms.value;
        const image = form.image.files[0]
        const host = {
            name: user?.displayName,
            email: user?.email,
            photo: user?.photoURL
        }

        
        try{
            const imgURL = await imgUpload(image);
            const roomData = {
                location, to, from, title, price, guest, category, bedrooms, bathrooms, host, image: imgURL
            }
            // console.table(roomData);
            await mutateAsync(roomData)
            navigate('/')


            // const {data} = await axiosSecure.post('/rooms', roomData)
            // console.log(data);
        }
        catch(err){
            console.log(err);
            setLoading(false)
        }
        
    }
    
    const handleIMG = (image) =>{
        setImgPreview(URL.createObjectURL(image))
        setImgText(image.name)
    }
    
    return (
        <div className="">
            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>
            {/* <h1 className='text-center text-4xl'>Add Room</h1> */}
            <AddRoomForm handleDates={handleDates} dates={dates} handleSubmit={handleSubmit} imgPreview={imgPreview} imgText={imgText} setImgText={setImgText} handleIMG={handleIMG} loading={loading}/>
        </div>
    );
};

export default AddRoom;