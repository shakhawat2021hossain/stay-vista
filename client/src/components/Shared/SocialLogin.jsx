import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SocialLogin = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location?.state
    // console.log(from);

    const {signInWithGoogle} = useAuth()
    const handleGoogleLogin = () =>{
        try{
            signInWithGoogle()
            .then(result => {
                console.log(result.user);
                navigate(from || '/')
                toast.success('Successfully Logged In')
            })
        }
        catch(err){
            console.log(err);
        }

    }

    return (
        <div onClick={handleGoogleLogin} className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer'>
            <FcGoogle size={32} />

            <p>Continue with Google</p>
        </div>
    );
};

export default SocialLogin;