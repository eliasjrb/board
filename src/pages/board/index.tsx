import { useState, FormEvent } from "react"
import Head from "next/head"
import { GetServerSideProps } from "next"
import { getSession } from 'next-auth/react'

import styles from "./styles.module.scss"
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from "react-icons/fi"
import { SupportButton } from "../../components/SupportButton";

import firebase from '../../services/firevaseConnction'
import { format } from "date-fns"
import Link from "next/link"

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    tarefa: string;
    userEmail: string;
    nome: string;
}

interface BoardProps {
    user: {
        email: string;
        nome: string;
    }
    data: string;
}

export default function Board({ user, data }: BoardProps) {
    const [input, setInput] = useState('');
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

    async function handleAddTask(e: FormEvent){
        e.preventDefault()
        
        if(input === ''){
            alert('Preencha alguma tarefa!')
            return;
        }

        if(taskEdit){
            await firebase.firestore().collection('tarefas')
            .doc(taskEdit.id)
            .update({
                tarefa: input
            })
            .then(()=>{
                console.log('TAREFA ATUALIZADA COM SUCESSO')
                let data = taskList;
                let taskIndex = taskList.findIndex(item =>  item.id === taskEdit.id);
                data[taskIndex].tarefa = input;
                setTaskList(data);
                setTaskEdit(null);
                setInput('');
            })

            return;
        }

        await firebase.firestore().collection('tarefas')
        .add({
            created: new Date(),
            tarefa: input,
            userEmail: user.email,
            nome: user.nome
        })
        .then((doc)=>{
            console.log('CADASTRADO COM SUCESSO!')
            let data: TaskList = {
                id: doc.id,
                created: new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                tarefa: input,
                userEmail: user.email,
                nome: user.nome
            }

            setTaskList([...taskList, data])
            setInput('');
        })
        .catch((err) => {
            console.log('ERRO AO CADASTRAR', err)
        })
    }

    async function handleUpdateTask(){
       let tasks=  await firebase.firestore().collection('tarefas').doc().get();
        setTaskList(tasks.data().map( u => u))
    }

    async function handleDelete(id){
        await firebase.firestore().collection('tarefas').doc(id)
        .delete()
        .then(() => {
            console.log('DELETADO COM SUCESSO')

            let taskDeleted = taskList.filter( item => {
                return( item.id !== id)
            });

            setTaskList(taskDeleted);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function handleEditTask(task: TaskList){
        setTaskEdit(task);
        setInput(task.tarefa);
    }

    function handleCancelEdit(){
        setInput('');
        setTaskEdit(null);
    }

    return (
        <>
            <Head>
                <title>Minhas tarefas</title>
            </Head>
            <main className={styles.container}>
                
                {taskEdit && (
                    <span className={styles.warnText}>
                        <button onClick={()=>{handleCancelEdit()}}>
                            <FiX size={30} color="#FF3636" />
                        </button>
                        Você está editando uma tarefa!
                    </span>
                )}

                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="digite sua tarefa..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button type="submit">
                        <FiPlus />
                    </button>
                </form>
                <h1>Você tem {taskList.length} {taskList.length > 1 ? 'tarefas' : 'tarefa' }</h1>

                <section>
                { taskList.map((taskList) => {
                    return(                     
                            <article key={taskList.id} className={styles.taskList}>
                                <Link href={`/board/${taskList.id}`}>
                                    <p>{taskList.tarefa}</p>
                                </Link>
                                <div className={styles.actions}>
                                    <div>
                                        <div>
                                            <FiCalendar size={20} color="#FFB800" />
                                            <time>{taskList.createdFormated}</time>
                                        </div>
                                        <button onClick={() =>{ handleEditTask(taskList)}}>
                                            <FiEdit2 size={20} color="#FFF" />
                                            <span>Editar</span>
                                        </button>
                                    </div>

                                    <button onClick={() =>{ handleDelete(taskList.id) }}>
                                        <FiTrash size={20} color="#FF3636" />
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </article>
                        )})
                    }
                </section>
            </main>

            <div className={styles.vipContainer}>
                <h3>Obrigado por apoiar esse projeto.</h3>
                <div>
                    <FiClock size={28} color="#FFF" />
                    <time>
                        Útima doação foi a 3 dias.
                    </time>
                </div>
            </div>

            <SupportButton />
        </>
    )
}


export const getServerSideProps: GetServerSideProps  = async ({ req }) => {
    const session = await getSession({ req });

    if(!session?.user?.email) {
        //se o user nao tiver logado vamos redirecionar.
        return {
            redirect:{
                destination: '/',
                permanent: false
            }
        }
    }

   const tasks =  await firebase.firestore().collection('tarefas')
   .where('userEmail',  '==', session.user.email)
   .orderBy('created', 'asc').get();

   const data = JSON.stringify(tasks.docs.map( u => {
    return{
        id: u.id,
        createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
        ...u.data(),
    }
   }) )

    const user = {
        nome: session.user.name,
        email: session.user?.email
    }

    return {
        props: {
            user,
            data
        }
    }
}