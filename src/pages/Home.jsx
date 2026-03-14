import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPopular, getNowPlaying, searchMovies } from '../api/tmdb';
import { getMyMovieIds } from '../firebase/diary';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

const TABS = [
  { id: 'popular', label: '인기 영화' },
  { id: 'now_playing', label: '현재 상영 중' },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';

  const [tab, setTab] = useState('popular');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [myMovieIds, setMyMovieIds] = useState(new Set());

  const { user } = useAuth();

  // 내가 일기 쓴 영화 ID 목록
  useEffect(() => {
    if (!user) { setMyMovieIds(new Set()); return; }
    getMyMovieIds(user.uid).then(setMyMovieIds).catch(console.error);
  }, [user]);

  const fetchMovies = useCallback(async (currentPage, reset = false) => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await searchMovies(searchQuery, currentPage);
      } else {
        data = tab === 'popular'
          ? await getPopular(currentPage)
          : await getNowPlaying(currentPage);
      }
      setMovies((prev) => reset ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, tab]);

  // 탭/검색어 변경 시 초기화
  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1, true);
  }, [tab, searchQuery, fetchMovies]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMovies(next);
  };

  return (
    <div className="min-h-screen bg-cinema-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* 헤더 */}
        {searchQuery ? (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              "<span className="text-cinema-gold">{searchQuery}</span>" 검색 결과
            </h1>
            <p className="text-cinema-muted text-sm mt-1">{movies.length}개의 영화</p>
          </div>
        ) : (
          <div className="flex gap-4 mb-6 border-b border-white/10">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`pb-3 text-sm font-semibold transition border-b-2 -mb-px ${
                  tab === t.id
                    ? 'border-cinema-gold text-cinema-gold'
                    : 'border-transparent text-cinema-muted hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* 영화 그리드 */}
        {movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={`${movie.id}-${movie.title}`}
                  movie={movie}
                  hasDiary={myMovieIds.has(movie.id)}
                />
              ))}
            </div>

            {/* 더 보기 */}
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-cinema-card border border-white/10 text-white rounded-full hover:bg-white/10 transition text-sm font-medium disabled:opacity-50"
                >
                  {loading ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-cinema-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-cinema-muted">
            {searchQuery ? '검색 결과가 없습니다.' : '영화를 불러오는 중...'}
          </div>
        )}
      </div>
    </div>
  );
}
