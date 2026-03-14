import { LOGO_BASE } from '../api/tmdb';

// 주요 스트리밍 서비스 색상 매핑
const PROVIDER_COLORS = {
  Netflix: 'hover:ring-red-500',
  'Watcha': 'hover:ring-red-400',
  'wavve': 'hover:ring-blue-400',
  'TVING': 'hover:ring-red-600',
  'Coupang Play': 'hover:ring-yellow-400',
  'Disney Plus': 'hover:ring-blue-600',
  'Apple TV Plus': 'hover:ring-gray-300',
  'Amazon Prime Video': 'hover:ring-blue-400',
};

function ProviderButton({ provider, link }) {
  const colorClass = PROVIDER_COLORS[provider.provider_name] ?? 'hover:ring-white/40';

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      title={`${provider.provider_name}에서 보기`}
      className={`flex flex-col items-center gap-1.5 group`}
    >
      <div className={`w-12 h-12 rounded-xl overflow-hidden ring-2 ring-transparent ${colorClass} transition-all duration-150 shadow-lg`}>
        <img
          src={`${LOGO_BASE}${provider.logo_path}`}
          alt={provider.provider_name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs text-cinema-muted group-hover:text-white transition text-center leading-tight">
        {provider.provider_name}
      </span>
    </a>
  );
}

export default function WatchProviders({ providers }) {
  if (!providers) {
    return (
      <div className="text-cinema-muted text-sm py-2">
        국내 스트리밍 서비스 정보가 없습니다.
      </div>
    );
  }

  const { flatrate, rent, buy, link } = providers;

  const hasAny = flatrate?.length || rent?.length || buy?.length;

  if (!hasAny) {
    return (
      <div className="text-cinema-muted text-sm py-2">
        현재 국내에서 이용 가능한 스트리밍 서비스가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flatrate?.length > 0 && (
        <div>
          <p className="text-xs text-cinema-muted mb-3 uppercase tracking-wider font-semibold">
            스트리밍 구독
          </p>
          <div className="flex flex-wrap gap-4">
            {flatrate.map((p) => (
              <ProviderButton key={p.provider_id} provider={p} link={link} />
            ))}
          </div>
        </div>
      )}

      {rent?.length > 0 && (
        <div>
          <p className="text-xs text-cinema-muted mb-3 uppercase tracking-wider font-semibold">
            렌탈
          </p>
          <div className="flex flex-wrap gap-4">
            {rent.map((p) => (
              <ProviderButton key={p.provider_id} provider={p} link={link} />
            ))}
          </div>
        </div>
      )}

      {buy?.length > 0 && (
        <div>
          <p className="text-xs text-cinema-muted mb-3 uppercase tracking-wider font-semibold">
            구매
          </p>
          <div className="flex flex-wrap gap-4">
            {buy.map((p) => (
              <ProviderButton key={p.provider_id} provider={p} link={link} />
            ))}
          </div>
        </div>
      )}

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-cinema-muted hover:text-cinema-gold transition mt-1"
      >
        JustWatch에서 전체 보기 →
      </a>
    </div>
  );
}
