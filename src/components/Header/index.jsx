import Link from 'next/link'
import { SingInButton } from '../SignInButton'
import styles from './styles.module.scss'
import Image from 'next/image'
import logoImg from '../../../public/images/logo.svg'

export function Header() {
    return (
        <>
            <header className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <Link href="/">
                        <Image src={logoImg} id='logo' alt="Logo Meu board" />
                    </Link>
                    <nav>
                        <Link href="/" className={styles.link}>
                            <span>Home</span>
                        </Link>
                        <Link href="/board" className={styles.link}>
                           <span>Meu board</span> 
                        </Link>

                    </nav>

                    <SingInButton/>
                </div>
            </header>
        </>
    )
}