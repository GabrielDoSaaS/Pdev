import styles from "./Home.module.css";
import { FiGithub } from "react-icons/fi";
import { FaLaptopCode } from "react-icons/fa";

const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Bem-vindo!</h1>
                <p className={styles.subtitle}>Vamos criar seu portfólio.</p>

                <div className={styles.section}>
                    <label htmlFor="name" className={styles.label}>Escreva seu nome:</label>
                    <div className={styles.inputGroup}>
                        <input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Conecte seu Github</h2>
                    <button className={styles.githubButton}>
                        <FiGithub size={20} />
                        Conectar com Github
                    </button>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Selecione um template de Layout</h2>
                    <div className={styles.templateCards}>
                        {/* Card 1: Layout com foto centralizada */}
                        <div className={`${styles.templateCard} ${styles.template1}`}>
                            <div className={styles.templateImagePlaceholder}></div>
                            <h3 className={styles.templateTitle}>Centralizado</h3>
                            <p className={styles.templateDescription}>Layout minimalista com foto e informações principais no centro.</p>
                        </div>
                        
                        {/* Card 2: Layout com sidebar */}
                        <div className={`${styles.templateCard} ${styles.template2}`}>
                            <div className={styles.templateSidebarPlaceholder}></div>
                            <div className={styles.templateContentPlaceholder}></div>
                            <h3 className={styles.templateTitle}>Com Sidebar</h3>
                            <p className={styles.templateDescription}>Layout com menu lateral para navegação entre seções.</p>
                        </div>

                        {/* Card 3: Layout com cabeçalho grande e seções horizontais */}
                        <div className={`${styles.templateCard} ${styles.template3}`}>
                            <div className={styles.templateHeaderPlaceholder}></div>
                            <div className={styles.templateContentPlaceholder}></div>
                            <h3 className={styles.templateTitle}>Full-width</h3>
                            <p className={styles.templateDescription}>Layout moderno com cabeçalho amplo e seções que ocupam toda a largura.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <label htmlFor="sections" className={styles.label}>Quantas seções terão o portfólio?</label>
                    <div className={styles.inputGroup}>
                        <input
                            id="sections"
                            type="number"
                            placeholder="Ex: 5"
                            className={styles.input}
                        />
                    </div>
                </div>

                <button className={styles.submitButton}>
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Home;