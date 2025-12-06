import { ImageResponse } from 'next/og';
import { getPublicSantaList } from '@/actions/santa-list';

export const runtime = 'edge';
export const alt = "Santa's Gift List";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const data = await getPublicSantaList(params.slug);

  const childName = data?.profile?.name || 'Someone Special';
  const itemCount = data?.items.length || 0;
  const topGifts = data?.items.slice(0, 3).map((item) => item.gift.name) || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fee2e2 0%, #dcfce7 100%)',
          fontFamily: 'system-ui',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '80px' }}>&#127877;</span>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#991b1b',
              marginLeft: '20px',
            }}
          >
            Santa&apos;s Workshop
          </span>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            borderRadius: '20px',
            padding: '40px 60px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '10px',
            }}
          >
            {childName}&apos;s Gift List
          </span>

          <span
            style={{
              fontSize: '24px',
              color: '#4b5563',
              marginBottom: '20px',
            }}
          >
            {itemCount} wonderful gift{itemCount !== 1 ? 's' : ''} picked by Santa&apos;s elves
          </span>

          {topGifts.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {topGifts.map((gift, i) => (
                <span
                  key={i}
                  style={{
                    background: '#fef2f2',
                    color: '#991b1b',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '18px',
                  }}
                >
                  &#127873; {gift}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <span
          style={{
            marginTop: '30px',
            fontSize: '20px',
            color: '#16a34a',
          }}
        >
          Create your own list at santas-workshop.vercel.app
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
