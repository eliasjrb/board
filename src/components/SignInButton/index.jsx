import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

import style from './styles.module.scss';
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SingInButton() {
    const { data: session } = useSession();

    return session ? (
        <button
            type='button'
            className={style.signInButton}
            onClick={() => signOut()}
        >
            <Image width={35} height={35} src={session.user.image} alt='foto do usuario' />
            Olá {session.user.name}
            <FiX color='#737380' className={style.closeIcon} />
        </button>
    ) : (
        <button
            type='button'
            className={style.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color='#FFB800' />
            Entrar com Github
        </button>
    )
}