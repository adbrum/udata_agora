import type { Metadata } from 'next';
import LoginRegisterClient from '@/components/login/LoginRegisterClient';

export const metadata: Metadata = {
    title: 'Inscrever-se - dados.gov',
    description: 'Inscreva-se no portal dados.gov para aceder a funcionalidades exclusivas. Partilhe e reutilize dados públicos.',
};

export default function LoginRegisterPage() {
    return <LoginRegisterClient />;
}
