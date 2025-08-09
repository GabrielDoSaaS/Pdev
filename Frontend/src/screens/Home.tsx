import styles from "./Home.module.css";
import { FiGithub } from "react-icons/fi";
import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const availableColors = [
    '#000000', '#1F2937', '#DC2626', '#2563EB', '#059669', '#EAB308', '#9333EA', '#BE185D'
];

const Home = () => {
    const [githubLinks, setGithubLinks] = useState<string[]>(['']);
    const [showGithubInputs, setShowGithubInputs] = useState(false);
    const [sectionCount, setSectionCount] = useState(0);
    const [sections, setSections] = useState<{ title: string, description: string }[]>([]);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('#000000');

    const handleAddLink = () => {
        setGithubLinks([...githubLinks, '']);
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = githubLinks.filter((_, i) => i !== index);
        setGithubLinks(newLinks);
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...githubLinks];
        newLinks[index] = value;
        setGithubLinks(newLinks);
    };

    const handleRepositories = async () => {
        await axios.post('http://localhost:3000/api/get-repo-info', JSON.stringify(
            githubLinks
        ), {
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const toggleGithubInputs = () => {
        setShowGithubInputs(!showGithubInputs);
    };

    const handleSectionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value, 10);
        setSectionCount(isNaN(count) ? 0 : count);
        setSections(
            Array.from({ length: isNaN(count) ? 0 : count }, () => ({ title: '', description: '' }))
        );
    };

    const handleSectionChange = (index: number, field: 'title' | 'description', value: string) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setSections(newSections);
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleColorSelection = (color: string) => {
        setSelectedColor(color);
    };

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
                    <label htmlFor="profileImage" className={styles.label}>Adicione sua foto de perfil:</label>
                    <div className={styles.inputGroup}>
                        <label htmlFor="profileImage" className={styles.fileInputLabel}>
                            {profileImage ? 'Mudar foto' : 'Escolher foto'}
                        </label>
                        <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className={styles.fileInput}
                        />
                        {profileImagePreview && (
                            <img src={profileImagePreview} alt="Pré-visualização da foto de perfil" className={styles.profileImagePreview} />
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Escolha uma cor principal para o seu portfólio</h2>
                    <div className={styles.colorPalette}>
                        {availableColors.map((color, index) => (
                            <div
                                key={index}
                                className={`${styles.colorCircle} ${selectedColor === color ? styles.selectedColor : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorSelection(color)}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <button className={styles.githubButton} onClick={toggleGithubInputs}>
                        <FiGithub size={20} />
                        Adicione repositórios do GitHub ao portfólio
                    </button>
                    {showGithubInputs && (
                        <div className={styles.githubLinksContainer}>
                            {githubLinks.map((link, index) => (
                                <div key={index} className={styles.githubInputItem}>
                                    <input
                                        type="text"
                                        placeholder="Link do repositório"
                                        value={link}
                                        onChange={(e) => handleLinkChange(index, e.target.value)}
                                        className={styles.input}
                                    />
                                    {githubLinks.length > 1 && (
                                        <button onClick={() => handleRemoveLink(index)} className={styles.removeButton}>
                                            <FaMinusCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button onClick={handleAddLink} className={styles.addButton}>
                                <FaPlusCircle size={20} /> Adicionar outro repositório
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Selecione um template de Layout</h2>
                    <div className={styles.templateCards}>
                        <div className={`${styles.templateCard} ${styles.template1}`}>
                            <div className={styles.templateImagePlaceholder}></div>
                            <h3 className={styles.templateTitle}>Centralizado</h3>
                            <p className={styles.templateDescription}>Layout minimalista com foto e informações principais no centro.</p>
                        </div>

                        <div className={`${styles.templateCard} ${styles.template2}`}>
                            <div className={styles.templateSidebarPlaceholder}></div>
                            <div className={styles.templateContentPlaceholder}></div>
                            <h3 className={styles.templateTitle}>Com Sidebar</h3>
                            <p className={styles.templateDescription}>Layout com menu lateral para navegação entre seções.</p>
                        </div>

                        <div className={`${styles.templateCard} ${styles.template3}`}>
                            <div className={styles.templateHeaderPlaceholder}></div>
                            <div className={styles.templateContentPlaceholder}></div>
                            <h3 className={styles.templateTitle}>Full-width</h3>
                            <p className={styles.templateDescription}>Layout moderno com cabeçalho amplo e seções que ocupam toda a largura.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <label htmlFor="sections" className={styles.label}>Quantas seções terão o portfólio? (Sem contar com a seção de projetos)</label>
                    <div className={styles.inputGroup}>
                        <input
                            id="sections"
                            type="number"
                            placeholder="Ex: 5"
                            className={styles.input}
                            value={sectionCount}
                            onChange={handleSectionCountChange}
                        />
                    </div>
                </div>

                {sections.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Conteúdo das seções</h2>
                        {sections.map((section, index) => (
                            <div key={index} className={styles.section}>
                                <label htmlFor={`sectionTitle-${index}`} className={styles.label}>
                                    Título da seção {index + 1}:
                                </label>
                                <div className={styles.inputGroup}>
                                    <input
                                        id={`sectionTitle-${index}`}
                                        type="text"
                                        placeholder={`Título da seção ${index + 1}`}
                                        className={styles.input}
                                        value={section.title}
                                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                    />
                                </div>
                                <label htmlFor={`sectionDescription-${index}`} className={styles.label}>
                                    Descrição da seção {index + 1}:
                                </label>
                                <div className={styles.inputGroup}>
                                    <textarea
                                        id={`sectionDescription-${index}`}
                                        placeholder={`Descrição detalhada da seção ${index + 1}`}
                                        className={styles.input}
                                        value={section.description}
                                        onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button className={styles.submitButton} onClick={() => handleRepositories()}>
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Home;