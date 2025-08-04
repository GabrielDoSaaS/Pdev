import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";
import axios from 'axios';
import styles from "./Register.module.css";

const registerSchema = z.object({
  fullName: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome muito longo"),
  email: z.string()
    .email("E-mail inválido")
    .max(100, "E-mail muito longo"),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha muito longa")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número"),
  confirmPassword: z.string(),
  agreeTerms: z.boolean()
    .refine(val => val, "Você deve aceitar os termos")
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Dados do formulário:", data);
    
    await axios.post('http://localhost:3000/register', data, {
      headers: {"Content-Type": "application/json"}
    }).then((response)=>{console.log(response.data)})

    alert("Cadastro realizado com sucesso!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crie sua conta no <span className={styles.brand}>Pdev</span></h1>
          <p className={styles.subtitle}>Desenvolva seu potencial</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FiUser size={18} />
            </div>
            <input
              type="text"
              placeholder="Nome completo"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className={styles.error}>{errors.fullName.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FiMail size={18} />
            </div>
            <input
              type="email"
              placeholder="E-mail"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FiLock size={18} />
            </div>
            <input
              type="password"
              placeholder="Senha"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FiLock size={18} />
            </div>
            <input
              type="password"
              placeholder="Confirme sua senha"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agreeTerms"
              className={styles.checkbox}
              {...register("agreeTerms")}
            />
            <label htmlFor="agreeTerms" className={styles.checkboxLabel}>
              <FiCheck className={styles.checkIcon} />
              Concordo com os Termos de Uso e Política de Privacidade
            </label>
            {errors.agreeTerms && (
              <p className={styles.error}>{errors.agreeTerms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>

          <div className={styles.loginLink}>
            <p>Já tem uma conta? <a href="/login">Faça login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;