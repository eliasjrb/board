import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import firebase from "../../services/firevaseConnction"
import { format } from "date-fns"

import Head from "next/head"
import styles from './task.module.scss'
import { FiCalendar } from "react-icons/fi"

type Task = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    tarefa: string;
    userEmail: string;
    nome: string;
}

interface TasklistProps{
    data: string;
}

export default function Task({ data }: TasklistProps){
    const task = JSON.parse(data) as Task;

    return(
        <>
            <Head>
                <title>Detalhes da sua tarefa</title>
            </Head>
            <article className={styles.container}>
                <div className={styles.actions}>
                    <div>
                        <FiCalendar size={30} color="#FFF"/>
                        <span>Tarefa criada:</span>
                        <time>{task.createdFormated}</time>
                    </div>
                </div>
                <p>{task.tarefa}</p>
            </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const { id } = params;
    const session = await getSession({ req });

    const vip = await firebase.firestore().collection('users')
    .doc(session?.user?.email)
    .get()
    .then(snapshot =>{
        if(snapshot.exists){
            return snapshot.data().lastDonate.toDate();
          }else{
            return null;
          }
    })
    if(!vip){
        return{
            redirect:{
                destination: '/board',
                permanent: false,
            }
        }
    }

    const data = await firebase.firestore().collection('tarefas')
    .doc(String(id))
    .get()
    .then((snapshot) => {
        const data = {
            id: snapshot.id,
            created: snapshot.data().created,
            createdFormated: format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
            tarefa: snapshot.data().tarefa,
            userEmail: snapshot.data().userEmail,
            nome: snapshot.data().nome
        }

        return JSON.stringify(data);
    })


    return{
        props:{
            data
        }
    }
}