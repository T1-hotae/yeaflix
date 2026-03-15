import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Yeflix',
  description: '나만의 영화 일기장',
  icons: { icon: '/assets/yeflix.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-cinema-bg">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
