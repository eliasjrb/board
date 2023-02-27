import { GetStaticProps } from 'next';
import styles from '../styles/Home.module.scss';
import Head from 'next/head';
import Image from 'next/image';
import imgUser from '../../public/images/board-user.svg'
import firebase from '../services/firevaseConnction';
import { useState } from "react";

type Data = {
  id:string;
  donate: boolean;
  lastDonate: Date;
  image: string
}

interface HomeProps{
  data:string
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))

  return (
    <>
      <Head>
        <title>Bord - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={imgUser} alt='Ferramenta board' />
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia escreva, planeje e organize-se...</h1>
          <p>
            <span>100% gratuito</span> e online.
          </p>
          
          {donaters.length !==0 && <h3>Apoiadores:</h3>}
          <div className={styles.donaters}>
            {donaters.map( item => (
              <Image width={65} height={65} key={item.image} src={item.image} alt={item.id} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
export const getStaticProps: GetStaticProps = async() => {
 
  const donaters = await firebase.firestore().collection('users').get();

  const data = JSON.stringify( donaters.docs.map( u => {
    return {
      id: u.id,
      ...u.data(),
    }
  }))

  return {
    props:{
      data
    },
    revalidate: 60 * 60 // Atualiza a cada 60 minutos; 60 segundos * 60 vezes = 1 hora (60 minutos)
  }
}
