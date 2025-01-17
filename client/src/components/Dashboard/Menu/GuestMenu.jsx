import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from './/MenuItem'
import useRole from '../../../hooks/useRole'
import toast from 'react-hot-toast'
import { useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import HostRequestModal from '../../Modal/HostRequestModal'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const GuestMenu = () => {
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()

    const [role] = useRole()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const closeModal = () => {
        setIsModalOpen(false)
    }
    const handleModal = async () => {

        const currUser = {
            email: user?.email,
            role: 'guest',
            status: 'requested'
        }
        try {
            const { data } = await axiosSecure.put('/user', currUser);
            if (data.modifiedCount > 0) {
                toast.success("Wait for admin Approval")
            }
            else {
                toast.error("No changes made, please wait for approval.");
            }
            console.log(data);
        }
        catch (err) {
            console.error("Error in handleModal:", err);
        }
        finally {
            closeModal()
        }
    }
    return (
        <>
            <MenuItem
                icon={BsFingerprint}
                label='My Bookings'
                address='my-bookings'
            />


            {
                role === 'guest' && 
                <>
                    <div
                        onClick={() => { setIsModalOpen(true) }}
                        className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
                        <GrUserAdmin className='w-5 h-5' />

                        <span className='mx-4 font-medium'>Become A Host</span>
                    </div>

                    <HostRequestModal isOpen={isModalOpen} closeModal={closeModal} handleModal={handleModal} />
                </>

            }
        </>
    )
}

export default GuestMenu