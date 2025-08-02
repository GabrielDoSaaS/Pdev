import styles from "./Plans.module.css";
import { FiCheckCircle } from "react-icons/fi";

const Plans = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Nossos Planos</h1>
                <p className={styles.subtitle}>Escolha o melhor para você</p>
            </div>

            <div className={styles.plansGrid}>
                <div className={styles.planCard}>
                    <div className={styles.planHeader}>
                        <h2 className={styles.planTitle}>Plano Mensal</h2>
                        <p className={styles.planPrice}>
                            <span className={styles.priceValue}>R$ 10,00</span>
                            <span className={styles.pricePeriod}>/mês</span>
                        </p>
                    </div>

                    <div className={styles.planFeatures}>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Criação de portfólio em menos de 2 minutos</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Deploy automático após criação</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Criação automática de cards e README para seus projetos</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Projetos com domínio automático do tipo: https://[seu-nome].onrender.com</p>
                        </div>
                    </div>

                    <button className={styles.selectPlanButton}>Selecionar Plano</button>
                </div>

                <div className={styles.planCard}>
                    <div className={styles.planHeader}>
                        <h2 className={styles.planTitle}>Plano Anual</h2>
                        <p className={styles.planPrice}>
                            <span className={styles.priceValue}>R$ 100,00</span>
                            <span className={styles.pricePeriod}>/ano</span>
                        </p>
                    </div>

                    <div className={styles.planFeatures}>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Criação de portfólio em menos de 2 minutos</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Deploy automático após criação</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Criação automática de cards e README para seus projetos</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FiCheckCircle size={18} className={styles.checkIcon} />
                            <p>Projetos com domínio automático do tipo: https://[seu-nome].onrender.com</p>
                        </div>
                    </div>
                    <button className={`${styles.selectPlanButton} ${styles.highlightButton}`}>
                        Selecionar Plano
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Plans;