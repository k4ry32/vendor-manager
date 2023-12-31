import axios from 'axios';
import { useToast, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import SignForm from '@/components/signForm.js';

export default function SignInPage ({gradientOfTheDay}) {
    const toast = useToast();
    const router = useRouter();
    const [submitIsLoading, setSubmitIsLoading] = useState(false);


    const onSubmit = (data) => {
        Cookies.remove('auth_service');
        setSubmitIsLoading(true);
        
        axios.post('/api/login', data)
            .then(res => {
                const { user } = res.data;
                const { auth_service } = res.data.sessionCookie;

                localStorage.setItem('user', JSON.stringify(user));

                Cookies.set('auth_service', auth_service, {
                    expires: 0.5
                });

                router.push('/');
            })
            .catch(err => {

                console.error(err);

                toast({
                    position: 'top',
                    isClosable: true,
                    render: () => (
                        <Box bg={'#282828'} color={'white'} p={4} rounded={'xl'}>
                            Las credenciales no pertenecen a ningún usuario
                        </Box>
                    )
                })
            })
            .finally(e => setSubmitIsLoading(false));
    }

    return (
        <>
            <SignForm
                submitIsLoading={submitIsLoading}
                gradientOfTheDay={gradientOfTheDay}            
                onSubmit={onSubmit}
                signup={false}
            />
        </>
    )
}


export const getServerSideProps = async (ctx) => {
    const gradients = [
        `#418CB7,#FBDA61`,
        `#059E92,#32b49d,#51caa7,#70e0af,#8FF6B7 `,
        `#0A2A88,#59CDE9`,
        `#0093E9, #80D0C7`,
        `#C34F82, #2D294A`,
        `#418CB7,#FF8570`,
        `#4766f4,#b6f3c9`];

    const gradientOfTheDay = gradients[dayjs().format('d')];

    return {
        props: {
            gradientOfTheDay
        }
    }
}