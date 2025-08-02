import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiMail, FiLock } from "react-icons/fi";

import styles from "./Login.module.css";

const loginSchema = z.object({
  email: z.string()
    .email("E-mail inválido")
    .max(100, "E-mail muito longo"),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: LoginFormData) => {
   
    console.log("Dados do login:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert("Login realizado com sucesso!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bem-vindo ao <span className={styles.brand}>Pdev</span></h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

          <div className={styles.forgotPassword}>
            <a href="/forgot-password">Esqueceu sua senha?</a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.registerLink}>
            <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;