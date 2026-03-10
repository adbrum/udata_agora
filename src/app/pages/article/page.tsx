import ArticleClient from '@/components/articles/ArticleClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Últimas novidades - dados.gov',
    description: 'Acompanhe as últimas novidades, eventos e publicações sobre dados abertos em Portugal.',
};

export default function ArticleListPage() {
    return <ArticleClient />;
}
