import { GetServerSideProps } from 'next'
import { useState } from 'react'
import styles from './styles.module.scss'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import firebase from '../../services/firevaseConnction'
import imgRocker from '../../../public/images/rocket.svg' 
import Image from 'next/image'

import { PayPalButtons } from '@paypal/react-paypal-js'
//clientId AdBOXnpRc24_UgbghMHuE5mc7vPEj5K2EwYcIkT9QKKMUWrRL9lcTtPgoxU5l4oAPt2W8HRK2dfC4lh2
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&components=YOUR_COMPONENTS"></script>
interface DonateProps {
    user: {
        nome: string;
        email: string;
        image: string;
    }
}

export default function Donate({ user }: DonateProps) {
    const [vip, setVip] = useState(false);

    async function handleSaveDonate() {
        await firebase.firestore().collection('users')
        .doc(user.email)
        .set({
            donate: true,
            lastDonate: new Date(),
            image: user.image
        })
        .then(() => {
            setVip(true);
        })
    }

    return (
        <>
            <Head>
                <title>Ajude a plataforma board ficar online</title>
            </Head>
            <main className={styles.conteiner}>
                <Image src={imgRocker} alt="Seja apoidor" />

                { vip && (
                    <div className={styles.vip}>
                        <Image src={user.image} alt="foto de perfil do usuario" />
                        <span>parabéns você é um novo apoiador</span>
                    </div>
                )}
                <h1>Seja um apoiador deste projeto 🏆</h1>
                <h3>Contribua com apenas <span>R$ 1,00</span></h3>
                <strong>apareça na nossa home, tenha funcionalidades exclusivas.</strong>

                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: "1"
                                }
                            }]
                        })
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then(function(details){
                            console.log(`Compra aprovada: ${details.payer.name.given_name}`)
                            handleSaveDonate();
                        })
                    }}
                />

            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if (!session?.user?.email) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        nome: session.user.name,
        email: session.user.email,
        image: session.user.image
    }

    return {
        props: {
            user
        }
    }

}