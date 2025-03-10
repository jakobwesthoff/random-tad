export default function Imprint() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Impressum (Imprint)
      </h1>

      <div className="text-gray-600 mb-6 italic">
        <p>The following information is required by german law and therefore in german language.</p>
      </div>

      <div className="space-y-6 text-gray-700">
        <p className="font-medium text-gray-800">Angaben gemäß § 5 TMG</p>

        <div className="ml-1">
          <p className="mb-4">
            Jakob Westhoff<br />
            Am Bollwerk 6<br />
            58300 Wetter<br />
          </p>

          <p className="mb-4">
            <span className="font-semibold">Vertreten durch: </span><br />
            Jakob Westhoff<br />
          </p>

          <p className="mb-4">
            <span className="font-semibold">Kontakt: </span><br />
            Telefon: 0170 - 7345289<br />
            E-Mail: randomtad at westhoffswelt.de
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="font-semibold mb-2">Haftungsausschluss:</p>

          <div className="ml-1 space-y-4">
            <div>
              <p className="font-semibold mb-2">Haftung für Inhalte</p>
              <p className="text-sm text-gray-600">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
                die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
                jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß §
                7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
                Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
                jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen
                zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
                Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
                von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
                entfernen.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">Haftung für Links</p>
              <p className="text-sm text-gray-600">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
                Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
                Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
                verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
                nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
                Links umgehend entfernen.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">Urheberrecht</p>
              <p className="text-sm text-gray-600">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
                Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
                Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
                des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
                Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für
                den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte
                auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
                Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
                Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
                werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">Datenschutz</p>
              <p className="text-sm text-gray-600">
                Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener
                Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise
                Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit
                möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche
                Zustimmung nicht an Dritte weitergegeben.
                <br /><br />
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei
                der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser
                Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                <br /><br />
                Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten
                durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung
                und Informationsmaterialien wird hiermit ausdrücklich widersprochen.
                Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte
                im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch
                Spam-Mails, vor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
