import { ImageResponse } from 'next/og';

// Default link-preview image (WhatsApp, LinkedIn, X, Slack...) for every page.
export const alt = 'CareConnect – Online consultations with licensed doctors';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: 'linear-gradient(135deg, #0c8075 0%, #0c5953 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48 }}>
          {/* Medical cross mark */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 28,
            }}
          >
            <div style={{ display: 'flex', position: 'relative', width: 48, height: 48 }}>
              <div style={{ position: 'absolute', left: 16, top: 0, width: 16, height: 48, borderRadius: 4, background: '#0c8075' }} />
              <div style={{ position: 'absolute', left: 0, top: 16, width: 48, height: 16, borderRadius: 4, background: '#0c8075' }} />
            </div>
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>CareConnect</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          See a licensed doctor online, from home.
        </div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.85 }}>
          Video, voice and secure chat consultations · Your Health, Our Priority
        </div>
      </div>
    ),
    size
  );
}
