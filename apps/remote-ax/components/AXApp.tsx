export default function AXApp() {
  return (
    <main className="ax-remote">
      <section className="ax-panel">
        <p>AX (AI Transformation)</p>
        <h1>Hello AX</h1>
      </section>
      <style jsx>{`
        .ax-remote {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f6f7fb;
          color: #171717;
          padding: 32px;
        }

        .ax-panel {
          width: min(100%, 680px);
          border: 1px solid #d9dce7;
          border-radius: 8px;
          background: #ffffff;
          padding: 32px;
        }

        .ax-panel p {
          margin: 0 0 10px;
          color: #626b7f;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .ax-panel h1 {
          margin: 0;
          font-size: 36px;
          line-height: 1.1;
        }
      `}</style>
    </main>
  );
}
