import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="heading-h2 text-primary">Datenschutz</h1>
        <div className="prose prose-slate mt-4 text-blue-900">
          <p>Der Schutz Ihrer Daten ist uns wichtig. Diese Seite speichert nur die Daten, die für den Betrieb von KK-Check nötig sind (z. B. Chat-Verlauf oder Erinnerungs-E-Mails, sofern Sie diese nutzen).</p>
          <p>Zur Verbesserung der Website erfassen wir anonymisierte Nutzungsdaten (z. B. welche Seiten besucht werden und welche Funktionen genutzt werden). Diese Daten werden ausschließlich zur Auswertung und Optimierung des Angebots verwendet und nicht an Dritte weitergegeben.</p>
          <p>Wir geben keine personenbezogenen Daten an Dritte weiter. Ausführliche Informationen finden Sie in unserer Datenschutzerklärung auf mmind.ai.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
